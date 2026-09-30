import type { Metadata } from 'next';
import copy from '@content/copy.config';
import siteConfig from '@content/site.config';
import { CoverStack } from '@/components/ui/CoverStack';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ButtonLink } from '@/components/ui/Button';
import { sharePreview } from '@/lib/seo';

const page = copy.clientPortal;

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
  robots: { index: false, follow: false },
  openGraph: sharePreview('/client-portal'),
};

/**
 * The client portal, and only that: one quiet screen whose button hands the client to the
 * portal's own secure sign-in (Buildertrend, per site.config clientPortal). Credentials are
 * never entered on this site. With no sign-in URL configured it says the portal is being
 * connected and offers direct contact instead. See docs/CLIENT_PORTAL.md.
 */
export default function ClientPortalPage() {
  const { provider, signInUrl } = siteConfig.clientPortal;
  const { contact } = siteConfig;
  return (
    <CoverStack>
      <section
        className="section-x flex min-h-[100svh] items-center justify-center bg-bone pb-section pt-[calc(6.5rem+clamp(2rem,5vw,4rem))]"
        data-testid="client-portal"
      >
        <div className="flex w-full max-w-[34rem] flex-col items-center text-center">
          <Eyebrow>{page.eyebrow}</Eyebrow>
          <h1 className="mt-5 font-serif text-section font-normal">{page.headline}</h1>

          {signInUrl ? (
            <>
              <p className="mt-6 text-body text-ink/80">{page.body}</p>
              <div className="mt-10 w-full md:w-auto">
                <ButtonLink href={signInUrl} variant="primary" fullWidthMobile>
                  {page.button}
                </ButtonLink>
              </div>
              <p className="label mt-5 text-ink/70">
                <svg
                  viewBox="0 0 16 16"
                  className="mr-2 inline-block h-3.5 w-3.5 -translate-y-px align-middle"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="7"
                    width="10"
                    height="7"
                    rx="1.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                  <path
                    d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                </svg>
                {page.secure.replace('{provider}', provider)}
              </p>
            </>
          ) : (
            <p className="mt-6 text-body text-ink/80">{page.unavailable}</p>
          )}

          <span className="mt-12 h-px w-12 bg-ink/20" aria-hidden="true" />
          <p className="mt-8 text-[0.9375rem] text-ink/80">{page.help}</p>
          <p className="label mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <a
              href={contact.phoneHref}
              className="underline decoration-ink/30 underline-offset-[6px] hover:decoration-ink"
            >
              {contact.phone}
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="normal-case underline decoration-ink/30 underline-offset-[6px] hover:decoration-ink"
            >
              {contact.email}
            </a>
          </p>
        </div>
      </section>
    </CoverStack>
  );
}
