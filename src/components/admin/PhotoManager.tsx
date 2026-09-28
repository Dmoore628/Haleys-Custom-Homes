'use client';

import Image from 'next/image';
import { useRef, useState, useTransition } from 'react';
import { saveImagesAction } from '@/app/admin/actions';
import type { Project, ProjectImage } from '@/lib/projects/types';

interface Upload {
  name: string;
  state: 'waiting' | 'uploading' | 'done' | 'error';
  error?: string;
}

/**
 * The project's photos: drop or pick any number, each is optimized and added in the order
 * chosen. Drag (or use the arrows) to reorder, choose the cover, remove. Every change saves
 * immediately. The cover leads the project page and its portfolio tile.
 */
export function PhotoManager({
  project,
  onCountChange,
}: {
  project: Project;
  onCountChange: (n: number) => void;
}) {
  const [images, setImages] = useState<ProjectImage[]>(project.images);
  const [cover, setCover] = useState(project.cover.src || project.images[0]?.src || '');
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState(false);
  const [error, setError] = useState('');
  const [, start] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const persist = (next: ProjectImage[], nextCover = cover) => {
    setImages(next);
    const c = next.some((i) => i.src === nextCover) ? nextCover : (next[0]?.src ?? '');
    setCover(c);
    onCountChange(next.length);
    start(async () => {
      const res = await saveImagesAction(project.id, next, c || null);
      if (!res.ok) setError(res.error);
    });
  };

  const upload = async (files: FileList | File[]) => {
    const list = Array.from(files).filter(
      (f) => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name),
    );
    if (!list.length) return;
    setError('');
    setUploads(list.map((f) => ({ name: f.name, state: 'waiting' })));
    let current = images;
    for (let i = 0; i < list.length; i++) {
      setUploads((u) => u.map((x, j) => (j === i ? { ...x, state: 'uploading' } : x)));
      const body = new FormData();
      body.append('file', list[i]);
      body.append('projectId', project.id);
      try {
        const res = await fetch('/api/admin/upload', { method: 'POST', body });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Upload failed.');
        current = [...current, data.image as ProjectImage];
        persist(current, cover || (data.image as ProjectImage).src);
        setUploads((u) => u.map((x, j) => (j === i ? { ...x, state: 'done' } : x)));
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Upload failed.';
        setUploads((u) =>
          u.map((x, j) => (j === i ? { ...x, state: 'error', error: message } : x)),
        );
      }
    }
    setTimeout(() => setUploads((u) => u.filter((x) => x.state === 'error')), 2500);
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    persist(next);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="photos-heading" className="font-serif text-[1.75rem] leading-tight">
            Photos
          </h2>
          <p className="mt-1 text-[0.9375rem] text-ink/75">
            {images.length} photo{images.length === 1 ? '' : 's'}. Saved automatically. The cover
            leads the project page and its tile.
          </p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="admin-btn admin-btn-primary"
        >
          + Add photos
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/avif"
          multiple
          className="sr-only"
          aria-label="Choose photos to upload"
          onChange={(e) => {
            if (e.target.files) void upload(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      <div
        onDragOver={(e) => {
          if (e.dataTransfer.types.includes('Files')) {
            e.preventDefault();
            setOver(true);
          }
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          if (!e.dataTransfer.files.length) return;
          e.preventDefault();
          setOver(false);
          void upload(e.dataTransfer.files);
        }}
        className={`mt-6 rounded-[6px] border-2 border-dashed p-4 transition-colors ${
          over ? 'border-accent bg-accent/10' : 'border-ink/15'
        }`}
        data-testid="photo-dropzone"
      >
        {uploads.length > 0 && (
          <ul className="mb-4 space-y-1 text-[0.875rem]" aria-live="polite">
            {uploads.map((u, i) => (
              <li key={i} className={u.state === 'error' ? 'text-[#8a2c1d]' : 'text-ink/75'}>
                {u.state === 'waiting' && `Waiting: ${u.name}`}
                {u.state === 'uploading' && `Optimizing and uploading ${u.name}…`}
                {u.state === 'done' && `Added ${u.name}`}
                {u.state === 'error' && u.error}
              </li>
            ))}
          </ul>
        )}
        {error && (
          <p role="alert" className="mb-4 text-[0.9375rem] text-[#8a2c1d]">
            {error}
          </p>
        )}
        {images.length === 0 ? (
          <p className="py-10 text-center text-ink/60">Drop photos here, or use “Add photos”.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {images.map((img, i) => (
              <li
                key={img.src}
                draggable
                onDragStart={() => setDragging(i)}
                onDragEnd={() => setDragging(null)}
                onDragOver={(e) => {
                  if (dragging === null || dragging === i) return;
                  e.preventDefault();
                  const next = [...images];
                  const [item] = next.splice(dragging, 1);
                  next.splice(i, 0, item);
                  setImages(next);
                  setDragging(i);
                }}
                onDrop={() => dragging !== null && persist(images)}
                className={`group relative ${dragging === i ? 'opacity-40' : ''}`}
                data-testid="admin-photo"
              >
                <span className="relative block aspect-[4/3] overflow-hidden rounded-[4px] bg-ink/10">
                  <Image src={img.src} alt="" fill sizes="240px" className="object-cover" />
                  {img.src === cover && (
                    <span className="absolute left-2 top-2 rounded-full bg-ink px-2.5 py-1 text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-bone">
                      Cover
                    </span>
                  )}
                </span>
                <span className="mt-2 flex items-center justify-between gap-1 text-[0.8125rem]">
                  <span className="flex">
                    <button
                      type="button"
                      onClick={() => move(i, i - 1)}
                      disabled={i === 0}
                      aria-label={`Move photo ${i + 1} earlier`}
                      className="px-1.5 text-ink/60 hover:text-ink disabled:opacity-20"
                    >
                      ◀
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, i + 1)}
                      disabled={i === images.length - 1}
                      aria-label={`Move photo ${i + 1} later`}
                      className="px-1.5 text-ink/60 hover:text-ink disabled:opacity-20"
                    >
                      ▶
                    </button>
                  </span>
                  {img.src !== cover && (
                    <button
                      type="button"
                      onClick={() => persist(images, img.src)}
                      className="hover:text-accent"
                    >
                      Make cover
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => persist(images.filter((x) => x.src !== img.src))}
                    aria-label={`Remove photo ${i + 1}`}
                    className="text-[#8a2c1d] hover:underline"
                  >
                    Remove
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
