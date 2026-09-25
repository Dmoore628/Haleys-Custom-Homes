import type { Metadata } from 'next';
import copy from '@content/copy.config';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false },
};

/** Same nav and footer as every page; centered plain-voice content that routes back into the site. */
export default function NotFound() {
  const { notFound } = copy;
  return (
    <>
      <main id="main" tabIndex={-1} className="outline-none">
        <section className="section-x flex min-h-[80vh] flex-col items-center justify-center pb-section pt-[calc(6.5rem+4rem)] text-center">
          <Eyebrow>{notFound.eyebrow}</Eyebrow>
          <h1 className="mt-6 max-w-[16em] font-serif text-section font-normal">
            {notFound.headline}
          </h1>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <ButtonLink href={notFound.primary.href} variant="primary">
              {notFound.primary.label}
            </ButtonLink>
            <ButtonLink href={notFound.ghost.href} variant="ghost">
              {notFound.ghost.label}
            </ButtonLink>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
