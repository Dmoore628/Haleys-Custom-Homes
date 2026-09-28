#!/usr/bin/env node
/**
 * Back up, and move, the photos uploaded through the admin.
 *
 *   node --env-file=.env.local scripts/media.mjs export [folder]
 *     Downloads every uploaded photo (from Vercel Blob, S3 or wherever it lives) into
 *     folder (default ./backup/media) and writes folder/manifest.json mapping each URL to its
 *     file. Photos shipped with the site (/images/...) are skipped: they're in the repository.
 *
 *   node --env-file=.env.new scripts/media.mjs import [folder]
 *     Uploads the exported files to the storage configured in the env file (S3_* variables or
 *     BLOB_READ_WRITE_TOKEN) and rewrites every photo URL in the database to the new location.
 *     Safe to re-run: it re-uploads the same files and the database is left pointing at them.
 *
 * Both need DATABASE_URL. See docs/ADMIN.md, "Moving off Vercel".
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import postgres from 'postgres';

const [, , command, folderArg] = process.argv;
const folder = path.resolve(folderArg || 'backup/media');
const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!url) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}
const sql = postgres(url, {
  prepare: false,
  ssl: /localhost|127\.0\.0\.1/.test(url) ? false : 'require',
  onnotice: () => {},
});

const isUploaded = (src) => src && !src.startsWith('/images/');

async function uploadedImages() {
  const rows = await sql`SELECT id, slug, cover, images FROM projects`;
  const set = new Set();
  for (const r of rows)
    for (const img of [r.cover, ...(r.images ?? [])])
      if (img && isUploaded(img.src)) set.add(img.src);
  return [...set];
}

async function exportMedia() {
  await mkdir(folder, { recursive: true });
  const urls = await uploadedImages();
  const manifest = {};
  for (const [i, src] of urls.entries()) {
    const absolute = src.startsWith('/')
      ? new URL(src, process.env.SITE_URL || 'http://localhost:3000').href
      : src;
    const res = await fetch(absolute);
    if (!res.ok) throw new Error(`Couldn't download ${src}: ${res.status}`);
    const key = new URL(absolute).pathname.replace(/^\/+/, '');
    const file = path.join(folder, key);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, Buffer.from(await res.arrayBuffer()));
    manifest[src] = key;
    console.log(`${i + 1}/${urls.length}  ${key}`);
  }
  await writeFile(path.join(folder, 'manifest.json'), JSON.stringify(manifest, null, 1));
  console.log(`Exported ${urls.length} photos to ${folder}`);
}

async function storage() {
  if (process.env.S3_BUCKET) {
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
    const base = process.env.S3_PUBLIC_URL.replace(/\/$/, '');
    const client = new S3Client({
      region: process.env.S3_REGION || 'auto',
      endpoint: process.env.S3_ENDPOINT || undefined,
      forcePathStyle: Boolean(process.env.S3_ENDPOINT),
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });
    return {
      async put(key, body) {
        await client.send(
          new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: key,
            Body: body,
            ContentType: 'image/jpeg',
            CacheControl: 'public, max-age=31536000, immutable',
          }),
        );
        return `${base}/${key}`;
      },
    };
  }
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import('@vercel/blob');
    return {
      async put(key, body) {
        return (
          await put(key, body, {
            access: 'public',
            contentType: 'image/jpeg',
            addRandomSuffix: false,
            allowOverwrite: true,
          })
        ).url;
      },
    };
  }
  throw new Error('Set the S3_* variables (or BLOB_READ_WRITE_TOKEN) for the new storage.');
}

async function importMedia() {
  const manifest = JSON.parse(await readFile(path.join(folder, 'manifest.json'), 'utf8'));
  const target = await storage();
  const moved = {};
  for (const [oldSrc, key] of Object.entries(manifest)) {
    moved[oldSrc] = await target.put(key, await readFile(path.join(folder, key)));
    console.log(`uploaded ${key}`);
  }
  const rows = await sql`SELECT id, cover, images FROM projects`;
  const swap = (img) => (img && moved[img.src] ? { ...img, src: moved[img.src] } : img);
  for (const r of rows) {
    await sql`UPDATE projects SET cover = ${r.cover ? sql.json(swap(r.cover)) : null},
      images = ${sql.json((r.images ?? []).map(swap))}, updated_at = now() WHERE id = ${r.id}`;
  }
  console.log(`Moved ${Object.keys(moved).length} photos; database updated.`);
}

try {
  if (command === 'export') await exportMedia();
  else if (command === 'import') await importMedia();
  else console.log('Usage: scripts/media.mjs export [folder] | import [folder]');
} catch (err) {
  console.error(err.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
