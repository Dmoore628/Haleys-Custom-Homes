/**
 * Signed session tokens for the admin, verified with Web Crypto so the same code runs in the
 * middleware and on the server. A token is `payload.signature`, both base64url; the payload
 * carries the admin id, email and expiry. Nothing secret is in the payload; the HMAC-SHA256
 * signature (keyed by SESSION_SECRET) is what makes it unforgeable.
 */
export const SESSION_COOKIE = 'hch_admin';
export const SESSION_DAYS = 14;

export interface Session {
  sub: string;
  email: string;
  exp: number;
}

const enc = new TextEncoder();

function b64url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = '';
  arr.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(s: string): Uint8Array<ArrayBuffer> {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  const out = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function sessionSecret(): string | null {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  // Development only: a fixed secret so local sign-in works without setup. Never in production.
  if (process.env.NODE_ENV !== 'production')
    return 'development-only-session-secret-not-for-production';
  return null;
}

async function key(secret: string) {
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

export async function signSession(session: Session, secret: string): Promise<string> {
  const payload = b64url(enc.encode(JSON.stringify(session)));
  const sig = await crypto.subtle.sign('HMAC', await key(secret), enc.encode(payload));
  return `${payload}.${b64url(sig)}`;
}

export async function verifySession(
  token: string | undefined,
  secret: string | null,
): Promise<Session | null> {
  if (!token || !secret) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  try {
    const ok = await crypto.subtle.verify(
      'HMAC',
      await key(secret),
      fromB64url(sig),
      enc.encode(payload),
    );
    if (!ok) return null;
    const session = JSON.parse(new TextDecoder().decode(fromB64url(payload))) as Session;
    if (typeof session.exp !== 'number' || session.exp < Date.now() / 1000) return null;
    return session;
  } catch {
    return null;
  }
}
