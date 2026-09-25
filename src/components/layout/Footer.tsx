import Link from 'next/link';
import copy from '@content/copy.config';
import siteConfig from '@content/site.config';
import { Logo } from './Logo';

/** One footer, identical on every page. */
export function Footer() {
  const year = new Date().getFullYear();
  const { contact } = siteConfig;
  return (
    <footer className="section-x bg-ink pb-12 pt-24 text-bone">
      <div className="grid gap-12 md:grid-cols-3 md:gap-grid">
        <div>
          <Logo tone="bone" className="h-16 w-auto" />
          <p className="mt-6 max-w-[22rem] text-body">{copy.footer.tagline}</p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-col gap-4">
            {copy.footer.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="label hover:text-bone/70">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-4">
          <a href={contact.phoneHref} className="label hover:text-bone/70">
            {contact.phone}
          </a>
          {contact.email ? (
            <a href={`mailto:${contact.email}`} className="label hover:text-bone/70">
              {contact.email}
            </a>
          ) : (
            <p className="label">{contact.emailPlaceholder}</p>
          )}
          <ul className="mt-4 flex flex-col gap-2" aria-label="Service area">
            {siteConfig.serviceAreas.map((area) => (
              <li key={area} className="label">
                {area}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-20 border-t border-bone/10 pt-6">
        <p className="label">{copy.footer.copyright.replace('{year}', String(year))}</p>
      </div>
    </footer>
  );
}
