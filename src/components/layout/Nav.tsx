'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import copy from '@content/copy.config';
import { useScrolledPast } from '@/hooks/useScrollY';
import { ButtonLink } from '@/components/ui/Button';
import { Logo } from './Logo';
import { LiftLabel } from './LiftLabel';
import { MobileMenuOverlay } from './MobileMenuOverlay';

/** Routes that open on a full-bleed dark hero, where the transparent nav needs light text. */
function hasDarkHero(pathname: string) {
  return pathname === '/' || /^\/portfolio\/[^/]+\/?$/.test(pathname);
}

export function Nav() {
  const pathname = usePathname() ?? '/';
  const scrolled = useScrolledPast(80);
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const overDark = hasDarkHero(pathname) && !scrolled;
  const text = overDark ? 'text-bone' : 'text-ink';

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-200 ease-brand ${
          scrolled ? 'border-ink/10 bg-bone' : 'border-transparent bg-transparent'
        }`}
      >
        <nav aria-label="Primary" className="section-x flex items-center justify-between py-4">
          <Logo tone={overDark ? 'bone' : 'ink'} className="h-11 w-auto md:h-14" />

          {/* Desktop: four links plus the CTA, always visible. */}
          <div className="hidden items-center gap-10 lg:flex">
            <ul className="flex items-center gap-8">
              {copy.nav.links.map((link) => {
                const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={`label relative py-2 ${text} after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-current after:transition-transform after:duration-300 after:ease-brand ${
                        active ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ButtonLink href={copy.nav.cta.href} variant="primary" className="px-6 py-3">
              {copy.nav.cta.label}
            </ButtonLink>
          </div>

          {/* Mobile: a single Menu trigger. */}
          <button
            type="button"
            className={`lift label py-2 lg:hidden ${text}`}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={copy.nav.menu}
            onClick={() => setOpen(true)}
          >
            <LiftLabel text={copy.nav.menu} />
          </button>
        </nav>
      </header>
      <MobileMenuOverlay open={open} onClose={() => setOpen(false)} pathname={pathname} />
    </>
  );
}
