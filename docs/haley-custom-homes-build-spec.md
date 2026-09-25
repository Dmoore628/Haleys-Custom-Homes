# Haley Custom Homes: Website Build Spec

This document, and the five that accompany it (Component/Interaction Spec, Design System, Home Page Spec, Remaining Pages Spec, Final Copy), together contain every decision Claude Code needs to build this site. Nothing here is a suggestion for Claude Code to interpret or improve on. Where a number is a real business fact still pending confirmation, it is bracketed and flagged, never invented.

This is a full independent rebuild of the earlier version of this project, re-derived from the same underlying facts rather than copied forward. Where the facts haven't changed, the conclusions land in familiar territory for that reason: a builder that does 3 to 5 homes a year with a named proprietary process does not have many honest ways to position itself, and pretending otherwise would mean inventing a story instead of telling a true one. Where genuine judgment calls were open, this pass made its own, and a few land differently. Those are called out inline as they come up.

## The actual problem this site has to solve

A prospective client for a $4M-plus custom home is not browsing a directory, they're vetting a small number of builders they already have some reason to trust. Haley builds 3 to 5 homes a year. That's not a marketing number, it's a hard capacity ceiling: the business cannot and should not try to convert high volumes of anonymous traffic into leads, because it can only take on a handful of new clients regardless of how many inquiries arrive. So the site's job is not lead volume. It's to do three things for a small number of serious visitors: prove the track record is real, explain what makes the process different in concrete terms, and let a visitor self-qualify against budget and project type before they ever pick up the phone.

## Positioning, derived from verified facts

Three real facts carry the entire site's argument:

1. **Scarcity is real, not manufactured.** Haley builds 3 to 5 homes a year by choice, and has since 1998. This is the single most differentiating fact about the business, and the site should say it plainly and early, not bury it in a bio paragraph.
2. **The process has a name.** The Accelerated Precision Building System is a real, LEAN-construction-based sequencing method, not a phrase invented for this site. A named, explainable process is concrete evidence in a way a generic claim of "quality and speed" isn't, and it earns its own page rather than a paragraph on About.
3. **The proof already exists in Haley's own testimonials and awards, unused.** Real client language ("we were in the house a month earlier than scheduled," "no small feat during the pandemic") and real third-party recognition (Houzz, Luxury Lifestyle Awards, Energy Star, LUXE Interiors + Design) already exist. Nothing needs to be invented to make a credible premium case, they just need to be surfaced with actual weight instead of buried under generic "quality craftsmanship" language.

## Tech stack

- **Framework:** Next.js 14+, App Router. Every page except the contact form's submission handler is static, and stays that way, most of what makes this hostable anywhere and cheap to run comes from that. The one exception below is small and deliberate, not a reason to abandon the static-first approach.
- **Styling:** Tailwind CSS, configured directly against the tokens in the Design System document. No ad hoc values living outside that token set.
- **Animation:** Framer Motion for scroll-triggered reveals, scroll-linked progress effects, and layout animations (the filter tab underline, page transitions). Lenis for smooth-scroll momentum sitewide, ordinary browser scroll reads as cheap at this price point by comparison.
- **Type:** Self-hosted via `next/font`, per the exact typefaces named in the Design System document. No Google Fonts CDN link, no flash of unstyled text.
- **Forms:** a custom API route (`/api/contact`), owned and self-hosted, not a third-party form SaaS. Full reasoning and setup in the Contact Form Field Spec section below.
- **Images/video:** `next/image` for every image (build-time blur placeholders, no layout shift). The hero video is a plain HTML5 `<video>` element, muted, autoplay, loop, no controls, no third-party player chrome.

## Content-layer architecture (required for template resale, not optional)

Every piece of client-specific content lives in a small set of typed config and data files, never hardcoded inside a component. This is what turns the build into a resellable template rather than a one-off site:

- `content/site.config.ts`: business name, tagline, service area list, contact info, social links if any, the scarcity/build-volume figures.
- `content/copy.config.ts`: every headline, section intro, button label, and body paragraph, keyed by page and section, matching the Final Copy document exactly.
- `content/projects.json`: one entry per portfolio project (slug, category, location, square footage, build duration, completion year, image and video paths).
- `content/testimonials.json`: quote, client name, project type.
- `content/awards.json`: mark or logo path, award name, year, one-line description.
- `content/faq.json`: question and answer pairs for the Contact page accordion.

Genericizing this build for a different luxury home builder later means replacing the contents of these six files and swapping the media asset folder. No component code should need to change for that.

## Sitemap and navigation

Five pages plus one system page:

1. **Home** (`/`)
2. **Portfolio** (`/portfolio`), with individual project detail pages at `/portfolio/[slug]`
3. **Process** (`/process`)
4. **About** (`/about`)
5. **Contact** (`/contact`)
6. **Not Found** (`/not-found`), a real, designed page, not the framework default

Nav bar, desktop: logo left, page links right (Portfolio, Process, About, Contact), one primary-styled "Start the Conversation" link at the far right, visually distinct from the ordinary page links so the single conversion action stays visible at all times rather than hidden behind a menu click. Fixed position, transparent over the hero video. After 80px of scroll, the background transitions to the base bone color with a 1px ink-at-10%-opacity bottom border, not a solid ink fill, that's reserved for the footer and closing CTA elsewhere in the Design System, and repeating it a third time on every scrolled page would dilute it into wallpaper rather than a deliberate moment.

Nav bar, mobile: logo left, a single "Menu" trigger right, per the Component/Interaction Spec's exact letter-stagger and full-screen-overlay behavior. Five visible items (four links plus the CTA) don't comfortably fit inline at phone width, so they collapse behind the single trigger here, unlike desktop, where the same five items stay visible because there's room for them and hiding the one conversion action behind an extra click works against a site whose whole job is getting a low-volume, high-intent visitor to that form with minimal friction.

Process keeps its own top-level nav position rather than living inside About, because it answers a different question than About does: About is "can I trust this person," Process is "will this actually go the way they say it will." Folding the two together would bury a real differentiator behind founder biography.

## Contact form field spec

Full field behavior is in the Remaining Pages document. In summary: Name, Email, Phone, Project Type (dropdown), Budget Range (dropdown), Location or Neighborhood (optional), Message (optional). Budget Range exists specifically so the form can filter honestly, a visitor whose project is well under Haley's real minimum should see that reflected in the options rather than be led to submit and be told no later.

**Submission handling, why a third-party form service was rejected:** Formspree and Web3Forms both work and are free at this volume, a builder taking on 3 to 5 clients a year will never approach either service's free-tier limits. The reason to build this instead of using one of them isn't cost, it's that a resellable template shouldn't force every future buyer to create an account with a third-party company just to receive form submissions, and this site's whole premise is bespoke, owned infrastructure, not stitched-together SaaS.

The actual mechanism: a single Next.js API route (`/api/contact`) that receives the form's POST request server-side and sends the submission by SMTP, using an email account Haley (or Damian, for the demo) already controls, via the `nodemailer` package. This requires the site to run on a platform that supports serverless functions rather than a pure static export, Vercel supports this natively with no configuration change beyond removing `output: 'export'` from `next.config.js` for this one route; every other page on the site remains statically generated. The SMTP credentials (host, port, username, password or app password) are stored as environment variables in Vercel's project settings, never committed to the repository and never shipped to the client bundle, since this code only runs server-side inside the API route.

For the demo phase, use a throwaway or personal email account's SMTP credentials rather than Haley's real inbox. Once Haley accepts the pitch, point the same route at dan@haleycustomhomes.com's real SMTP credentials (or whatever address Haley wants inquiries delivered to).

## SEO carryover

Meta titles and descriptions per page should carry forward the core claims Haley's existing site already ranks for (Denver custom home builder, luxury remodels, Boulder and Aspen service area) rather than being rewritten from nothing. If migrating from the live site's existing URL structure, keep the slug pattern above stable so existing backlinks and citations don't break.

## Numbers that must not be invented

Two figures are placeholders everywhere they appear across these documents and must be confirmed with Haley, or from Damian's own verified knowledge of the business, before launch:

1. The typical-industry-build-duration versus Haley's-actual-duration figures used in the Process page's comparison device.
2. The current real number of available build slots, used in the closing CTA's scarcity indicator.

Do not launch with either invented. Both are flagged again, inline, wherever they appear in the other documents.

## Build order for Claude Code

1. Scaffold the Next.js project, Tailwind config matching the Design System tokens exactly, `next/font` typefaces, and the `content/` file structure above, populated with real content from the Final Copy document and the extracted media asset library.
2. Build the shared layout: nav (desktop and mobile overlay), footer, the page-transition wrapper, the skip-to-content link, and focus-ring styling.
3. Build the Home page, section by section, in the order specified in the Home Page Spec document.
4. Build Portfolio (grid, filter, empty state) and the project detail page template.
5. Build Process, About, and Contact, in that order, per the Remaining Pages document.
6. Build the 404 page and the cookie consent notice.
7. Build the `/api/contact` route and wire the contact form to it, using the SMTP setup described above.
8. Pass over every page for `prefers-reduced-motion` and `(hover: hover)` fallbacks, keyboard navigation, and focus states, per the Design System's accessibility section. This is a required build step, not optional polish.
9. Deploy to Vercel for the live demo. Every route except `/api/contact` is still statically generated, this one small exception doesn't change the site's overall static-first architecture.
