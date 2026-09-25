/**
 * Business facts. Replace this file (with the rest of content/) to re-skin the template.
 */
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
    phone: '303-601-9446',
    phoneHref: 'tel:+13036019446',
    email: 'dan@haleycustomhomes.com',
  },
  office: {
    address: '5211 S Quebec Street, Greenwood Village, CO 80111',
    // OpenStreetMap geocode of the address.
    lat: 39.6219767,
    lng: -104.9057358,
  },
  // Contact page list, per the Final Copy document; coordinates are each city's center.
  serviceAreas: [
    { name: 'Denver', lat: 39.7392, lng: -104.9903 },
    { name: 'Boulder', lat: 40.015, lng: -105.2705 },
    { name: 'Cherry Hills Village', lat: 39.6417, lng: -104.9594 },
    { name: 'Greenwood Village', lat: 39.6172, lng: -104.9508 },
    { name: 'Centennial', lat: 39.5807, lng: -104.8772 },
    { name: 'Aspen', lat: 39.1911, lng: -106.8175 },
    { name: 'Vail', lat: 39.6403, lng: -106.3742 },
  ],
  heroServiceAreas: 'DENVER METRO. BOULDER. ASPEN. VAIL.',
  social: [
    { id: 'pinterest', label: 'Pinterest', href: 'https://www.pinterest.com/haleycstmhomes/' },
    {
      id: 'youtube',
      label: 'YouTube',
      href: 'http://www.youtube.com/channel/UCCv8HSL4i52vp5CGe0tc-AQ',
    },
    { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/HaleyCustomHomes/' },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/company/haley-custom-homes',
    },
    {
      id: 'houzz',
      label: 'Houzz',
      href: 'https://www.houzz.com/pro/haleycustomhomes/haley-custom-homes',
    },
    { id: 'x', label: 'X', href: 'https://twitter.com/haleycustom' },
    { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/haleycustomhomes/' },
  ],
  credit: {
    label: 'In support of the Institute of Classical Architecture & Art, Rocky Mountain Chapter',
    href: 'https://www.classicist.org/membership-and-chapters/chapters/rocky-mountain/',
  },
  seo: {
    titleSuffix: 'Haley Custom Homes',
    defaultTitle: 'Haley Custom Homes | Denver Custom Home Builder',
    defaultDescription:
      'Luxury custom home builder and remodeler serving Denver Metro, Boulder, Aspen and Vail since 1998. Three to five homes a year, built with the Accelerated Precision Building System.',
  },
} as const;

export type SocialId = (typeof siteConfig.social)[number]['id'];

export default siteConfig;
