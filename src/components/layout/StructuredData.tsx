import siteConfig from '@content/site.config';
import { legalCompany } from '@content/legal';
import { siteUrl } from '@/lib/seo';

/**
 * schema.org business data for search engines (a HomeAndConstructionBusiness), built only from
 * the facts in content/site.config.ts. No review stars: Google ignores self-published ratings
 * for local businesses, and the Houzz rating lives on Houzz.
 */
export function StructuredData() {
  const { url, name, contact, office, founder, foundedYear, serviceAreas, social, seo } =
    siteConfig;
  const [street, city, stateZip] = office.address.split(', ');
  const [region, postalCode] = stateZip.split(' ');
  const data = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${url}/#business`,
    name,
    legalName: legalCompany.name,
    url,
    description: seo.defaultDescription,
    logo: `${siteUrl()}/images/brand/logo-ink.png`,
    image: `${siteUrl()}/og/home.jpg`,
    telephone: contact.phone,
    email: contact.email,
    foundingDate: String(foundedYear),
    founder: { '@type': 'Person', name: founder },
    address: {
      '@type': 'PostalAddress',
      streetAddress: street,
      addressLocality: city,
      addressRegion: region,
      postalCode,
      addressCountry: 'US',
    },
    geo: { '@type': 'GeoCoordinates', latitude: office.lat, longitude: office.lng },
    areaServed: serviceAreas.map((a) => ({ '@type': 'City', name: `${a.name}, Colorado` })),
    sameAs: social.map((s) => s.href.replace(/^http:/, 'https:')),
  };
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output with < escaped, so no content can close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
