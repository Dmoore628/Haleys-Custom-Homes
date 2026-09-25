import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import siteConfig from '@content/site.config';
import { inquirySchema, type Inquiry } from '@/lib/schema';
import { createRateLimiter } from '@/lib/rateLimit';

// Server-only: SMTP credentials are read here and never reach the client bundle.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const allow = createRateLimiter(5, 10 * 60 * 1000); // 5 submissions per IP per 10 minutes

function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : undefined;
}

function formatBody(i: Inquiry): string {
  return [
    `Name: ${i.name}`,
    `Email: ${i.email}`,
    `Phone: ${i.phone}`,
    `Project Type: ${i.projectType}`,
    `Budget Range: ${i.budget}`,
    `Location or Neighborhood: ${i.location || '(not given)'}`,
    `Lot or site selected: ${i.lot || '(not given)'}`,
    '',
    'Message:',
    i.message || '(none)',
  ].join('\n');
}

export async function POST(request: Request) {
  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  if (!allow(ip)) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  // Validate every field server-side; the client check alone can always be bypassed.
  const parsed = inquirySchema.safeParse(payload);
  if (!parsed.success) {
    const fields = parsed.error.issues.map((i) => i.path.join('.'));
    return NextResponse.json({ ok: false, error: 'invalid', fields }, { status: 422 });
  }
  const inquiry = parsed.data;

  // Honeypot filled: pretend success, send nothing.
  if (inquiry.company) return NextResponse.json({ ok: true });

  const host = env('SMTP_HOST');
  const to = env('CONTACT_TO_ADDRESS');
  if (!host || !to) {
    console.error('[contact] SMTP_HOST or CONTACT_TO_ADDRESS is not configured');
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }

  const port = Number(env('SMTP_PORT') ?? 587);
  const user = env('SMTP_USER');
  const pass = env('SMTP_PASSWORD');
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
  });

  try {
    await transporter.sendMail({
      from: env('CONTACT_FROM_ADDRESS') ?? user ?? to,
      to,
      replyTo: `${inquiry.name} <${inquiry.email}>`,
      subject: `New inquiry: ${inquiry.projectType}, ${inquiry.budget} (${siteConfig.name} website)`,
      text: formatBody(inquiry),
    });
  } catch (err) {
    console.error('[contact] send failed', err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, error: 'send_failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
