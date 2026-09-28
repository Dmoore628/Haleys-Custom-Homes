'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import copy from '@content/copy.config';
import { EASE } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Reveal } from '@/components/ui/Reveal';
import { SmartImage } from '@/components/ui/SmartImage';
import type { ProjectImage } from '@/lib/projects/types';

function CloseMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 3l14 14M17 3 3 17" stroke="#EFE9DE" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Stacked full-width images, 64px apart, each revealed on entry. Clicking any image opens the
 * lightbox: ink background, image centered, close mark top-right, arrow keys or edge taps to move
 * through this project's set. Closing returns to the same scroll position.
 */
export function ProjectGallery({ images, name }: { images: ProjectImage[]; name: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduced = useReducedMotion();
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (index === null) return;
    const scrollY = window.scrollY;
    window.dispatchEvent(new CustomEvent('lenis:stop'));
    document.documentElement.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'Tab' && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>('button');
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
      window.scrollTo(0, scrollY);
      window.dispatchEvent(new CustomEvent('lenis:start'));
      openerRef.current?.focus({ preventScroll: true });
    };
    // Only re-run when opening or closing, not on every image change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index === null, close, step]);

  return (
    <>
      <ul className="flex flex-col gap-16">
        {images.map((img, i) => (
          <Reveal as="li" key={img.src}>
            <button
              type="button"
              className="block w-full"
              aria-label={`Open image ${i + 1} of ${images.length}, ${name}`}
              onClick={(e) => {
                openerRef.current = e.currentTarget;
                setIndex(i);
              }}
              data-cursor="expand"
            >
              <SmartImage
                src={img.src}
                meta={img}
                alt={`${name}, photograph ${i + 1}`}
                sizes="100vw"
                className="h-auto w-full"
              />
            </button>
          </Reveal>
        ))}
      </ul>

      {/* Portaled to <body> so no section's stacking context can trap it under the nav. */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {index !== null && (
              <motion.div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-label={`${name}, image ${index + 1} of ${images.length}`}
                className="fixed inset-0 z-[80] flex items-center justify-center bg-ink"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                {/* Edge taps: left third goes back, right third goes forward. */}
                <button
                  type="button"
                  aria-label={copy.portfolio.lightbox.previous}
                  onClick={() => step(-1)}
                  className="absolute inset-y-0 left-0 z-10 w-1/3"
                />
                <button
                  type="button"
                  aria-label={copy.portfolio.lightbox.next}
                  onClick={() => step(1)}
                  className="absolute inset-y-0 right-0 z-10 w-1/3"
                />

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={images[index].src}
                    className="relative h-[86vh] w-[92vw]"
                    initial={{ opacity: 0, scale: reduced ? 1 : 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    <SmartImage
                      src={images[index].src}
                      meta={images[index]}
                      alt={`${name}, photograph ${index + 1}`}
                      fill
                      sizes="92vw"
                      className="object-contain"
                      style={{ backgroundColor: 'transparent' }}
                    />
                  </motion.div>
                </AnimatePresence>

                <p className="label absolute bottom-6 left-1/2 -translate-x-1/2 text-bone">
                  {index + 1} / {images.length}
                </p>
                <button
                  ref={closeRef}
                  type="button"
                  aria-label={copy.portfolio.lightbox.close}
                  onClick={close}
                  className="absolute right-4 top-4 z-20 flex h-12 w-12 items-center justify-center md:right-8 md:top-8"
                >
                  <CloseMark />
                </button>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
