/**
 * The site's legal pages: /privacy, /terms and /accessibility. Written to match what the site
 * actually does (September 2026 audit): no analytics, no advertising or tracking cookies, a
 * contact form whose inquiries are emailed to Haley and not stored by the site, a client portal
 * run by Buildertrend, and hosting that keeps standard server logs. If any of that changes (for
 * example, analytics is added), update the Privacy Policy before it goes live.
 *
 * The Privacy Policy keeps the commitments from Haley's previous policy (haleycustomhomes.com/
 * privacy-policy) that still apply: privacy of critical importance, no sharing of email addresses,
 * users over 18, EEA rights, sale of business, consent to material changes, written notice. It
 * drops that policy's template sections for features this site does not have (Google Analytics,
 * AdThrive advertising, Facebook remarketing, newsletters, user accounts).
 *
 * These are plain-language documents prepared for Haley's review; they are not legal advice.
 * Have them reviewed by Haley's attorney before launch.
 *
 * Tokens: {company}, {address}, {phone}, {email} are filled from content/site.config.ts.
 */

export interface LegalSection {
  id: string;
  heading: string;
  /** Paragraphs, in order. */
  body: string[];
  /** An optional list after the paragraphs. */
  list?: string[];
}

export interface LegalDoc {
  path: string;
  title: string;
  description: string;
  effective: string;
  intro: string;
  sections: LegalSection[];
}

export const legalCompany = {
  /** The legal entity, as registered (BBB and ICAA listings: Haley Custom Homes, LLC). */
  name: 'Haley Custom Homes, LLC',
};

const privacy: LegalDoc = {
  path: '/privacy',
  title: 'Privacy Policy',
  description:
    'How Haley Custom Homes collects, uses and protects the information you share through this website.',
  effective: 'September 29, 2026',
  intro:
    'As the owner of this website, {company} understands that your privacy is of critical importance. This policy explains what information we collect through the site, how we use and disclose it, and the choices you have. It replaces the privacy policy on our previous website, whose advertising, analytics and account features this site does not have.',
  sections: [
    {
      id: 'what-we-collect',
      heading: 'What we collect',
      body: [
        'When you send an inquiry through our contact form, we receive what you enter: your name, email address and phone number, the type of project, a budget range, and, if you choose to share them, your location or neighborhood, whether you have a lot, and a message. We also receive whatever you send us directly by email or phone.',
        'Like almost every website, our hosting provider automatically records standard technical information when pages are requested, such as your IP address, browser type, the page requested and the time. We use your IP address briefly to limit repeated form submissions and protect the site from abuse.',
      ],
    },
    {
      id: 'cookies',
      heading: 'Cookies and tracking',
      body: [
        'This website does not use analytics, advertising or tracking cookies, and it does not follow you across other websites. Because we do not track visitors, there is nothing to opt out of; your browser’s Do Not Track and Global Privacy Control signals are respected by default.',
        'The only cookie the site sets is a sign-in cookie for Haley staff who manage the portfolio, and it is never set for visitors.',
      ],
    },
    {
      id: 'how-we-use',
      heading: 'How we use your information',
      body: ['We use the information you share to:'],
      list: [
        'respond to your inquiry and talk with you about your project;',
        'provide our services if you become a client;',
        'keep this website secure and working; and',
        'meet our legal and accounting obligations.',
      ],
    },
    {
      id: 'sharing',
      heading: 'Who we share it with',
      body: [
        'We do not sell your personal information, we do not share it for advertising, and we will not share your email address with third parties for their own use. We share information only with the service providers that help us run the website and our business, such as our website host and our email provider, and only as needed for them to do that work. If you become a client, we share project information with the architects, designers and trade partners working on your home, as your project requires.',
        'We may also disclose information when the law requires it, or to protect our rights or the safety of others.',
      ],
    },
    {
      id: 'client-portal',
      heading: 'Client portal',
      body: [
        'Our clients sign in to their project portal through Buildertrend, a separate service. The portal page on this site links to Buildertrend’s own sign-in; you never enter your password on this site. Information in the portal is handled under Buildertrend’s terms and privacy policy.',
      ],
    },
    {
      id: 'other-sites',
      heading: 'Links to other websites',
      body: [
        'This site links to other websites, including Houzz, our social media pages, the builders on our Builder 20 page and the organizations we belong to. Their privacy practices are their own; please review their policies when you visit them.',
      ],
    },
    {
      id: 'retention',
      heading: 'How long we keep it',
      body: [
        'Inquiries are delivered to our email and kept for as long as we need them to respond to you and for our business records. If you become a client, we keep project records for as long as the project and our legal, warranty and tax obligations require.',
      ],
    },
    {
      id: 'security',
      heading: 'Security',
      body: [
        'The site is served only over encrypted connections, form submissions are validated and rate-limited, and access to the site’s administration is limited to Haley staff. No method of transmission or storage is completely secure, but we take reasonable measures to protect the information you share.',
      ],
    },
    {
      id: 'your-choices',
      heading: 'Your choices and rights',
      body: [
        'You can ask us at any time to tell you what personal information we have about you, to correct it, or to delete it, and you can ask us to stop contacting you; any email we send you about our services can also be declined with a reply. Depending on where you live, including under the Colorado Privacy Act where it applies, you may have additional rights. Contact us using the details below, or by written notice to our office; we will respond within 45 days.',
      ],
    },
    {
      id: 'eea',
      heading: 'Residents of the European Economic Area',
      body: [
        'If you live in a country in the European Economic Area, you have the right, under the GDPR and applicable data protection laws, to:',
      ],
      list: [
        'access your personal data;',
        'ensure the accuracy of your personal data;',
        'have us delete your personal data;',
        'restrict further processing of your personal data; and',
        'complain to a data protection supervisory authority in the country where you live or work, or where you believe your data was misused.',
      ],
    },
    {
      id: 'age',
      heading: 'Age',
      body: [
        'This website is intended for users over the age of 18. It is not directed to children, and we do not knowingly collect information from them.',
      ],
    },
    {
      id: 'sale-of-business',
      heading: 'Sale of business or assets',
      body: [
        'If the site or substantially all of our assets is sold or transferred, whether by merger, sale of assets or otherwise, or in the event of insolvency, bankruptcy or receivership, the information we have collected may be among the assets transferred.',
      ],
    },
    {
      id: 'changes',
      heading: 'Changes to this policy',
      body: [
        'We may change this policy from time to time, as our practices change or as we add or change services. The current version will always be posted here with its effective date. If we make a material change, or intend to use personal information in a way that is materially different from what this policy said when we collected it, we will give you a reasonable opportunity to consent first; if you do not, we will keep using your information under the policy in effect when we collected it.',
      ],
    },
    {
      id: 'contact',
      heading: 'Contact us',
      body: [
        'If you have any questions about this policy or our practices, or to exercise any of your rights, contact us at {email}, call {phone}, or write to {company}, {address}.',
      ],
    },
  ],
};

const terms: LegalDoc = {
  path: '/terms',
  title: 'Terms of Use',
  description: 'The terms that apply to your use of the Haley Custom Homes website.',
  effective: 'September 29, 2026',
  intro:
    'These terms apply to your use of this website, operated by {company}. By using the site, you agree to them.',
  sections: [
    {
      id: 'information-only',
      heading: 'Information, not an offer',
      body: [
        'The content on this site is general information about our company and our work. It is not an offer, a quote or a contract. No agreement exists between you and {company} until we both sign a written contract, and the terms of that contract govern any project. Budgets, schedules, features and availability vary with every home.',
      ],
    },
    {
      id: 'illustrative',
      heading: 'Illustrative content',
      body: [
        'Some content illustrates how we work rather than describing a specific project. In particular, the build schedule and timeline on our Home and Process pages are illustrative; every home’s schedule is its own. Photographs may show furnishings, landscaping, finishes or options chosen by individual clients or provided by others. Testimonials reflect the experiences of individual clients; your experience may differ.',
      ],
    },
    {
      id: 'ownership',
      heading: 'Our content',
      body: [
        'The text, photographs, video, graphics and design of this site, the Haley Custom Homes name and logo, and the Accelerated Precision Building System™ (APB System™) name belong to {company} or to the photographers and others who license them to us. You may view and share links to the site for personal use, but you may not copy, reproduce or use its content for any other purpose without our written permission.',
      ],
    },
    {
      id: 'others-marks',
      heading: 'Other organizations’ names and logos',
      body: [
        'Names and logos of the associations, organizations, publications, awards programs, partners and builders shown on this site belong to their owners. They appear to identify our memberships, recognition, coverage and relationships, and their appearance does not imply that those organizations endorse Haley Custom Homes.',
      ],
    },
    {
      id: 'third-parties',
      heading: 'Other websites and services',
      body: [
        'Links to other websites, and third-party services such as Houzz and the Buildertrend client portal, are provided for convenience. We do not control them and are not responsible for their content, availability or practices, and their own terms apply when you use them.',
      ],
    },
    {
      id: 'use',
      heading: 'Using the site',
      body: [
        'Please do not use the site in a way that could damage it or interfere with others’ use of it, attempt to gain unauthorized access to any part of it, collect its content with automated tools, or submit false or misleading information through its forms.',
      ],
    },
    {
      id: 'disclaimer',
      heading: 'Disclaimer',
      body: [
        'We work to keep the site accurate and available, but it is provided as is, without warranties of any kind, express or implied. We do not guarantee that it will be error-free or uninterrupted.',
      ],
    },
    {
      id: 'liability',
      heading: 'Limitation of liability',
      body: [
        'To the fullest extent the law allows, {company} is not liable for any indirect, incidental or consequential damages arising from your use of this website. Nothing in these terms limits any rights you have under a signed contract with us.',
      ],
    },
    {
      id: 'law',
      heading: 'Governing law',
      body: [
        'These terms are governed by the laws of the State of Colorado. Any dispute about this website will be resolved in the state or federal courts located in Colorado.',
      ],
    },
    {
      id: 'changes',
      heading: 'Changes to these terms',
      body: [
        'We may update these terms from time to time. The effective date above shows when they last changed; continuing to use the site means you accept the current version.',
      ],
    },
    {
      id: 'contact',
      heading: 'Contact us',
      body: ['{company}, {address}. Phone {phone}. Email {email}.'],
    },
  ],
};

const accessibility: LegalDoc = {
  path: '/accessibility',
  title: 'Accessibility',
  description:
    'Haley Custom Homes’ commitment to an accessible website, and how to reach us for help.',
  effective: 'September 29, 2026',
  intro:
    'We want everyone to be able to explore our work and reach us easily. This website is designed to meet the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA.',
  sections: [
    {
      id: 'what-we-do',
      heading: 'What we do',
      body: ['Among the measures built into the site:'],
      list: [
        'a clear heading structure and landmarks, and a skip link to the main content;',
        'full keyboard navigation with visible focus;',
        'text alternatives for meaningful images, with decorative images and video hidden from screen readers;',
        'color contrast that meets WCAG AA for text;',
        'animation that respects your device’s reduced-motion setting, showing each section in its finished state; and',
        'layouts that adapt to any screen size and to zoomed text.',
      ],
    },
    {
      id: 'testing',
      heading: 'How we check',
      body: [
        'Every page is tested automatically against WCAG 2.1 AA rules on desktop and mobile each time the site changes, alongside manual review.',
      ],
    },
    {
      id: 'limits',
      heading: 'Known limitations',
      body: [
        'Some services we link to, including Houzz, our social media pages and the Buildertrend client portal, are operated by others, and their accessibility is outside our control. The background video on our home page has no audio and carries no information that is not also in the page’s text.',
      ],
    },
    {
      id: 'help',
      heading: 'Need help, or found a problem?',
      body: [
        'If anything on this site is hard to use, please tell us. We will get you the information you need in a way that works for you, and fix the problem. Call {phone} or email {email}.',
      ],
    },
  ],
};

export const legalDocs = { privacy, terms, accessibility };

/** The footer's legal links, in order. */
export const legalLinks = [
  { label: 'Privacy', href: privacy.path },
  { label: 'Terms', href: terms.path },
  { label: 'Accessibility', href: accessibility.path },
];
