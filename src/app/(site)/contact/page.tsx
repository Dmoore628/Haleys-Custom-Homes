import type { Metadata } from 'next';
import copy from '@content/copy.config';
import siteConfig from '@content/site.config';
import { faq } from '@/lib/content';
import { Accordion } from '@/components/ui/Accordion';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { ContactForm } from '@/components/sections/ContactForm';
import { ServiceAreaMap } from '@/components/sections/ServiceAreaMap';

export const metadata: Metadata = {
  title: copy.contact.meta.title,
  description: copy.contact.meta.description,
  openGraph: { images: [{ url: '/og/contact.jpg', width: 1200, height: 630 }] },
};

export default function ContactPage() {
  const { contact } = copy;
  const { phone, phoneHref, email } = siteConfig.contact;
  return (
    <>
      <section className="section-x bg-bone pb-section pt-[calc(6.5rem+clamp(3rem,7vw,7rem))]">
        <div className="flex flex-col gap-16 lg:grid lg:grid-cols-12 lg:gap-x-grid lg:gap-y-0">
          {/* Left: the qualification form. */}
          <div className="lg:col-span-7">
            <Reveal>
              <h1 className="font-serif text-section font-normal">{contact.headline}</h1>
              <p className="mt-6 max-w-text text-body">{contact.intro}</p>
            </Reveal>
            <Reveal className="mt-12" delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>

          {/* Right: the service-area map and list, then direct contact. */}
          <aside className="lg:col-span-4 lg:col-start-9" aria-labelledby="service-area-heading">
            <Reveal>
              <ServiceAreaMap />
            </Reveal>
            <Reveal className="mt-10 flex flex-col gap-2" delay={0.1}>
              <a
                href={phoneHref}
                className="text-body text-accent underline-offset-4 hover:underline"
              >
                {phone}
              </a>
              <a
                href={`mailto:${email}`}
                className="text-body text-accent underline-offset-4 hover:underline"
              >
                {email}
              </a>
            </Reveal>
          </aside>
        </div>
      </section>

      <section className="section-x bg-bone pb-section" aria-labelledby="faq-heading">
        <div className="mx-auto w-[min(600px,100%)]">
          <Reveal>
            <Eyebrow>
              <span id="faq-heading">{contact.faqEyebrow}</span>
            </Eyebrow>
          </Reveal>
          <Reveal className="mt-6" delay={0.1}>
            <Accordion items={faq} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
