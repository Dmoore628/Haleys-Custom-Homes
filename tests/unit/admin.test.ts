import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { signSession, verifySession } from '@/lib/auth/session';
import { slugify } from '@/lib/slug';

describe('admin security', () => {
  it('hashes passwords with a per-password salt and verifies only the right one', async () => {
    const a = await hashPassword('correct horse battery');
    const b = await hashPassword('correct horse battery');
    expect(a).not.toBe(b);
    expect(a).toMatch(/^scrypt\$32768\$8\$1\$/);
    expect(await verifyPassword('correct horse battery', a)).toBe(true);
    expect(await verifyPassword('correct horse batterx', a)).toBe(false);
    expect(await verifyPassword('anything', 'not-a-hash')).toBe(false);
  });

  it('accepts only untampered, unexpired sessions signed with the same secret', async () => {
    const secret = 'x'.repeat(40);
    const exp = Math.floor(Date.now() / 1000) + 60;
    const token = await signSession({ sub: '1', email: 'a@b.co', exp }, secret);
    expect(await verifySession(token, secret)).toMatchObject({ sub: '1' });
    expect(await verifySession(token, 'y'.repeat(40))).toBeNull();
    const [payload, sig] = token.split('.');
    const forged = Buffer.from(JSON.stringify({ sub: '2', email: 'a@b.co', exp })).toString(
      'base64url',
    );
    expect(await verifySession(`${forged}.${sig}`, secret)).toBeNull();
    expect(await verifySession(`${payload}.`, secret)).toBeNull();
    const expired = await signSession({ sub: '1', email: 'a@b.co', exp: 1 }, secret);
    expect(await verifySession(expired, secret)).toBeNull();
    expect(await verifySession(undefined, secret)).toBeNull();
  });

  it('turns project names into clean web addresses', () => {
    expect(slugify('Heaven at Sunset')).toBe('heaven-at-sunset');
    expect(slugify('  Café & Terrace — 2024! ')).toBe('cafe-and-terrace-2024');
    expect(slugify('---')).toBe('');
  });
});
