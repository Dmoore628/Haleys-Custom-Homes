import { NextResponse } from 'next/server';
import { UnauthorizedError, assertSameOrigin, requireAdmin } from '@/lib/auth/admin';
import { ACCEPTED_TYPES, MAX_UPLOAD_BYTES, processUpload } from '@/lib/images';
import { getProjectById } from '@/lib/projects/repo';
import { StorageNotConfiguredError, getStorage } from '@/lib/storage';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Receives one photo for a project, optimizes it, stores it and returns its image record. The
 * admin then saves the gallery (saveImagesAction), which is what attaches it to the project.
 */
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await requireAdmin();
    const form = await request.formData();
    const file = form.get('file');
    const projectId = String(form.get('projectId') ?? '');
    if (!(file instanceof File))
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    if (
      !ACCEPTED_TYPES.includes(file.type) &&
      !/\.(jpe?g|png|webp|heic|heif|avif)$/i.test(file.name)
    ) {
      return NextResponse.json(
        { error: `${file.name}: use a JPEG, PNG, WebP or HEIC photo.` },
        { status: 415 },
      );
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: `${file.name} is larger than 40 MB.` }, { status: 413 });
    }
    const project = await getProjectById(projectId);
    if (!project) return NextResponse.json({ error: 'Project not found.' }, { status: 404 });

    const { body, meta } = await processUpload(Buffer.from(await file.arrayBuffer()));
    const key = `projects/${project.slug}/${Date.now().toString(36)}.jpg`;
    const src = await getStorage().put(key, body, 'image/jpeg');
    return NextResponse.json({ image: { src, ...meta } });
  } catch (err) {
    if (err instanceof UnauthorizedError)
      return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
    if (err instanceof StorageNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    const message = err instanceof Error ? err.message : 'Upload failed.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
