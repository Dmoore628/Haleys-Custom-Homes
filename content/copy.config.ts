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
        'Founded in 1998 by Dan Haley Fuller, Haley Custom Homes has spent over 25 years building for families across the Denver Metro area, one home, one owner, at a time.',
    },
    // Houzz standing, read from Haley's live Houzz profile on 2026-09-26
    // (houzz.com/professionals/home-builders/haley-custom-homes-pfvwus-pf~1703183129).
    reviews: {
      rating: '5.0',
      count: 36,
      countLabel: 'reviews on Houzz',
      bestOf: 'Best of Houzz, every year 2016 to 2026',
      href: 'https://www.houzz.com/professionals/home-builders/haley-custom-homes-pfvwus-pf~1703183129',
      label: 'Client reviews',
    },
    processHighlight: {
      eyebrow: 'THE ACCELERATED PRECISION BUILDING SYSTEM',
      body: 'Every Haley home follows a proprietary sequencing method built on LEAN construction principles, the same discipline that eliminates waste and delay in advanced manufacturing, applied to a custom home. The result is a build that moves in order, without the idle weeks that stretch a typical project.',
      button: { label: 'Learn the Process', href: '/process' },
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

  // The six stages and the wait a typical build risks at each, used by the punch list.
  ledger: {
    rows: [
      {
        name: 'Design and Spec Lock',
        annotation:
          "The wait a typical build risks here: mid-build changes to layout or finishes that weren't locked in advance.",
      },
      {
        name: 'Pre-Construction Sequencing',
        annotation:
          "The wait a typical build risks here: a crew standing idle on a delivery or a permit that wasn't sequenced ahead of time.",
      },
      {
        name: 'Framing',
        annotation:
          'The wait a typical build risks here: framing crews sitting on a decision that should have already been made.',
      },
      {
        name: 'Trade Sequencing',
        annotation:
          'The wait a typical build risks here: one trade waiting on the last trade to finish before starting their own work.',
      },
      {
        name: 'Finish Work',
        annotation:
          'The wait a typical build risks here: a finish selection made too late to install on schedule.',
      },
      {
        name: 'Move-In',
        annotation:
          'The wait a typical build risks here: a final walk-through finding problems that push move-in back.',
      },
    ],
  },

  // The architect's punch list (Home and Process): stages 1 to 5 close; Move-In stays open.
  punchList: {
    title: 'Punch List',
    closed: 'Closed',
    open: 'Open',
    cta: { label: 'Start the Conversation', href: '/contact' },
  },

  // The move-in timeline beneath the punch list. The quote is two consecutive sentences from the
  // McDonalds' testimonial (content/testimonials.json).
  moveIn: {
    moved: 'Moved in',
    scheduled: 'Scheduled move-in',
    early: 'One month early',
    quote:
      'We were in the house a month earlier than scheduled. This is my third time building a custom home, and I have never been more satisfied.',
    attribution: 'Michael and Jane McDonald',
    projectType: 'New Custom Home',
    label:
      'Timeline: a build moves through the six stages and reaches move-in one month before the scheduled move-in date.',
    // Example milestones for each of the six stages, in build order. Illustrative, not a
    // specific project's schedule, and labelled as such on the page.
    sequenceNote: 'An illustrative build sequence',
    milestones: [
      ['Plans and finishes locked', 'Permit applied for'],
      ['Trades scheduled in sequence', 'Permit issued'],
      ['Foundation poured', 'Frame inspected'],
      ['Each trade follows the last', 'Rough-ins inspected'],
      ['Finishes installed to spec', 'Checked against the spec'],
      ['Final walk-through', 'Keys handed over'],
    ],
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
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
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
    },
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
        'The Accelerated Precision Building System: a LEAN-based construction sequencing method that keeps a Haley custom home build moving in order.',
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
        body: 'Every detail, from layout to finish selections, is locked before the first shovel moves. Changes mid-build are the single largest source of delay in custom construction, and we design them out from the start.',
        image: '/images/phases/1-design-spec-lock.jpg',
      },
      {
        title: 'Pre-Construction Sequencing',
        body: "Materials are ordered and trades are scheduled in the exact sequence they'll be needed, so no crew is ever standing idle waiting on a delivery or a decision.",
        image: '/images/phases/2-pre-construction.jpg',
      },
      {
        title: 'Framing',
        body: 'Framing follows a fixed sequence built on LEAN construction principles, the same discipline manufacturers use to eliminate wasted motion and wasted time.',
        image: '/images/phases/3-framing.jpg',
      },
      {
        title: 'Trade Sequencing',
        body: "Each trade moves in behind the last with no gap between them. This is where most custom builds lose their timeline. It's where a Haley build holds it.",
        image: '/images/phases/4-trade-sequencing.jpg',
      },
      {
        title: 'Finish Work',
        body: "Every detail is inspected against the original specification, not against what's merely acceptable.",
        image: '/images/phases/5-finish-work.jpg',
      },
      {
        title: 'Move-In',
        body: 'One family moved in a full month ahead of schedule. This is what the system is built to do, on every home, not just the ones that go right.',
        image: '/images/phases/6-move-in.jpg',
      },
    ],
    concierge: {
      headline: 'Your Personal Haley Concierge',
      body: 'Every client is paired with a dedicated supervisor and project manager for the life of the build, one point of contact who knows your home as well as you do.',
      image: '/images/sections/concierge.jpg',
    },
  },

  about: {
    meta: {
      title: 'About',
      description:
        'Dan Haley Fuller founded Haley Custom Homes in 1998. A Denver luxury custom home builder that builds three to five homes a year.',
    },
    founder: {
      headline: 'Dan Haley Fuller',
      body: 'Dan Fuller founded Haley Custom Homes in 1998, building on real estate experience in the Colorado market that began in 1991. What started with renovating and reselling homes became, in 1996, a commitment to building new homes from the ground up. In the decades since, Dan has personally overseen custom homes ranging from 4,500 to 20,000 square feet, all without ever losing the habit of treating each one like his own.',
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
    serviceAreaHeading: 'Where We Build',
    mapLabel:
      'Map of Colorado showing where Haley Custom Homes builds: the Denver Metro area, Boulder, Vail and Aspen, with the office in Greenwood Village',
    officeLabel: 'Office',
    faqEyebrow: 'COMMON QUESTIONS',
  },

  notFound: {
    eyebrow: 'PAGE NOT FOUND',
    headline: "This page doesn't exist. The homes we build do.",
    primary: { label: 'Back to Home', href: '/' },
    ghost: { label: 'View Our Work', href: '/portfolio' },
  },

  cookie: {
    body: 'This site uses cookies for basic analytics.',
    button: 'Got It',
  },
} as const;

export default copy;
