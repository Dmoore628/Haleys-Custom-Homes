import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { currentAdmin } from '@/lib/auth/admin';
import { signOutAction } from './actions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'Admin | Haley Custom Homes' },
  robots: { index: false, follow: false },
};

/** The private admin: its own quiet chrome, none of the public site's motion. */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await currentAdmin();
  return (
    <div className="min-h-screen bg-white text-ink">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Link href="/admin" className="flex items-baseline gap-3">
            <span className="font-serif text-[1.375rem] leading-none">Haley Custom Homes</span>
            <span className="label text-ink/70">Admin</span>
          </Link>
          {admin && (
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Admin">
              <Link href="/admin" className="label hover:text-accent">
                Portfolio
              </Link>
              <Link href="/admin/account" className="label hover:text-accent">
                Account
              </Link>
              <a
                href="/portfolio"
                target="_blank"
                rel="noreferrer"
                className="label hover:text-accent"
              >
                View site ↗
              </a>
              <form action={signOutAction}>
                <button type="submit" className="label hover:text-accent">
                  Sign out
                </button>
              </form>
            </nav>
          )}
        </div>
      </header>
      <main id="main" className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
        {children}
      </main>
    </div>
  );
}
