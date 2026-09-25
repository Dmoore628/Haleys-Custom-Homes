# Haley Custom Homes: Consolidated Fixes Spec (Final)

This is the second of two documents, alongside the Sequencing Ledger document. This document is self-contained and supersedes every earlier version of the Fixes document. Every numbered item ends with an Acceptance line, a plain yes-or-no test. If Claude Code cannot answer yes to every Acceptance line for an item, that item is not done. Nothing below requires a design decision, every open question from earlier drafts of this project has been resolved into a specific, final instruction.

---

## PART 1: Carried-forward fixes

**1. Typography.** Replace Fraunces and Inter, sitewide, with Bodoni Moda (display and headline type, self-hosted via `next/font/google`) paired with Switzer (body and UI type, self-hosted via `next/font/local`). Italic Bodoni Moda is the signature accent for testimonial quotes, Process-page pull-quotes, and the Early Move-In Marker's quote.

**Acceptance:** Yes if no page loads Fraunces or Inter from any source, and every headline renders in Bodoni Moda while every body paragraph renders in Switzer. No if either old typeface still loads anywhere.

**2. Sticky-Pinned Cover Transition.** `position: sticky; top: 0` on the upper section, with the following section in normal flow at a higher z-index and an opaque background, so it slides up and covers the pinned section as the visitor scrolls. Applies at: Home hero to Positioning Statement, Home Closing CTA to Footer, Portfolio project hero to gallery, and About Founder Intro to Philosophy Statement (this last one is new in this document, see Part 2, item 8). Reduced-motion fallback: ordinary flow scrolling, no sticky positioning.

**Acceptance:** Yes if, at each of these four listed section boundaries, scrolling down visibly covers the upper section with the lower one sliding up over it, and this behavior disables under `prefers-reduced-motion: reduce`. No if any listed boundary uses ordinary scrolling instead, or if any boundary not listed here also uses this transition.

**3. Positioning Statement empty space.** The empty area beside the "We build three to five homes a year" text block on Home is filled by an oversized typographic opening quotation mark, Bodoni Moda italic, `clamp(12rem, 20vw, 24rem)`, ink at 6 to 8 percent opacity, static, no motion.

**Acceptance:** Yes if this quotation mark renders in that space at that size and opacity range. No if the space is empty, or if an image or icon fills it instead.

**4. Testimonial cards.** `height: auto`, row uses `align-items: flex-start`. Cards are never stretched to a forced uniform height.

**Acceptance:** Yes if testimonial cards of different quote lengths visibly render at different heights within the same row. No if all cards in a row are the same height regardless of quote length.

**5. Awards marquee.** Full color, not grayscale. Jumbo mark height `clamp(48px, 6vw, 96px)`. Vertically centered within its section. DOM duplicated enough to fill the widest expected viewport before the animation starts.

**Acceptance:** Yes if the award marks display in their original colors, at the specified size range, vertically centered in their section, and the strip is already full width on first paint with no visible empty gap that fills in as the visitor scrolls to it. No if the marks are grayscale, undersized, bottom-anchored, or the strip visibly starts half-empty.

**6. Closing CTA scarcity badge.** Copy is exactly "Now accepting a limited number of new projects."

**Acceptance:** Yes if this exact text appears in the badge. No if any bracketed placeholder or different wording appears there.

**7. Footer contact info.** Phone 303-601-9446 and email dan@haleycustomhomes.com.

**Acceptance:** Yes if both appear exactly as written, as live tel: and mailto: links. No if either is missing, different, or not a live link.

---

## PART 2: Page-specific fixes

**8. Mobile hero video.** Below the `md` breakpoint, cap the hero container height at `min(100vh, 720px)`. The video element uses `object-fit: cover`. If a portrait or square crop of the hero footage exists in the asset library, use it below `md` via a `<source media="...">` swap. If only the landscape source exists, set `object-position: 50% 30%` specifically at mobile widths, biasing the crop toward the upper two-thirds of frame rather than dead center.

**Acceptance:** Yes if, at a phone-width viewport, the hero video fills its container without visible letterboxing or an obviously wrong crop (a crop that cuts off the main subject at head height, for instance), and the container height does not exceed 720px. No if the mobile hero video shows the same crop and framing as desktop at a visibly wrong scale, or the container exceeds 720px tall.

**9. Portfolio, real project data.** Populate `content/projects.json` with these six real, confirmed project titles and locations: 36 Cherry Creek Historical Remodel (Denver, category Remodel), 5 Modern Farm House in Cherry Hills (Englewood, CO, category New Build), 5 Denver Modern (Englewood, CO, category New Build), Cherry Hills Transitional (Cherry Hills Village, CO, category New Build), Cherry Hills Traditional (Denver, category New Build), Modern (Denver, CO, category New Build). Square footage, build duration, and completion year are not published anywhere public. Where a project's asset folder does not include a confirmed value for one of these three stats, that stat is simply omitted from that project's stats row, it is not replaced with a placeholder, a dash, or an invented figure.

**Acceptance:** Yes if every project shown on the Portfolio page and its detail pages uses one of these six real titles, and every stats row shows only stats that have a real, sourced value behind them, with no bracketed text, dash-as-placeholder, or invented number anywhere. No if any project title, location, or stat is invented, or if any placeholder bracket remains visible.

**10. Portfolio, remodels category.** 36 Cherry Creek Historical Remodel is categorized as a Remodel. If a project matching the Country Club remodel described in the Gendron testimonial exists in the asset library under any title, add it as a second Remodel entry. If, after checking, only one confirmed remodel has usable photography, the Remodels tab shows that one real project. It is never populated with an invented project to avoid looking sparse.

**Acceptance:** Yes if the Remodels tab shows at least one real project (36 Cherry Creek Historical Remodel at minimum) and contains zero invented projects. No if the Remodels tab is empty, or if it contains any project not confirmed real.

**11. Portfolio, image quality.** Every image renders through `next/image` with `quality={85}` or higher and correct `sizes` attributes. Any source image confirmed visibly grainy at full quality is used only at portfolio-tile or gallery scale, never as a full-bleed project hero image.

**Acceptance:** Yes if no image is served at a quality setting below 85, and no confirmed-grainy image is used at hero scale (minimum 80vh height). No if any hero image is visibly lower quality than the tile images around it, or if any image is compressed below quality 85.

**12. Process page, Signature Motion Accent.** In the Intro section, opposite the intro text on desktop, add a single-stroke line-art rendering of a carpenter's framing square, `clamp(8rem, 14vw, 16rem)`, ink at 8 to 10 percent opacity, static at rest. On scroll into view, once only: a single accent-colored tick mark travels along the square's long edge from the corner to the edge's end, 700ms, shared easing curve, then holds still, and never replays.

**Acceptance:** Yes if this mark is visible opposite the intro text on desktop, is static until scrolled into view, animates the tick-mark travel exactly once, and does not replay on repeated scrolling. No if the mark is missing, animates more than once, or is a generic icon rather than a framing-square line drawing.

**13. About page, founder photo layout.** Desktop layout uses the asymmetric 7/5 column pattern (matching the Process page's alternating phase blocks): photo at 5 columns, positioned right, offset 48px down from the top of the row relative to the text block. Text block at 7 columns, left. Mobile layout is unchanged.

**Acceptance:** Yes if, on desktop, the photo sits on the right at 5 of 12 columns with a 48px downward offset relative to the text block. No if the photo remains in its original left-aligned placement, or if mobile layout has changed.

**14. About page, Signature Motion Accent.** Near the Philosophy Statement section, add a single-stroke line-art rendering of a plumb bob, same size and opacity band as the Process page's framing square (item 12). At rest it hangs slightly off true vertical. On scroll into view, once only: it rotates and settles to a perfectly vertical line over 900ms with a slight overshoot before settling, shared easing curve, then holds still.

**Acceptance:** Yes if this mark is visible near the Philosophy Statement section, starts visibly off-vertical, animates a settle-to-vertical motion exactly once on scroll into view, and does not replay. No if the mark is missing, starts already vertical with no motion, or replays on repeated scrolling.

**15. About page, sticky-pinned cover transition.** Applies once, at the Founder Intro to Philosophy Statement boundary only. Philosophy Statement to Awards, and Awards to CTA, use the site's ordinary scroll-reveal instead, not this transition.

**Acceptance:** Yes if the Founder Intro to Philosophy Statement boundary uses the sticky-cover slide-up behavior, and the two boundaries after it use ordinary scroll-reveal with no sticky positioning. No if the sticky-cover transition is applied at more than one boundary on this page, or at zero boundaries.

**16. Contact page, custom map.** Replace the existing static line-art map with a Mapbox GL JS map, custom-styled using the site's exact color tokens (bone base, ink for land and water contrast, accent-colored markers), centered on the real office address, 5211 S Quebec Street, Greenwood Village, CO 80111. Each service-area city (Denver, Boulder, Cherry Hills Village, Greenwood Village, Centennial, Aspen, Vail) is a custom accent-colored marker, not a default pin. On page load, the map's outline style draws in once using the same stroke-dasharray reveal technique used elsewhere on the site. Hovering or focusing a city name in the adjacent typographic list triggers a smooth camera fly-to on the map toward that city's marker, and that list row highlights in accent color at the same time. No default Mapbox or Google UI chrome (zoom controls, default pins, default popup style) is visible; the one exception is the small map-provider attribution mark in a corner, which is a legal requirement of the tile provider and stays.

**Acceptance:** Yes if the map is a real, interactive Mapbox map centered on the real address, styled in the site's own colors with custom markers, and hovering a city name in the list visibly moves the map's camera to that city while highlighting the list row. No if the map is the old static line-art version, a raw Google Maps embed with default chrome, or if hovering a city name produces no map response.

**17. Contact page, FAQ, ten questions, exact text.** The accordion contains exactly these ten questions and answers, in this order, with no bracketed placeholder anywhere:

1. "What's the minimum project size?" Answer: "New builds start at $4 million, with a minimum of 5,000 square feet. Remodels typically start around $600,000."
2. "How long does a typical build take?" Answer: uses the two-number framing already established in the Content Answers document (12-month national industry average for the comparison context, Haley's own average not publicly stated, framed honestly per that document, this question's exact wording is unchanged from the existing spec).
3. "Do you take on remodels as well as new builds?" Answer: "Yes. We take on both new construction and remodels, each with its own starting price point."
4. "What areas do you build in?" Answer: the reconciled service area list, Denver, Boulder, Cherry Hills Village, Greenwood Village, Centennial, Aspen, Vail.
5. "How does the Accelerated Precision Building System actually save time?" Answer: "It sequences trades and materials in a fixed order, based on LEAN construction principles, so no crew is left waiting on a delivery or a decision that should have already happened."
6. "Do you provide design and architectural services, or do I need my own architect?" Answer: "We're happy to refer an architect or designer to you based on your desired home style and neighborhood, and we regularly collaborate with clients who arrive with their own architect and finished drawings already in hand."
7. "Do I need to already own the lot, or can Haley help me find one?" Answer: "Most clients come to us with a lot already in mind. If you haven't settled on one yet, we're glad to weigh in on how a specific site suits the home you're picturing."
8. "What does the payment schedule look like?" Answer: "Payments follow a structured draw schedule tied to real construction milestones, not a flat retainer. The exact schedule is laid out and agreed on before the first shovel moves."
9. "Is there a warranty after move-in?" Answer: "Warranty coverage is detailed in your contract, so you know exactly what's covered, and for how long, before you sign."
10. "How far ahead of a desired groundbreaking date should I reach out?" Answer: "The earlier you bring us in, the more we can help value-engineer the plans before construction starts, often saving real money in the budget. There's no such thing as reaching out too early."

**Acceptance:** Yes if all ten questions and answers appear verbatim, in this order, with zero bracketed placeholders in the accordion. No if any question is missing, reworded, reordered, or if any placeholder bracket remains.

---

## PART 3: Sitewide additions

**18. Signature Motion Accents, the rule.** Update the Component/Interaction Spec's guardrail, "No decorative icon illustration anywhere," to read: "No decorative icon illustration anywhere, except the site's own Signature Motion Accents, a fixed set of exactly three custom line-art marks tied to real objects in the building trade (the Home Positioning Statement's quotation mark, the Process page's framing square, and the About page's plumb bob), each used exactly once, per the Sequencing Ledger and Fixes documents." No fourth mark is added anywhere without updating this rule first.

**Acceptance:** Yes if exactly three Signature Motion Accents exist across the whole site, one per page as listed, and the guardrail text in the Component/Interaction Spec has been updated to this exact exception. No if a fourth decorative mark appears anywhere, or if the guardrail text is unchanged from its original blanket form.

**19. Footer social icons.** Custom single-stroke line-art glyphs, drawn at the same stroke weight as the Signature Motion Accents, for these seven platforms, linking to these exact real URLs: Pinterest (`https://www.pinterest.com/haleycstmhomes/`), YouTube (`http://www.youtube.com/channel/UCCv8HSL4i52vp5CGe0tc-AQ`), Facebook (`https://www.facebook.com/HaleyCustomHomes/`), LinkedIn (`https://www.linkedin.com/company/haley-custom-homes`), Houzz (`https://www.houzz.com/pro/haleycustomhomes/haley-custom-homes`), X (`https://twitter.com/haleycustom`), Instagram (`https://www.instagram.com/haleycustomhomes/`). Ink color at rest, no platform brand colors, no rounded background chip behind any icon. On hover, the glyph itself transitions from ink to accent color, 200ms ease.

**Acceptance:** Yes if all seven icons appear as custom line-art glyphs (not brand-standard colored logos), each linking to the exact URL listed, with no background chip, and each transitions to accent color on hover. No if any icon uses its platform's brand color, sits inside a background shape, links to the wrong URL, or is missing.

**20. Footer ICAA credit.** A small text link, not an icon or badge, styled identically to the copyright line beneath it, reading exactly "In support of the Institute of Classical Architecture & Art, Rocky Mountain Chapter," linking to `https://www.classicist.org/membership-and-chapters/chapters/rocky-mountain/`, accent color, underline appearing on hover only.

**Acceptance:** Yes if this exact text appears as a plain text link with this exact URL, styled like the copyright line, with no icon or badge graphic attached to it. No if it appears as an icon, badge, or with different wording or a different URL.

**21. As Seen In line.** Directly beneath the Awards Marquee's existing caption line on Home, add a second, static (non-marquee, non-animated) line of label type scale text reading exactly "As Seen In: Modern In Denver, Colorado Homes & Lifestyles." No logos, no marquee motion, this line does not scroll or animate.

**Acceptance:** Yes if this exact static text line appears beneath the Awards Marquee caption with no motion applied to it. No if it is missing, animated, or uses different publication names or wording.

**22. Contact form, added field.** Add one new optional dropdown field, positioned after Location or Neighborhood and before Message: "Do you have a lot or site selected?" with options "Yes" / "Not yet" / "Still deciding." This field is optional, matching the existing optional fields' styling and required-field behavior (none, since it's optional).

**Acceptance:** Yes if this exact field, with these exact three options, appears in this position in the form and submission succeeds whether or not it's filled in. No if the field is missing, has different option text, is marked required, or is positioned elsewhere.

**23. Portfolio tile hover.** In addition to the existing image hover treatment (scale to 1.04, dark overlay, caption slide-up), add a subtle tilt: the tile rotates up to 4 degrees on each axis based on cursor position within the tile, using a CSS 3D transform, returning to flat on mouse leave, 200ms ease. This applies only to Portfolio grid tiles and the Featured Portfolio tiles on Home, never to testimonial cards or FAQ accordion rows.

**Acceptance:** Yes if hovering a portfolio tile at different cursor positions produces a visibly different tilt angle that returns to flat on mouse leave, and no other card type on the site has this tilt effect applied. No if tiles show no tilt, if the tilt is a fixed angle regardless of cursor position, or if the effect appears on testimonial or FAQ elements.

**24. Magnetic primary buttons.** The "Start the Conversation" and "Send Inquiry" primary buttons specifically (no other buttons) shift their label a few pixels toward the cursor as the cursor approaches within roughly 40px of the button's edge, releasing back to center when the cursor moves away or the button is clicked.

**Acceptance:** Yes if only these two named buttons exhibit this magnetic pull, and every other button (including ghost buttons and nav links) does not. No if the effect is missing from either named button, or if it appears on any other button.

**25. Scroll-progress indicator.** A 2px accent-colored line fixed to the very top of the viewport, filling left to right in proportion to how far down the current page the visitor has scrolled. Present on every page.

**Acceptance:** Yes if this line is visible at the top of the viewport on every page and its fill width visibly tracks scroll position from 0 to 100 percent. No if the line is missing on any page or does not track scroll position.

**26. Custom text-selection color and OG image.** Text selection anywhere on the site highlights in the accent color, not the browser default blue. Each page has a designed Open Graph share image (not a generic screenshot or the framework default) set in its metadata.

**Acceptance:** Yes if selecting text on any page highlights in accent color, and inspecting each page's metadata shows a real, designed `og:image` set. No if text selection shows the default browser blue, or if any page is missing a designed Open Graph image.

---

## PART 4: Consistency check

**27. Removal of superseded devices.** No reference to "Comparison Slider," "Zero-Gap Schedule," the old flat caption line under the ledger, or the old static line-art-only map remains anywhere in the Design System, Home Page Spec, Remaining Pages Spec, Component/Interaction Spec, or Final Copy documents.

**Acceptance:** Yes if a text search for each of those four terms or phrases across the whole codebase and content files returns zero results outside of this document and the Sequencing Ledger document. No if any of the four still appears elsewhere.
