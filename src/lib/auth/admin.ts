import 'server-only';
import { cookies, headers } from 'next/headers';
import { ensureDatabase, hasDatabase, sql } from '@/lib/db';
import { MIN_PASSWORD_LENGTH, hashPassword, verifyPassword } from './password';
import {
  SESSION_COOKIE,
  SESSION_DAYS,
  type Session,
  sessionSecret,
  signSession,
  verifySession,
} from './session';

const WINDOW_MINUTES = 15;
const MAX_FAILURES = 6;

export type SignInResult = { ok: true } | { ok: false; error: string };

function clientIp(): string {
  const h = headers();
  return (h.get('x-forwarded-for')?.split(',')[0] ?? h.get('x-real-ip') ?? 'unknown').trim();
}

/**
 * The first admin comes from ADMIN_EMAIL and ADMIN_PASSWORD: when no admin exists yet, signing
 * in with exactly those creates the account (password hashed). After that the variables are
 * ignored and can be removed; further admins are added with `npm run admin -- add`.
 */
async function bootstrapAdmin(email: string, password: string): Promise<boolean> {
  const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const envPassword = process.env.ADMIN_PASSWORD;
  if (!envEmail || !envPassword || envPassword.length < MIN_PASSWORD_LENGTH) return false;
  const [{ count }] = await sql()<{ count: string }[]>`SELECT count(*)::text AS count FROM admins`;
  if (Number(count) > 0 || email !== envEmail || password !== envPassword) return false;
  await sql()`INSERT INTO admins (email, password_hash) VALUES (${envEmail}, ${await hashPassword(envPassword)})
    ON CONFLICT (email) DO NOTHING`;
  return true;
}

export async function signIn(emailInput: string, password: string): Promise<SignInResult> {
  if (!hasDatabase())
    return { ok: false, error: 'No database is connected yet. See docs/ADMIN.md.' };
  const secret = sessionSecret();
  if (!secret) return { ok: false, error: 'SESSION_SECRET is not set. See docs/ADMIN.md.' };
  await ensureDatabase();
  const db = sql();
  const email = emailInput.trim().toLowerCase();
  const rateKey = `${clientIp()}|${email}`;

  await db`DELETE FROM login_attempts WHERE attempted_at < now() - ${`${WINDOW_MINUTES} minutes`}::interval`;
  const [{ failures }] = await db<{ failures: number }[]>`
    SELECT count(*)::int AS failures FROM login_attempts WHERE key = ${rateKey}`;
  if (failures >= MAX_FAILURES) {
    return { ok: false, error: `Too many attempts. Try again in ${WINDOW_MINUTES} minutes.` };
  }

  await bootstrapAdmin(email, password);
  const [admin] = await db<{ id: string; password_hash: string }[]>`
    SELECT id::text, password_hash FROM admins WHERE email = ${email}`;
  // Hash even when the email is unknown, so response time doesn't reveal which emails exist.
  const valid = admin
    ? await verifyPassword(password, admin.password_hash)
    : (await hashPassword(password), false);
  if (!admin || !valid) {
    await db`INSERT INTO login_attempts (key) VALUES (${rateKey})`;
    return { ok: false, error: 'That email and password don’t match.' };
  }

  await db`DELETE FROM login_attempts WHERE key = ${rateKey}`;
  await db`UPDATE admins SET last_login_at = now() WHERE id = ${admin.id}`;
  const exp = Math.floor(Date.now() / 1000) + SESSION_DAYS * 86400;
  const token = await signSession({ sub: admin.id, email, exp }, secret);
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_DAYS * 86400,
  });
  return { ok: true };
}

export function signOut() {
  cookies().delete(SESSION_COOKIE);
}

/** The signed-in admin, or null. The signature and expiry are checked; the account must still exist. */
export async function currentAdmin(): Promise<Session | null> {
  const session = await verifySession(cookies().get(SESSION_COOKIE)?.value, sessionSecret());
  if (!session || !hasDatabase()) return null;
  await ensureDatabase();
  const rows = await sql()`SELECT 1 FROM admins WHERE id = ${session.sub}`;
  return rows.length ? session : null;
}

export class UnauthorizedError extends Error {
  constructor() {
    super('Not signed in');
  }
}

/** For server actions and admin API routes: throws unless a valid admin session is present. */
export async function requireAdmin(): Promise<Session> {
  const admin = await currentAdmin();
  if (!admin) throw new UnauthorizedError();
  return admin;
}

/** Rejects cross-site requests to admin API routes (server actions check this themselves). */
export function assertSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (!origin || !host || new URL(origin).host !== host) throw new UnauthorizedError();
}

export async function changePassword(
  adminId: string,
  current: string,
  next: string,
): Promise<SignInResult> {
  if (next.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, error: `Use at least ${MIN_PASSWORD_LENGTH} characters.` };
  }
  const [admin] = await sql()<
    { password_hash: string }[]
  >`SELECT password_hash FROM admins WHERE id = ${adminId}`;
  if (!admin || !(await verifyPassword(current, admin.password_hash))) {
    return { ok: false, error: 'Your current password is incorrect.' };
  }
  await sql()`UPDATE admins SET password_hash = ${await hashPassword(next)} WHERE id = ${adminId}`;
  return { ok: true };
}
