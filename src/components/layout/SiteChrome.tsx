'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/** Renders the public site's chrome (nav, cursor, smooth scroll...) everywhere except the admin. */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '';
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return null;
  return <>{children}</>;
}
