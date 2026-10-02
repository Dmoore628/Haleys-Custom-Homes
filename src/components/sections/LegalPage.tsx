import type { Metadata } from 'next';
import siteConfig from '@content/site.config';
import { legalCompany, type LegalDoc } from '@content/legal';
import { CoverStack } from '@/components/ui/CoverStack';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { sharePreview } from '@/lib/seo';

/** Fills the {company}, {address}, {phone} and {email} tokens from the site's business facts. */
function fill(text: string) {
  return text
    .replaceAll('{company}', legalCompany.name)
    .replaceAll('{address}', siteConfig.office.address)
    .replaceAll('{phone}', siteConfig.contact.phone)
    .replaceAll('{email}', siteConfig.contact.email);
}

export function legalMetadata(doc: LegalDoc): Metadata {
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: doc.path },
    openGraph: sharePreview(doc.path),
  };
}

/**
 * A legal document (content/legal.ts): one quiet reading column, set in the site's type, with
 * its effective date and a short contents list linking to each section.
 */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <CoverStack>
      <section className="section-x bg-white pb-section pt-[calc(6.5rem+clamp(3rem,7vw,6rem))]">
        <article className="mx-auto max-w-[44rem]" data-testid="legal-page">
          <header className="text-center md:text-left">
            <Eyebrow>Legal</Eyebrow>
            <h1 className="mt-5 font-serif text-section font-normal">{doc.title}</h1>
            <p className="label mt-5 text-ink/70">Effective {doc.effective}</p>
            <p className="mt-8 text-body">{fill(doc.intro)}</p>
          </header>

          <nav aria-label="Contents" className="mt-10 border-y border-ink/15 py-6">
            <ol className="grid gap-x-8 gap-y-2 md:grid-cols-2">
              {doc.sections.map((s, i) => (
                <li key={s.id} className="flex gap-3 text-[0.9375rem]">
                  <span className="w-5 shrink-0 font-serif tabular-nums text-accent">{i + 1}</span>
                  <a
                    href={`#${s.id}`}
                    className="underline decoration-ink/20 underline-offset-[5px] hover:decoration-ink"
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {doc.sections.map((s, i) => (
            <section key={s.id} id={s.id} className="mt-12 scroll-mt-28">
              <h2 className="flex items-baseline gap-3 font-serif text-[clamp(1.375rem,2.2vw,1.75rem)] font-normal leading-tight">
                <span className="text-[0.6em] tabular-nums text-accent">{i + 1}</span>
                {s.heading}
              </h2>
              {s.body.map((p) => (
                <p key={p.slice(0, 32)} className="mt-4 text-body text-ink/85">
                  {fill(p)}
                </p>
              ))}
              {s.list && (
                <ul className="mt-4 space-y-2">
                  {s.list.map((item) => (
                    <li key={item} className="flex gap-3 text-body text-ink/85">
                      <span aria-hidden="true" className="mt-[0.8em] h-px w-3 shrink-0 bg-accent" />
                      {fill(item)}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </section>
    </CoverStack>
  );
}
