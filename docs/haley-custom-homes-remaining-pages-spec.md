# Haley Custom Homes: Portfolio, Process, About, Contact, 404 Page Specs

Same method as the Home page spec. Every section names the fact it needs to communicate and the exact device that expresses it. Uses the Design System document, doesn't redefine it. Independent rewrite of the prior version.

---

## PORTFOLIO PAGE

### Filter and Grid

- Fact: the work splits into two real categories (New Builds, Remodels), and visitors browsing usually care about one or the other, not both blended.
- Device: two tabs, "New Builds" and "Remodels," label type scale, tracked uppercase, left-aligned above the grid, 96px below the nav. Active tab has a thin 2px accent-color underline that physically slides to the new position on click (shared layout animation, 300ms, shared easing curve), not a jump-cut. The grid below re-filters instantly; newly visible tiles play the standard scroll-reveal.
- Grid pattern: same asymmetric module as Home's Featured Portfolio (one large tile at 8 columns paired with one tall tile at 4 columns, then a row of three even 4-column tiles), repeating as needed.
- Each tile: the shared image hover treatment (scale 1.04, dark overlay, caption slide-up showing project name and location).
- Clicking a tile routes to its detail page.
- Empty state: if the selected category has zero projects, the grid area is replaced with a single centered line of body-scale text reading "No projects in this category yet." No illustration, no icon, per the Design System's Empty states section.

### Project Detail Page (`/portfolio/[slug]`)

**Project Hero**
- Fact: this specific project deserves the same weight as the homepage hero, it's the thing actually being sold.
- Device: full-bleed image or short video loop specific to this project, minimum 80vh height, project name and location overlaid bottom-left in hero type scale, matching the Home hero's text placement for consistency.

**Photo Gallery**
- Fact: quality of craft is best proven by seeing enough of the actual work, not a handful of thumbnails.
- Device: stacked full-width images, each at full viewport width, 64px vertical gap between them, no thumbnail strip grid. Each image gets the standard scroll-reveal on entry. This is the site's one deliberate long, unhurried single-column scroll, appropriate here because looking closely at a finished project is the entire point of this page.
- Clicking any image opens the lightbox specified in the Design System's Galleries section: full-screen, dark background, arrow-key or edge-tap navigation between that project's images, closes back to the same scroll position.

**Stats and Description**
- Fact: buyers evaluating a $4M-plus decision want concrete specifics, not just adjectives.
- Device: a small stats row (location, square footage, build duration, completion year) in label type scale, tracked uppercase, evenly spaced. Below it, a 2 to 3 sentence description in body type scale, max-width 600px. No bullet list, a short paragraph reads more considered than a spec sheet here.

---

## PROCESS PAGE

### Intro

- Fact: this page exists to prove the Accelerated Precision Building System is real, not marketing language.
- Device: none beyond restrained type. Eyebrow label, section headline, one supporting sentence, same treatment as Home's positioning statement, solid base background, no image.

### The Sequencing Ledger

- Replaced: the Comparison Slider hook is gone. Directly beneath the intro, under the heading "See the Difference" (no supporting line), sits the full-size Sequencing Ledger, as specified in haley-custom-homes-sequencing-ledger-spec.md, before the six-phase breakdown.
- The ledger does not replace the six-phase breakdown below it. The ledger answers "what specific failure does Haley's sequencing avoid, phase by phase." The six-phase sequence answers "what actually happens, in order, with photos." Keep both.

### Signature Process Feature: the Six-Phase Sequence

- Fact: the process has distinct, real phases, and a visitor who wants proof should be able to move through them in sequence, not read a paragraph asserting they exist.
- Device: a vertical stacked sequence of six phase blocks (Design and Spec Lock, Pre-Construction Sequencing, Framing, Trade Sequencing, Finish Work, Move-In), placed below the Sequencing Ledger above. Each block uses the asymmetric 7/5 column split, alternating sides down the page (block one: image left, text right; block two: text left, image right, and so on), creating visual rhythm without a second interactive mechanism.
- A thin vertical progress rail runs down the left margin of this section, per the Design System's Process Page Progress Rail spec, its fill height tied to actual scroll position through the section. Small circular markers sit on the rail at each phase's position, filling in accent color once the visitor scrolls past that phase.
- Between each phase block, the single blueprint-line motif specified in the Design System's Shapes decision appears as a quiet divider, the one place on the site this device is used.
- The final block (Move-In) includes the real supporting detail: the client who moved in a month ahead of schedule.

### Concierge Section

- Fact: clients get ongoing personal support, a relationship claim, not a process claim.
- Device: none needed beyond the standard two-column asymmetric layout (a real photo on one side, description text on the other), consistent with the rest of the site. A relationship claim is best supported by a real photo of the actual person providing it and plain, direct text, not an interactive element.

### CTA

- Identical treatment to Home's closing CTA.

---

## ABOUT PAGE

### Founder Intro

- Fact: Dan Haley Fuller is a real, specific person with a real, long track record, a trust signal for a high-cost purchase.
- Device: a large real environmental photo of Dan Fuller (not a studio headshot if a better option exists in the extracted assets), paired with the founding story written as one flowing narrative paragraph, not a bulleted timeline. A timeline reads as corporate; a paragraph reads as someone telling you the truth about their history.

### Philosophy Statement

- Fact: the volume-limiting philosophy again, but this page can go one layer deeper into why, not just that it's true.
- Device: the same large serif statement treatment as Home's positioning statement, paired with a full-bleed background image this time (a quiet materials or craftsmanship detail shot, low visual noise, text remains fully legible over it) rather than a solid color background, so this page's version reads as related to Home's but not identical to it.

### Awards (expanded)

- Fact: this is the deeper credibility page, so each award deserves more than a logo mark.
- Device: a vertical stacked list, each award as its own row: logo mark, award name, and one short line of context (what it recognizes, when it was awarded), rather than the single quiet row used on Home. Still no icons beyond the real award marks themselves.

### CTA

- Identical treatment to Home's closing CTA.

---

## CONTACT PAGE

### Qualification Form

- Fact: not every visitor is a qualified lead at this price point, the form itself should filter rather than just collect.
- Device, fully specified, no ambiguity left:
  - Fields in order: Name (text, required), Email (email, required), Phone (tel, required), Project Type (dropdown: "New Custom Home" / "Remodel," required), Budget Range (dropdown: "Under $600k" / "$600k to $1M" / "$1M to $4M" / "$4M+," required), Location or Neighborhood (text, optional), Message (textarea, optional).
  - Field style: label above each field in label type scale, input fields with a 1px ink-at-20%-opacity bottom border only, no full box border, transparent background, ink text. On focus, border color transitions to full accent color, 200ms, shared easing curve.
  - Submit button: primary button style, full width on mobile, auto width on desktop, label "Send Inquiry."
  - On submit: the button shows a brief loading state (label changes to "Sending," button becomes non-interactive) until the site's own `/api/contact` route responds, then the entire form is replaced with a confirmation message in section headline type scale, no page redirect.
  - Validation: required fields show a small ink-colored message beneath them if left empty on submit attempt, no red error colors, red would break the established color system for something as minor as a missed field.

### Service Area and Contact Info

- Fact: visitors need to know where Haley builds and how to reach them directly, plainly, without a generic embedded map breaking the site's visual consistency.
- Device: a clean typographic list, right column opposite the form, label type scale, one line per area (Denver, Boulder, Cherry Hills Village, Greenwood Village, Centennial, Aspen, Vail). Below the list, phone and email as understated links in body type scale, accent color, no icons.
- Above the list, the custom line-art service-area map per the Design System's Service Area Map section, small and quiet, a static single-stroke outline with dots marking each real area, giving the coverage a geographic presence the list alone doesn't.
- Motion: each city name enters with a staggered scroll reveal (40ms delay per line, same translateY and opacity values as the standard section reveal), rather than the continuous marquee used on Home. A marquee implies an ongoing, unbounded stream, appropriate for a rotating set of testimonials or press marks, but this is a short, finite, fixed list a visitor needs to actually read and reference, so a one-time staggered entrance is the honest device here, not motion for its own sake.

### Common Questions (Accordion)

- Fact: a serious visitor at this price point has real, predictable questions before committing to filling out the form above, answering them up front qualifies and reassures rather than making them ask.
- Placement: full width, below the form and service area columns, single column, content max-width 600px, centered.
- Device: the FAQ Accordion specified in the Design System's document, five real questions (minimum project size, typical build duration, remodels versus new builds, service area, how the Accelerated Precision Building System actually saves time), one open at a time, plus-to-X rotation on the functional expand mark.
- Section eyebrow above it: "COMMON QUESTIONS," label type scale, matching the eyebrow treatment used across the site.

### Footer

- Identical to the Home page footer.

---

## 404 PAGE (`/not-found`)

- Fact: a mistyped or dead link needs to land somewhere that still feels like Haley, not a bare server error, and needs to route the visitor back into the site rather than dead-ending them.
- Device: the same nav and footer as every other page, for continuity. Content centered vertically and horizontally in the space between them. Eyebrow label ("PAGE NOT FOUND") in label type scale, then a single section-headline-scale line in the site's plain, direct voice, stating the page doesn't exist. Below it, two buttons side by side: primary "Back to Home," ghost "View Our Work" linking to /portfolio.
- No illustration, no broken-image graphic, no icon, consistent with the rest of the site's restraint.

---

## COOKIE CONSENT NOTICE (site-wide, not a page)

- Fact: the site uses basic analytics, a real compliance requirement, not a design option to skip.
- Device: per the Design System's Cookie consent section, a minimal bottom bar, ink background, base-background-colored text, fixed to the viewport bottom, appears once per visitor and dismisses permanently on click. One sentence of copy, one ghost-style button reading "Got It." No preference center, no second button, unless Haley's actual tracking setup requires more, confirm before launch.
