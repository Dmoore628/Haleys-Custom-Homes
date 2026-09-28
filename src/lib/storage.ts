import 'server-only';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Where uploaded project photos live. Chosen by environment, so moving hosts means changing
 * variables, not code:
 *
 * - Vercel Blob, when BLOB_READ_WRITE_TOKEN is set (Vercel sets it when a Blob store is
 *   connected to the project).
 * - Any S3-compatible service (AWS S3, Cloudflare R2, Backblaze B2, DigitalOcean Spaces, MinIO),
 *   when S3_BUCKET is set, with S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, optional
 *   S3_ENDPOINT (for non-AWS services) and S3_PUBLIC_URL (the public base URL for the bucket).
 * - The local disk (public/uploads), in development only.
 *
 * Photos shipped with the site (paths under /images) are never touched by these adapters.
 */
export interface Storage {
  name: 'vercel-blob' | 's3' | 'local';
  /** Stores a file and returns its public URL. */
  put(key: string, body: Buffer, contentType: string): Promise<string>;
  /** Deletes a file previously returned by put(). Unknown URLs are ignored. */
  remove(url: string): Promise<void>;
}

export class StorageNotConfiguredError extends Error {
  constructor() {
    super(
      'No photo storage is configured. Connect a Vercel Blob store (BLOB_READ_WRITE_TOKEN) or set the S3_* variables; see docs/ADMIN.md.',
    );
  }
}

function vercelBlob(): Storage {
  return {
    name: 'vercel-blob',
    async put(key, body, contentType) {
      const { put } = await import('@vercel/blob');
      const blob = await put(key, body, { access: 'public', contentType, addRandomSuffix: true });
      return blob.url;
    },
    async remove(url) {
      if (!url.includes('.blob.vercel-storage.com/')) return;
      const { del } = await import('@vercel/blob');
      await del(url);
    },
  };
}

function s3(): Storage {
  const bucket = process.env.S3_BUCKET!;
  const publicBase = (process.env.S3_PUBLIC_URL ?? '').replace(/\/$/, '');
  if (!publicBase) throw new Error('S3_PUBLIC_URL is required with S3_BUCKET (see docs/ADMIN.md)');
  const client = async () => {
    const { S3Client } = await import('@aws-sdk/client-s3');
    return new S3Client({
      region: process.env.S3_REGION || 'auto',
      endpoint: process.env.S3_ENDPOINT || undefined,
      forcePathStyle: Boolean(process.env.S3_ENDPOINT),
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    });
  };
  return {
    name: 's3',
    async put(key, body, contentType) {
      const { PutObjectCommand } = await import('@aws-sdk/client-s3');
      await (
        await client()
      ).send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
          CacheControl: 'public, max-age=31536000, immutable',
        }),
      );
      return `${publicBase}/${key}`;
    },
    async remove(url) {
      if (!url.startsWith(publicBase + '/')) return;
      const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
      await (
        await client()
      ).send(new DeleteObjectCommand({ Bucket: bucket, Key: url.slice(publicBase.length + 1) }));
    },
  };
}

function localDisk(): Storage {
  const root = path.join(process.cwd(), 'public', 'uploads');
  return {
    name: 'local',
    async put(key, body) {
      const file = path.join(root, key);
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, body);
      return `/uploads/${key}`;
    },
    async remove(url) {
      if (!url.startsWith('/uploads/')) return;
      await rm(path.join(root, url.slice('/uploads/'.length)), { force: true });
    },
  };
}

export function getStorage(): Storage {
  if (process.env.BLOB_READ_WRITE_TOKEN) return vercelBlob();
  if (process.env.S3_BUCKET) return s3();
  if (process.env.NODE_ENV !== 'production' || process.env.ALLOW_LOCAL_UPLOADS === '1') {
    return localDisk();
  }
  throw new StorageNotConfiguredError();
}

/** Removes uploaded files; photos shipped with the site (/images/...) are left alone. */
export async function removeUploaded(urls: string[]) {
  const uploaded = urls.filter((u) => u && !u.startsWith('/images/'));
  if (!uploaded.length) return;
  const storage = getStorage();
  await Promise.allSettled(uploaded.map((u) => storage.remove(u)));
}
