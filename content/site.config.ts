/**
 * Business facts. Replace this file (with the rest of content/) to re-skin the template.
 */
export const PLACEHOLDER = '[PLACEHOLDER, confirm before launch]';

const siteConfig = {
  name: 'Haley Custom Homes',
  shortName: 'Haley',
  tagline:
    'Luxury custom homes and remodels, Denver Metro, Boulder, and the mountain communities, since 1998.',
  foundedYear: 1998,
  founder: 'Dan Haley Fuller',
  buildsPerYear: { min: 3, max: 5 },
  url: 'https://haleycustomhomes.com',
  contact: {
    // Verified on Houzz and BuildZoom.
    phone: '303-601-9446',
    phoneHref: 'tel:+13036019446',
    // Only the masked form d***@haleycustomhomes.com is verified. Do not guess the address.
    email: null as string | null,
    emailPlaceholder: `${PLACEHOLDER.slice(0, -1)}: email address]`,
  },
  // Contact page list, per the Final Copy document.
  serviceAreas: [
    'Denver',
    'Boulder',
    'Cherry Hills Village',
    'Greenwood Village',
    'Centennial',
    'Aspen',
    'Vail',
  ],
  heroServiceAreas: 'DENVER METRO. BOULDER. ASPEN. VAIL.',
  // Social accounts are omitted until Haley confirms active, maintained ones.
  social: [] as { label: string; href: string }[],
  seo: {
    titleSuffix: 'Haley Custom Homes',
    defaultTitle: 'Haley Custom Homes | Denver Custom Home Builder',
    defaultDescription:
      'Luxury custom home builder and remodeler serving Denver Metro, Boulder, Aspen and Vail since 1998. Three to five homes a year, built with the Accelerated Precision Building System.',
  },
} as const;

export default siteConfig;
