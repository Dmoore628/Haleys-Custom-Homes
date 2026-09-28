# Portfolio admin: setup, daily use, backups and moving hosts

The site has a private admin at **`/admin`** for adding, editing, reordering, publishing and removing
portfolio projects and their photos. Changes appear on the public site within seconds, with no redeploy.

It is built from two ordinary, portable parts:

| Part        | What it holds                                   | Configured by                                 | Works with                                                                                  |
| ----------- | ----------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Database** | Projects, their text, photo list and order; admin accounts | `DATABASE_URL` (a standard Postgres connection string) | Any PostgreSQL 13+: Neon, Supabase, AWS RDS, Google Cloud SQL, DigitalOcean, self-hosted |
| **Photo storage** | The photo files uploaded through the admin | `BLOB_READ_WRITE_TOKEN`, **or** the `S3_*` variables | Vercel Blob, or any S3-compatible service: AWS S3, Cloudflare R2, Backblaze B2, DigitalOcean Spaces, MinIO |

Nothing else is tied to Vercel. The photos that ship with the site (under `public/images`) stay in the
repository and are never touched by the admin.

Until a database is connected, the site shows the projects in `content/projects.json` and `/admin` explains
that no database is connected. The first time a database is connected, the site creates its tables and
copies every project from `content/projects.json` into it automatically. From then on the admin is the
source of truth.

---

## 1. First-time setup on Vercel (about 5 minutes)

1. **Database.** In the Vercel dashboard open the project → **Storage** → **Create Database** → **Neon**
   (Serverless Postgres) → create it and **Connect** it to this project (all environments). Vercel adds
   `DATABASE_URL` (and related `POSTGRES_*` variables) automatically.
2. **Photo storage.** **Storage** → **Create** → **Blob** → create a store and **Connect** it to this
   project. Vercel adds `BLOB_READ_WRITE_TOKEN`.
3. **Admin variables.** **Settings** → **Environment Variables**, for Production (and Preview if you
   want the admin on preview deployments):
   - `SESSION_SECRET`: a long random value. Generate one with
     `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`.
     Changing it later signs everyone out.
   - `ADMIN_EMAIL`: the first admin's email.
   - `ADMIN_PASSWORD`: that admin's first password, 12+ characters.
4. **Redeploy** (Deployments → the latest → Redeploy), then open `https://<your-domain>/admin` and sign in
   with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
5. The first sign-in creates the account with the password hashed. **Delete `ADMIN_PASSWORD` from Vercel
   afterwards**; it is never used again once an admin exists. Change the password any time under
   **Account** in the admin.

## 2. Using the admin

- **Portfolio** lists every project, drafts included, in the order the site shows them. Drag a row (or
  use the ▲▼ arrows) to reorder. **Published** puts a project on the site; **On home page** adds it to
  “A Sample of What We’ve Built” (five fill the home page layout best).
- **New project**: name it, pick New build or Remodel, add the details you have. Leave a field blank rather
  than guessing; blank facts simply don’t appear on the site. Create it, then add photos.
- **Photos**: drop photos onto the page or use **Add photos** (JPEG, PNG, WebP or iPhone HEIC, up to
  40 MB each; 1200px+ wide looks best). Each is straightened from its camera orientation, resized to
  2400px, compressed and stripped of location data before it’s stored. Drag to reorder, **Make cover** to
  choose the photo that leads the project page and its tile, **Remove** to delete. Photo changes save
  instantly.
- **Publish**: tick **Published** and **Save changes**. A project needs at least one photo to publish.
- **Delete project** removes it from the site and deletes its uploaded photos from storage.
- The web address (`/portfolio/<address>`) is made from the name; edit it if you like. Changing it breaks
  old links to that project, so set it once.

### Adding or removing admins

From a computer with this repository and Node 20+:

```bash
# .env.local must contain the production DATABASE_URL (copy it from Vercel → Settings → Environment Variables)
npm run admin -- list
npm run admin -- add dan@haleycustomhomes.com     # asks for a password
npm run admin -- reset dan@haleycustomhomes.com   # forgotten password
npm run admin -- remove someone@example.com
```

## 3. Security

- Passwords are hashed with scrypt (a per-password salt, 2^15 iterations); the database never holds a
  password.
- Sessions are an HttpOnly, Secure, SameSite=Strict cookie signed with `SESSION_SECRET` (HMAC-SHA256),
  valid for 14 days. Every admin page, action and upload re-checks the signature and that the account
  still exists; middleware also guards every `/admin` and `/api/admin` route.
- Sign-in is rate-limited: 6 failed attempts per email and IP address lock that pair out for 15 minutes.
- Server actions and the upload route only accept requests from the site’s own origin.
- `/admin` is excluded from search engines (robots.txt, `noindex`), can’t be framed, and is never cached.

## 4. Backups

**Database.** Neon keeps point-in-time history (7 days on the free plan). For your own copy, with the
PostgreSQL client tools installed:

```bash
pg_dump "$DATABASE_URL" --no-owner --no-privileges -Fc -f haley-portfolio.dump
```

**Photos.** Download every uploaded photo, plus a manifest of where each came from:

```bash
npm run media:export            # into ./backup/media (needs DATABASE_URL in .env.local)
```

## 5. Moving off Vercel

The site is a standard Next.js app (`npm run build` then `npm start`, Node 20+), so it runs on any Node
host: Render, Railway, Fly.io, DigitalOcean App Platform, AWS, or a VPS behind a reverse proxy. Move the
two stores like this.

### 5a. Database

Either **keep the Neon database** (it’s a normal Postgres service; copy its `DATABASE_URL` to the new
host, and manage it at neon.tech; if it was created through Vercel, transfer it to your own Neon account
from the Neon console first), **or move to any other Postgres**:

```bash
pg_dump "$OLD_DATABASE_URL" --no-owner --no-privileges -Fc -f haley-portfolio.dump
pg_restore --no-owner --no-privileges -d "$NEW_DATABASE_URL" haley-portfolio.dump
```

Then set `DATABASE_URL` on the new host to the new connection string. (If the new database refuses SSL,
use a connection string with `localhost`; otherwise SSL is required.) The schema lives in `db/schema.sql`
and is re-applied automatically, harmlessly, on every start.

### 5b. Photos

Vercel Blob URLs keep working as long as the Blob store exists, even after the site moves. To move the
files to your own storage (recommended if you’re leaving Vercel entirely):

1. Create a bucket that allows public reads, on AWS S3, Cloudflare R2 (enable its public r2.dev URL or a
   custom domain), Backblaze B2 or similar. Create an access key with read/write on that bucket.
2. Export from the current storage (run against the current database):
   ```bash
   npm run media:export
   ```
3. Put the new storage settings in a file, e.g. `.env.new`:
   ```bash
   DATABASE_URL=postgres://...            # the database the site will use
   S3_BUCKET=haley-portfolio
   S3_REGION=auto                         # e.g. us-east-1 for AWS; auto for R2
   S3_ENDPOINT=https://<account>.r2.cloudflarestorage.com   # omit for AWS S3
   S3_ACCESS_KEY_ID=...
   S3_SECRET_ACCESS_KEY=...
   S3_PUBLIC_URL=https://photos.haleycustomhomes.com       # the bucket's public base URL
   ```
4. Upload the photos and point the database at them:
   ```bash
   node --env-file=.env.new scripts/media.mjs import
   ```
5. On the new host, set the same `S3_*` variables (and remove `BLOB_READ_WRITE_TOKEN`). New uploads then
   go to the bucket, and `next.config.js` allows images from `S3_PUBLIC_URL` automatically.

### 5c. Environment variables on the new host

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | yes | Postgres connection string |
| `SESSION_SECRET` | yes | Keep the old value to keep admins signed in, or set a new one |
| `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_PUBLIC_URL`, `S3_ENDPOINT` | for S3 storage | see 5b |
| `BLOB_READ_WRITE_TOKEN` | for Vercel Blob | only if staying on Blob |
| `SITE_ENV=production`, SMTP settings | as before | see `.env.example` |

Admin accounts move with the database; nobody needs a new password.

## 6. Testing locally

```bash
npm run db:up                 # Postgres 16 in Docker (docker-compose.yml)
# .env.local:
#   DATABASE_URL=postgres://haley:haley@localhost:5432/haley
#   ADMIN_EMAIL=... and ADMIN_PASSWORD=... (any local test values)
npm run dev                   # http://localhost:3000/admin
```

In development, uploads are stored in `public/uploads` (git-ignored) unless Blob or S3 variables are set.
The end-to-end admin test runs with `E2E_ADMIN=1` against a running dev server with those variables:

```bash
set -a; . ./.env.local; set +a
E2E_ADMIN=1 E2E_BASE_URL=http://localhost:3000 npx playwright test tests/e2e/admin.spec.ts
```
