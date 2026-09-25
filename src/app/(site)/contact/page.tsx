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
};

export default function ContactPage() {
  const { contact } = copy;
  const { phone, phoneHref, email, emailPlaceholder } = siteConfig.contact;
  return (
    <>
      <section className="section-x bg-bone pb-section pt-[calc(6.5rem+clamp(4rem,9vw,9rem))]">
        <div className="flex flex-col gap-16 md:grid md:grid-cols-12 md:gap-x-grid md:gap-y-0">
          {/* Left: the qualification form. */}
          <div className="md:col-span-7">
            <Reveal>
              <h1 className="font-serif text-section font-normal">{contact.headline}</h1>
              <p className="mt-6 max-w-text text-body">{contact.intro}</p>
            </Reveal>
            <Reveal className="mt-12" delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>

          {/* Right: map, service-area list, direct contact. */}
          <aside className="md:col-span-4 md:col-start-9" aria-labelledby="service-area-heading">
            <Reveal>
              <ServiceAreaMap />
              <h2 id="service-area-heading" className="label mt-10">
                {contact.serviceAreaHeading}
              </h2>
            </Reveal>
            <ul className="mt-6 flex flex-col gap-3">
              {siteConfig.serviceAreas.map((area, i) => (
                <Reveal as="li" key={area} delay={0.04 * i} className="label">
                  {area}
                </Reveal>
              ))}
            </ul>
            <Reveal className="mt-10 flex flex-col gap-2" delay={0.1}>
              <a href={phoneHref} className="text-body text-accent underline-offset-4 hover:underline">
                {phone}
              </a>
              {email ? (
                <a href={`mailto:${email}`} className="text-body text-accent underline-offset-4 hover:underline">
                  {email}
                </a>
              ) : (
                <p className="text-body text-accent">{emailPlaceholder}</p>
              )}
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
