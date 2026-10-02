/**
 * Every headline, intro, label and paragraph on the site, keyed by page and section.
 * Matches the Final Copy document exactly. Bracketed placeholders are pending real
 * figures from Haley and must be replaced before launch, never invented.
 */
const copy = {
  nav: {
    links: [
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Process', href: '/process' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    cta: { label: 'Start the Conversation', href: '/contact' },
    menu: 'Menu',
    exit: 'Exit',
    skip: 'Skip to content',
  },

  home: {
    meta: {
      title: 'Haley Custom Homes | Denver Luxury Custom Home Builder',
      description:
        'Denver custom home builder and luxury remodels across Denver Metro, Boulder, Aspen and Vail. Three to five homes a year since 1998.',
    },
    hero: {
      eyebrow: 'DENVER METRO. BOULDER. ASPEN. VAIL.',
      headline: "Three to five homes a year. Every one built like it's the only one.",
      primary: { label: 'View the Process', href: '/process' },
      ghost: { label: 'See Our Work', href: '/portfolio' },
    },
    positioning: {
      // Set in the accent color within the main line: the fact the whole site is built around.
      highlight: 'three to five homes',
      main: "We build three to five homes a year. Not because we can't build more. Because a home that takes shortcuts isn't a Haley home.",
      supporting:
        'Founded in 1998 by Dan Haley Fuller, Haley Custom Homes has spent {years} years building for families across the Denver Metro area, one home, one owner, at a time.',
    },
    // `{year}` and `{years}` are filled with the current year and the years since 1998 (src/lib/year.ts).
    // Houzz standing, read from Haley's live Houzz profile on 2026-09-26
    // (houzz.com/professionals/home-builders/haley-custom-homes-pfvwus-pf~1703183129).
    reviews: {
      rating: '5.0',
      count: 36,
      countLabel: 'reviews on Houzz',
      bestOf: 'Best of Houzz, every year 2016 to {year}',
      href: 'https://www.houzz.com/professionals/home-builders/haley-custom-homes-pfvwus-pf~1703183129',
      label: 'Client reviews',
    },
    // The transition into the Process page (ProcessTeaser).
    processHighlight: {
      headline: 'A Build That Moves in Order',
      body: 'Every Haley home follows a proprietary sequencing method built on LEAN construction principles, the same discipline that eliminates waste and delay in advanced manufacturing, applied to a custom home. The result is a build that moves in order, without the idle weeks that stretch a typical project.',
      button: { label: 'See the Process', href: '/process' },
    },
    featured: {
      eyebrow: 'SELECTED WORK',
      headline: "A Sample of What We've Built",
      button: { label: 'View Full Portfolio', href: '/portfolio' },
    },
    awards: {
      recognition: 'Recognition',
      asSeenIn: 'As Seen In',
    },
  },

  // The APB System™ lockup (src/components/ui/ApbMark.tsx). Haley's trademarked name, as on its
  // site and its ICAA directory listing: "APB System™ – Accelerated Precision Building".
  apb: {
    monogram: 'APB',
    name: 'Accelerated Precision Building System™',
  },

  // Shared details of the process sequence (Process page): each phase's months and on-site
  // milestones come from an illustrative schedule; `month` places a milestone on it (0 to
  // `months`), shown as the calendar month it falls in. Phases 1 to 5 tick off on the rail as the
  // visitor scrolls past; Move-In stays open, with the way to close it. The quote is two
  // consecutive sentences from the McDonalds' testimonial (content/testimonials.json).
  processSchedule: {
    note: 'Months shown are an illustrative schedule; every home\u2019s is its own.',
    month: 'Month',
    monthsLabel: 'Months',
    months: 14,
    open: 'Open',
    cta: { label: 'Start the Conversation', href: '/contact' },
    quote:
      'We were in the house a month earlier than scheduled. This is my third time building a custom home, and I have never been more satisfied.',
    attribution: 'Michael and Jane McDonald',
    projectType: 'New Custom Home',
  },

  closingCta: {
    scarcity: 'Now accepting a limited number of new projects.',
    headline: 'Building three to five homes a year. One of them could be yours.',
    button: { label: 'Start the Conversation', href: '/contact' },
  },

  footer: {
    tagline:
      'Luxury custom homes and remodels, Denver Metro, Boulder, and the mountain communities, since 1998.',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Process', href: '/process' },
      { label: 'Eco-Building', href: '/eco-building' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Builder 20', href: '/builder20' },
      { label: 'Client Portal', href: '/client-portal' },
    ],
    copyright: '© {year} Haley Custom Homes. All rights reserved.',
  },

  portfolio: {
    meta: {
      title: 'Portfolio',
      description:
        'Luxury custom homes and remodels by Haley Custom Homes across Denver, Cherry Hills Village, Greenwood Village and Boulder.',
    },
    intro:
      'From the ultra modernist to the East Coast traditionalist, every Haley home is built to the family living in it, not to a template.',
    tabs: { 'new-build': 'New Builds', remodel: 'Remodels' },
    empty: 'No projects in this category yet.',
    stats: {
      location: 'Location',
      squareFootage: 'Square Footage',
      buildDuration: 'Build Duration',
      completionYear: 'Completion Year',
      category: 'Type',
    },
    categories: { 'new-build': 'New Build', remodel: 'Remodel' },
    lightbox: {
      close: 'Close',
      previous: 'Previous image',
      next: 'Next image',
    },
  },

  process: {
    meta: {
      title: 'Process',
      description:
        'The Accelerated Precision Building System™: a LEAN-based construction sequencing method that keeps a Haley custom home build moving in order.',
    },
    intro: {
      eyebrow: 'OUR PROCESS',
      headline: 'A Build That Moves in Order',
      supporting:
        "Most custom home timelines stretch not because the work is hard, but because the schedule is loose. Ours isn't.",
    },
    hook: {
      headline: 'See the Difference',
    },
    phases: [
      {
        title: 'Design and Spec Lock',
        body: 'Every layout and finish selection is locked before the first shovel moves, so nothing changes mid-build: the single largest source of delay in custom construction.',
        image: '/images/phases/1-design-spec-lock.jpg',
        milestones: [
          { month: 0.3, label: 'Plans and finishes locked' },
          { month: 0.6, label: 'Permit applied for' },
        ],
      },
      {
        title: 'Pre-Construction Sequencing',
        body: 'Materials are ordered and every trade is scheduled in the exact sequence it\u2019s needed, so no crew stands idle waiting on a delivery, a permit or a decision.',
        image: '/images/phases/2-pre-construction.jpg',
        milestones: [
          { month: 1.3, label: 'Trades and materials scheduled' },
          { month: 2.4, label: 'Permit issued' },
        ],
      },
      {
        title: 'Framing',
        body: 'Every decision is made before framing begins. Framing then follows a fixed sequence built on LEAN construction principles, eliminating wasted motion and wasted time.',
        image: '/images/phases/3-framing.jpg',
        milestones: [
          { month: 2.8, label: 'Ground broken' },
          { month: 3.9, label: 'Foundation poured' },
          { month: 5.5, label: 'Framing inspected' },
        ],
      },
      {
        title: 'Trade Sequencing',
        body: 'Each trade moves in right behind the last, with no gap between them. This is where most custom builds lose their timeline. It\u2019s where a Haley build holds it.',
        image: '/images/phases/4-trade-sequencing.jpg',
        milestones: [
          { month: 6.6, label: 'Roof on, windows in' },
          { month: 8.3, label: 'Rough-ins inspected' },
        ],
      },
      {
        title: 'Finish Work',
        body: 'Finish selections are locked early, so each one installs on schedule, and every detail is inspected against the original specification, not against what\u2019s merely acceptable.',
        image: '/images/phases/5-finish-work.jpg',
        milestones: [
          { month: 10.4, label: 'Cabinetry and stone set' },
          { month: 12.5, label: 'Final inspection' },
        ],
      },
      {
        title: 'Move-In',
        body: 'Quality is checked throughout the build, not only at the end, so the final walk-through confirms your home instead of pushing move-in back.',
        image: '/images/phases/6-move-in.jpg',
        milestones: [{ month: 13.6, label: 'Keys handed over' }],
      },
    ],
    concierge: {
      headline: 'Your Personal Haley Concierge',
      body: 'Every client is paired with a dedicated supervisor and a project manager and estimator for the life of the build. One supervisor per job, never shared across sites: one point of contact who knows your home as well as you do.',
      image: '/images/sections/concierge.jpg',
    },
    // The eco-building summary, linking to /eco-building (facts from haleycustomhomes.com/eco-building).
    eco: {
      eyebrow: 'ECO-BUILDING',
      headline: 'Energy-Efficient Homes',
      body: 'The discipline that takes waste out of the schedule takes it out of the build. Our framing process cuts lumber waste significantly, our homes are built to EPA Indoor airPLUS standards with Energy Star certification, and we have built net-zero homes for years, well ahead of Boulder County’s requirement.',
      button: { label: 'Explore Eco-Building', href: '/eco-building' },
      image: '/images/eco/rooftop-garden.jpg',
    },
  },

  about: {
    meta: {
      title: 'About',
      description:
        'Dan Haley Fuller founded Haley Custom Homes in 1998. A Denver luxury custom home builder that builds three to five homes a year.',
    },
    // The founder introduction. Facts from Haley's About pages (haleycustomhomes.com/about-us
    // and /new-home-custom-builders); each appears once: the dates in the story, the measures
    // in the facts row. `{years}` counts from 1998 (src/lib/year.ts).
    founder: {
      eyebrow: 'THE FOUNDER',
      headline: 'Dan Haley Fuller',
      lede: 'Born and raised in Colorado, Dan has never lost the habit of treating each home like his own.',
      body: 'His work in the Colorado market began in 1991, renovating and reselling homes. By 1996 it had become a commitment to building new homes from the ground up, and in 1998 he founded Haley Custom Homes. He has built for some of Denver\u2019s most prominent families and athletes, bringing an entrepreneur\u2019s and developer\u2019s eye to a boutique building company.',
      personal: 'He lives in Greenwood Village with his wife and their two sons.',
      facts: [
        { value: '{years}', label: 'Years building Haley homes' },
        { value: '4,500\u201320,000', label: 'Square feet, homes he has overseen' },
        { value: 'Every style', label: 'Modernist to traditionalist' },
      ],
      image: '/images/people/dan-fuller.jpg',
      imageAlt: 'Dan Haley Fuller, founder of Haley Custom Homes',
    },
    philosophy: {
      statement:
        "Three to five homes a year isn't a limit we've hit. It's a line we've chosen not to cross.",
      supporting:
        "More homes means less time on each one. We'd rather build fewer, and build them right.",
      image: '/images/sections/philosophy-detail.jpg',
    },
    awardsHeading: 'Awards and recognition',
    affiliations: {
      heading: 'Service and Associations',
      boards: 'Board service, current and past',
      associations: 'Professional associations',
    },
    community: {
      heading: 'In the Community',
      partnersLabel: 'Industry partners',
    },
  },

  contact: {
    meta: {
      title: 'Contact',
      description:
        'Start your custom home or luxury remodel with Haley Custom Homes. Serving Denver, Boulder, Cherry Hills Village, Greenwood Village, Aspen and Vail.',
    },
    headline: 'Start Your Build',
    intro: "Tell us about your project. We'll follow up within one business day.",
    fields: {
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      projectType: 'Project Type',
      budget: 'Budget Range',
      location: 'Location or Neighborhood',
      lot: 'Do you have a lot or site selected?',
      message: 'Message',
    },
    optional: '(optional)',
    selectPrompt: 'Select',
    projectTypes: ['New Custom Home', 'Remodel'],
    budgets: ['Under $600k', '$600k to $1M', '$1M to $4M', '$4M+'],
    lotOptions: ['Yes', 'Not yet', 'Still deciding'],
    submit: 'Send Inquiry',
    sending: 'Sending',
    confirmation: "Thank you. We'll be in touch within one business day.",
    required: 'This field is required.',
    invalidEmail: 'Please enter a valid email address.',
    sendError:
      'Your inquiry could not be sent right now. Please call us directly, or try again in a moment.',
    // Under the submit button, linking to /privacy.
    privacyNote: 'We use what you send only to respond about your project, and never sell it.',
    privacyLink: 'Privacy Policy',
    serviceAreaHeading: 'Where We Build',
    mapLabel:
      'Map of Colorado showing where Haley Custom Homes builds: the Denver Metro area, Boulder, Vail and Aspen, with the office in Greenwood Village',
    officeLabel: 'Office',
    faqEyebrow: 'COMMON QUESTIONS',
  },

  // The eco-building page. Every fact is from haleycustomhomes.com/eco-building.
  eco: {
    meta: {
      title: 'Eco-Building',
      description:
        'Energy-efficient luxury homes in Denver and Boulder: eco framing that cuts lumber waste, EPA Indoor airPLUS construction, Energy Star certification, net-zero homes and Boulder County BuildSmart.',
    },
    hero: {
      eyebrow: 'ECO-BUILDING',
      headline: 'Energy-Efficient Homes',
      intro:
        'Sustainability in home building is more than a trend. It\u2019s the way homes should be built: cleaner air inside, a lower cost of ownership, and protection for what you\u2019ve invested, in a luxury home that makes its neighborhood more beautiful.',
      image: '/images/eco/rooftop-garden.jpg',
    },
    framing: {
      eyebrow: 'ECO FRAMING',
      headline: 'Less Lumber, Same Home',
      body: [
        'Framing is where a home takes shape, and it\u2019s the stage that consumes the most resources. Homes framed the traditional way can use more than forty mature trees for every 2,500 square feet, and luxury homes often use more.',
        'Our framing process, part of the Accelerated Precision Building System™, significantly cuts lumber waste. Whatever the size or architecture of your home, it lowers both the lumber cost and the ecological footprint, without giving up an inch of quality.',
      ],
      stat: { value: '40+', label: 'Mature trees per 2,500 sq ft in traditional framing' },
      image: '/images/eco/framing.jpg',
      imageAlt: 'A Haley home in framing',
    },
    airplus: {
      eyebrow: 'INDOOR AIRPLUS',
      headline: 'The Air Inside Your Home',
      body: 'Even more valuable than the house is the family who calls it home. We build to the EPA\u2019s Indoor airPLUS standards: design that reduces indoor air pollution, controls moisture and mold, and resists radon.',
      benefits: [
        'Energy Star certification for enhanced energy efficiency',
        'No-VOC and low-VOC building materials for cleaner indoor air',
        'Protection against pest entry',
        'Moisture and mold control',
        'Airtight radon resistance',
        'Efficient heating, cooling and insulation systems',
      ],
    },
    netZero: {
      eyebrow: 'NET ZERO',
      headline: 'Homes That Make Their Own Energy',
      body: 'A net-zero home produces as much energy as it consumes. Since 2022, Boulder County has required new homes over 5,000 square feet to meet net-zero standards. We\u2019ve been building to that standard for our clients for years, in every size and style.',
      stats: [
        {
          value: '$1,500\u20131,800',
          label: 'Average annual energy savings in a Haley net-zero home',
        },
        {
          value: '\u2153',
          label: 'Share of Boulder County\u2019s energy used by conventionally built homes',
        },
      ],
      benefits: [
        'Lower long-term cost of ownership',
        'Year-round comfort from net-zero heating and cooling',
        'Protection against rising energy costs',
        'Easier to maintain',
        'Net-zero carbon emissions',
      ],
    },
    features: {
      eyebrow: 'GREEN, WITHOUT COMPROMISE',
      headline: 'Efficient and Beautiful',
      intro:
        'Homes that exceed today\u2019s eco-friendly standards and still belong to the landscape of their neighborhood.',
      items: [
        {
          id: 'rain',
          title: 'Rain Capture Tanks',
          body: 'Harvested rainwater reduces stormwater runoff and waters gardens, landscaping and fountains, in tanks designed to suit the home.',
        },
        {
          id: 'roof',
          title: 'Rooftop Gardens and Solar',
          body: 'Solar panels among a landscaped roof garden: more efficient, cooler inside, cleaner air, and room to grow flowers or food.',
        },
        {
          id: 'passive',
          title: 'Passive Design',
          body: 'Passive solar, efficient ventilation, and window design and placement that keep a home comfortable through Colorado\u2019s weather extremes.',
        },
        {
          id: 'envelope',
          title: 'Airtight Building Envelope',
          body: 'A tight barrier between inside and out that still lets in plenty of natural light, for efficient energy use against the harshest weather.',
        },
      ],
      image: '/images/eco/rain-capture.jpg',
      imageAlt: 'A rain capture tank beside a stone wall at a Haley home',
    },
    buildSmart: {
      eyebrow: 'BOULDER COUNTY BUILDSMART',
      headline: 'Meeting and Exceeding BuildSmart',
      body: 'Boulder County BuildSmart sets the county\u2019s green building requirements for sustainable, energy-efficient homes. We meet and exceed them, working with each client and their architect so every requirement is met through the build, for better indoor air, fewer greenhouse gases and a lighter footprint. Our homes are also built to the checklists of Built Green Colorado, the green building program of the Home Builders Association of Metro Denver.',
    },
    closing:
      'Whether you\u2019re building from the ground up or remodeling for a greener home, we\u2019re here to be your partner.',
  },

  // /builder20: the NAHB 20 Club builders Haley recommends outside Colorado (content/builder20.json).
  builder20: {
    meta: {
      title: 'Builder 20',
      description:
        'Building outside Colorado? The custom home builders Haley Custom Homes knows personally through the NAHB Builder 20 Club, and recommends in their markets.',
    },
    eyebrow: 'NAHB BUILDER 20 CLUB',
    headline: 'Building Outside Colorado?',
    intro:
      'We meet twice a year with a select group of builders through the National Association of Home Builders’ 20 Clubs. They are similar in size and scope to our own business, and we work together on improving our companies. We know each of them personally, and we recommend them in their markets.',
    visit: 'Visit website',
    listLabel: 'Builders we recommend',
  },

  // /client-portal: hands clients to the portal set in site.config (clientPortal).
  clientPortal: {
    meta: {
      title: 'Client Portal',
      description: 'Sign in to the Haley Custom Homes client portal.',
    },
    eyebrow: 'CLIENTS',
    headline: 'Client Portal',
    body: 'Your project schedule, notes from our meetings and conversations, and change orders, in one place.',
    button: 'Sign In to the Portal',
    secure: 'Continues to {provider}’s secure sign-in.',
    help: 'Trouble signing in? We’re here to help.',
    unavailable:
      'The client portal is being connected to the new site. In the meantime, reach us directly for anything about your project.',
  },

  notFound: {
    eyebrow: 'PAGE NOT FOUND',
    headline: "This page doesn't exist. The homes we build do.",
    primary: { label: 'Back to Home', href: '/' },
    ghost: { label: 'View Our Work', href: '/portfolio' },
  },
} as const;

export default copy;
