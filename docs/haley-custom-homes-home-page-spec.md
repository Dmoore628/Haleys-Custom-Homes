# Haley Custom Homes: Home Page Spec

Every section below is literal. Layout, exact composition, and interaction behavior are all decided. Uses values from the Design System document, doesn't redefine them. This is an independent rewrite of the prior version, re-derived section by section rather than carried forward.

## Nav

As specified in the Build Spec and Component/Interaction Spec documents. No change here.

## Hero (asset complete, composition specified here)

- Full viewport height (100vh), video background, muted, autoplay, loop, no controls.
- Dark overlay over the video at 20% black, constant, needed for text legibility, not a hover effect.
- Content positioned bottom-left, 64px padding from the bottom and left edges on desktop, 24px on mobile.
- Small eyebrow label above the headline: "DENVER METRO. BOULDER. ASPEN. VAIL." (label type scale, tracked uppercase, base-background color over the dark overlay).
- Headline below, hero type scale, base-background color, maximum 2 lines.
- Two buttons side by side below the headline, 16px gap: primary "View the Process," ghost "See Our Work."
- No scroll-reveal animation on the hero itself, it's visible immediately on page load as the first thing seen.
- A small scroll-indicator mark (a thin vertical line, 24px tall, base-background color at 60% opacity) centered at the bottom of the viewport, fades out once the visitor scrolls past 10% of viewport height.

## Positioning Statement

- Full width section, solid base background, no image.
- Vertical padding per the Design System's section spacing rule.
- Content block: max-width 640px, left-aligned (not centered), positioned starting at column 2 of the 12-column grid, so it reads as a deliberate block rather than a dead-centered slab of text.
- Main line: section headline type scale, ink color, using the Signature Text Treatment (word-by-word reveal) specified in the Design System document. Exact copy is in the Final Copy document.
- Supporting line 32px below the main line: body paragraph type scale, referencing the founding year and continuous ownership, standard scroll reveal (not the word-by-word treatment, that's reserved for the main line only).
- No image, no icon, no interactive element. This section's device is restraint itself, a confident claim stated plainly.

## Process Highlight (the section's bespoke device)

- Two-column layout, asymmetric: left column spans 7 of 12 grid columns (the interactive element), right column spans 4 of 12 columns offset by 1 (supporting text), desktop only, stacks to a single column on mobile with the interactive element first.
- Small eyebrow label above the section: "THE ACCELERATED PRECISION BUILDING SYSTEM," label type scale.
- Right column text: 2 to 3 short sentences explaining the process is a real, named methodology (LEAN-based sequencing), not a marketing phrase. A single ghost button below reading "Learn the Process," linking to /process.
- Left column, the device: the Sequencing Ledger, all six rows, as specified in haley-custom-homes-sequencing-ledger-spec.md (the compact Home version). No separate proof line below it: the ledger's Move-In row carries the month-ahead-of-schedule fact.

## Featured Portfolio

- Section eyebrow: "SELECTED WORK," label type scale, followed by a section headline.
- Grid, a defined pattern, not left to vary randomly: Row 1 is one large tile (8 of 12 columns, tall aspect ratio) beside one tile (4 of 12 columns, same height as the large tile). Row 2 is three even tiles (4 columns each, standard aspect ratio). This two-row pattern repeats if more projects are added beyond an initial 5.
- Each tile uses the shared image hover treatment from the Design System document (scale to 1.04, dark overlay fade-in, caption slide-up on hover), caption shows project name and location only.
- Below the grid, a single ghost button, centered: "View Full Portfolio," linking to /portfolio.

## Testimonials

- A continuous right-to-left marquee strip, per the Design System's Marquee component, not a manual one-at-a-time carousel. Real, repeating client trust reads as an ongoing stream rather than a single item the visitor has to click through.
- Each testimonial renders as a card: fixed width `clamp(320px, 30vw, 440px)`, generous internal padding using the section padding scale, base-background color at a very slightly darker tint than the page background so the card reads as a distinct object without a border or shadow.
- Inside each card: the quote text at a smaller size than a page-dominating pull quote would use (`clamp(1rem, 1.5vw, 1.25rem)`, body typeface, not the display serif, since this is a compact card), then a 16px gap, then client name and project type in label type scale.
- The three real testimonials loop continuously, duplicated once for a seamless loop per the Design System spec. Hovering or focusing any single card pauses the entire strip so a visitor can actually read it.
- Section eyebrow above the strip: "IN THEIR WORDS," label type scale, left-aligned, matching the eyebrow treatment used elsewhere on the page.

## Awards

- Full width, solid base background, reduced vertical padding relative to other sections (`clamp(3rem, 6vw, 6rem)`), since this section is intentionally the quietest on the page.
- A slow, continuous left-to-right marquee strip of the award and credential marks (Houzz, Luxury Lifestyle Awards, Energy Star, LUXE Interiors + Design), per the Design System's Marquee component, rather than a static row. Quiet, constant motion here reads as a settled, ongoing credential rather than a static, dead list.
- Marks are evenly spaced within the loop, equal height (32px each), grayscale or muted so no single mark's color competes with the accent color used elsewhere.
- One caption line below the strip, centered, label type scale: naming the recognitions.
- The marks are not links. Hovering pauses the strip (per the marquee spec) but produces no other visual change on the marks themselves.

## Closing CTA

- Full-bleed background image, a strong completed-project exterior shot, twilight preferred if available, full viewport width, minimum 70vh height.
- Dark overlay, 30% black, for text legibility, slightly stronger than the hero's overlay since there's no video motion here to help separate text from background.
- Content centered both horizontally and vertically within the section.
- Small scarcity tag above the headline: the site's one badge component (1px accent border, transparent fill, accent text), reading the current real build-slot availability, confirm the actual number with Haley before launch.
- Headline below: section headline type scale, base-background color, centered, maximum 2 lines.
- Single primary button below: "Start the Conversation," linking to /contact.

## Footer

- Solid ink background, base-background-colored text, full width.
- Vertical padding: 96px top, 48px bottom.
- Three-column layout desktop, stacks to single column mobile: Column 1: logo plus one-line tagline. Column 2: page links (Home, Portfolio, Process, About, Contact), stacked vertically, label type scale. Column 3: contact info (phone, email) and service area list, stacked vertically, label type scale.
- Bottom bar below the three columns, separated by a 1px light-at-10%-opacity line: copyright line, left-aligned, small label type scale.
- No social icons unless Haley confirms active, maintained social accounts to link. An icon linking to a stale or unused account undercuts credibility rather than adding it.
