import 'server-only';
import sharp from 'sharp';
import type { ProjectImage } from '@/lib/projects/types';

/** Largest accepted upload, before processing. */
export const MAX_UPLOAD_BYTES = 40 * 1024 * 1024;
export const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/avif',
];

/**
 * Prepares an uploaded photo the same way scripts/process-media.py prepares the site's own:
 * orientation applied from EXIF (then all metadata stripped, including GPS), at most 2400px
 * wide, progressive JPEG at quality 88, plus a muted color tone and a tiny blurred preview for
 * the loading placeholder.
 */
export async function processUpload(input: Buffer): Promise<{
  body: Buffer;
  meta: Omit<ProjectImage, 'src'>;
}> {
  const base = sharp(input, { failOn: 'error' }).rotate();
  const body = await base
    .clone()
    .resize({ width: 2400, withoutEnlargement: true })
    .jpeg({ quality: 88, progressive: true, mozjpeg: true })
    .toBuffer();
  const { width = 0, height = 0 } = await sharp(body).metadata();
  if (width < 400 || height < 300)
    throw new Error('This photo is too small; use one at least 1200px wide.');

  const { dominant } = await sharp(body).stats();
  const mute = (c: number) => Math.round(c * 0.55 + 207 * 0.45);
  const color = `#${[dominant.r, dominant.g, dominant.b].map((c) => mute(c).toString(16).padStart(2, '0')).join('')}`;

  const tiny = await sharp(body).resize(16).blur(1).jpeg({ quality: 50 }).toBuffer();
  const blurDataURL = `data:image/jpeg;base64,${tiny.toString('base64')}`;

  return { body, meta: { width, height, color, blurDataURL } };
}
