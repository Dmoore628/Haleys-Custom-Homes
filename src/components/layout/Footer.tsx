import Link from 'next/link';
import copy from '@content/copy.config';
import siteConfig from '@content/site.config';
import { legalLinks } from '@content/legal';
import { Logo } from './Logo';
import { SocialGlyph } from './SocialGlyph';
import { YearText } from '@/components/providers/YearProvider';

/** One footer, identical on every page. `relative z-10` so it can slide over a pinned section. */
export function Footer() {
  const { contact, social, credit } = siteConfig;
  return (
    <footer className="section-x relative z-10 bg-ink pb-12 pt-24 text-white">
      <div className="grid gap-12 text-center md:grid-cols-3 md:gap-grid md:text-left">
        <div className="flex flex-col items-center md:items-start">
          <Logo tone="white" className="h-16 w-auto" />
          <p className="mx-auto mt-6 max-w-[22rem] text-body md:mx-0">{copy.footer.tagline}</p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-col items-center gap-4 md:items-start">
            {copy.footer.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="label hover:text-white/70">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col items-center gap-4 md:items-start">
          <a href={contact.phoneHref} className="label hover:text-white/70">
            {contact.phone}
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="label normal-case tracking-[0.06em] hover:text-white/70"
          >
            {contact.email}
          </a>
          <ul
            className="mt-2 flex flex-wrap justify-center gap-5 md:justify-start"
            aria-label="Haley Custom Homes on social media"
          >
            {social.map((s) => (
              <li key={s.id}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.label} (opens in a new tab)`}
                  className="block text-white transition-colors duration-200 ease-out hover:text-accent focus-visible:text-accent"
                >
                  <SocialGlyph id={s.id} />
                </a>
              </li>
            ))}
          </ul>
          <ul
            className="mt-4 flex flex-col items-center gap-2 md:items-start"
            aria-label="Service area"
          >
            {siteConfig.serviceAreas.map((area) => (
              <li key={area.name} className="label">
                {area.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-20 flex flex-col items-center gap-3 border-t border-white/10 pt-6 text-center md:flex-row md:items-baseline md:justify-between md:text-left">
        <div className="flex flex-col items-center gap-3 md:flex-row md:items-baseline md:gap-8">
          <p className="label">
            <YearText text={copy.footer.copyright} />
          </p>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Legal">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="label decoration-accent underline-offset-4 hover:underline focus-visible:underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Styled like the copyright line. Accent text fails WCAG AA contrast on ink at this
            size (3.1:1), so the accent appears as the hover underline instead. */}
        <a
          href={credit.href}
          target="_blank"
          rel="noopener noreferrer"
          className="label decoration-accent underline-offset-4 hover:underline focus-visible:underline"
        >
          {credit.label}
        </a>
      </div>
    </footer>
  );
}
