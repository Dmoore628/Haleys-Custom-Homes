'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import copy from '@content/copy.config';
import { EASE } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ButtonLink } from '@/components/ui/Button';
import { Logo } from './Logo';
import { LiftLabel } from './LiftLabel';

interface Props {
  open: boolean;
  onClose: () => void;
  pathname: string;
}

/**
 * Full-screen ink overlay (mobile only). 300ms fade with a slight scale-in; links rise 20px
 * and fade in with a 60ms stagger over 400ms. The trigger reads "Exit" while open.
 */
export function MobileMenuOverlay({ open, onClose, pathname }: Props) {
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const exitRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = 'hidden';
    window.dispatchEvent(new CustomEvent('lenis:stop'));
    exitRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
      window.dispatchEvent(new CustomEvent('lenis:start'));
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  const items = [...copy.nav.links];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[70] flex flex-col bg-ink text-bone lg:hidden"
          initial={{ opacity: 0, scale: reduced ? 1 : 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: reduced ? 1 : 0.98 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <div className="section-x flex items-center justify-between py-4">
            <Logo tone="bone" className="h-11 w-auto" onClick={onClose} />
            <button
              ref={exitRef}
              type="button"
              className="lift label py-2 text-bone"
              aria-label={copy.nav.exit}
              onClick={onClose}
            >
              <LiftLabel text={copy.nav.exit} />
            </button>
          </div>

          <ul className="section-x flex flex-1 flex-col items-center justify-center gap-6">
            {items.map((link, i) => (
              <motion.li
                key={link.href}
                initial={{ opacity: 0, y: reduced ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.06 * i, ease: EASE }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  className="font-serif text-section font-light"
                >
                  {link.label}
                </Link>
              </motion.li>
            ))}
            <motion.li
              className="mt-6"
              initial={{ opacity: 0, y: reduced ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.06 * items.length, ease: EASE }}
            >
              <ButtonLink href={copy.nav.cta.href} variant="ghost" surface="dark" onClick={onClose}>
                {copy.nav.cta.label}
              </ButtonLink>
            </motion.li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
