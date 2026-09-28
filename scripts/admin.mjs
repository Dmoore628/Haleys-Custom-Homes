#!/usr/bin/env node
/**
 * Manage portfolio admin accounts from the command line.
 *
 *   node --env-file=.env.local scripts/admin.mjs list
 *   node --env-file=.env.local scripts/admin.mjs add dan@haleycustomhomes.com
 *   node --env-file=.env.local scripts/admin.mjs reset dan@haleycustomhomes.com
 *   node --env-file=.env.local scripts/admin.mjs remove someone@example.com
 *
 * `add` and `reset` ask for the new password (hidden), or read ADMIN_NEW_PASSWORD. The env file
 * needs DATABASE_URL pointing at the production database (see docs/ADMIN.md).
 */
import { randomBytes, scrypt as scryptCb } from 'node:crypto';
import { stdin, stdout } from 'node:process';
import readline from 'node:readline';
import { promisify } from 'node:util';
import postgres from 'postgres';

const scrypt = promisify(scryptCb);
const [, , command, emailArg] = process.argv;
const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!url) {
  console.error(
    'DATABASE_URL is not set. Run with: node --env-file=.env.local scripts/admin.mjs ...',
  );
  process.exit(1);
}
const sql = postgres(url, {
  prepare: false,
  ssl: /localhost|127\.0\.0\.1/.test(url) ? false : 'require',
  onnotice: () => {},
});

// Same format as src/lib/auth/password.ts: scrypt$N$r$p$salt$hash
async function hash(password) {
  const salt = randomBytes(16);
  const N = 32768,
    r = 8,
    p = 1;
  const key = await scrypt(password.normalize('NFKC'), salt, 64, {
    N,
    r,
    p,
    maxmem: 64 * 1024 * 1024,
  });
  return ['scrypt', N, r, p, salt.toString('base64'), key.toString('base64')].join('$');
}

function askHidden(question) {
  if (process.env.ADMIN_NEW_PASSWORD) return Promise.resolve(process.env.ADMIN_NEW_PASSWORD);
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: stdin, output: stdout, terminal: true });
    rl._writeToOutput = (s) => rl.output.write(s.includes(question) ? s : '');
    rl.question(question, (answer) => {
      rl.close();
      stdout.write('\n');
      resolve(answer);
    });
  });
}

async function newPassword() {
  const pw = await askHidden('New password (12+ characters): ');
  if (pw.length < 12) throw new Error('Use at least 12 characters.');
  if (!process.env.ADMIN_NEW_PASSWORD && pw !== (await askHidden('Repeat it: '))) {
    throw new Error('The passwords don’t match.');
  }
  return pw;
}

try {
  const schema = (await import('node:fs')).readFileSync(
    new URL('../db/schema.sql', import.meta.url),
    'utf8',
  );
  await sql.unsafe(schema);
  const email = emailArg?.trim().toLowerCase();
  if (command === 'list') {
    const rows = await sql`SELECT email, created_at, last_login_at FROM admins ORDER BY id`;
    if (!rows.length) console.log('No admins yet.');
    for (const r of rows)
      console.log(
        `${r.email}  (added ${r.created_at.toISOString().slice(0, 10)}, last sign-in ${r.last_login_at ? r.last_login_at.toISOString().slice(0, 16).replace('T', ' ') : 'never'})`,
      );
  } else if (command === 'add' && email) {
    const pw = await newPassword();
    await sql`INSERT INTO admins (email, password_hash) VALUES (${email}, ${await hash(pw)})
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`;
    console.log(`Admin ${email} can now sign in at /admin.`);
  } else if (command === 'reset' && email) {
    const pw = await newPassword();
    const rows =
      await sql`UPDATE admins SET password_hash = ${await hash(pw)} WHERE email = ${email} RETURNING id`;
    console.log(rows.length ? `Password reset for ${email}.` : `No admin with the email ${email}.`);
  } else if (command === 'remove' && email) {
    const rows = await sql`DELETE FROM admins WHERE email = ${email} RETURNING id`;
    console.log(rows.length ? `Removed ${email}.` : `No admin with the email ${email}.`);
  } else {
    console.log('Usage: scripts/admin.mjs list | add <email> | reset <email> | remove <email>');
  }
} catch (err) {
  console.error(err.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
