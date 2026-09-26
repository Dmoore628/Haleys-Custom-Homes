# Haley Custom Homes: Design System

Foundational layer. Every page and component spec pulls from this file. Nothing below is optional or a suggestion, these are literal build values. This is a full independent rewrite, re-derived from first principles rather than carried forward from the prior pass. Several exact values differ from before; the underlying method (the bespoke test: would this element survive unchanged if you swapped in a different company's name and facts) is the same because it's the right method, not because the answer was assumed in advance.

## Color

- Base background: `#EFE9DE` (warm greige, not pure white and not the previous pass's exact bone tone). Pure white reads clinical at this price point; a warm, slightly darker neutral reads architectural and paper-like instead.
- Primary text and ink: `#1A1815` (near-black, not pure black). Pure black against a warm background creates more contrast than the site needs and reads harsher than the rest of the palette.
- Accent: `#7A6250` (muted warm taupe-bronze). This remains a placeholder pending Haley's real logo and brand colors, swap it once those assets are confirmed, but it must stay a single muted warm neutral, never a bright or saturated color, regardless of what the real brand color turns out to be. If Haley's real brand color is bright or saturated, mute it down before using it here rather than importing it as-is.
- Accent use rule: thin lines, hover-state borders, the one badge component, small functional marks. Never a background fill larger than a button, never a gradient.
- Overlay black (image darkening under text, hero video legibility): `#000000`, used only between 0% and 30% opacity depending on the section, never solid.

## Type

- Display and headline typeface: Newsreader (Production Type, SIL Open Font License), self-hosted via `next/font/google`, using its optical-size axis. It replaced Bodoni Moda, whose hairline strokes were too hard to read; Newsreader's moderate contrast keeps the editorial character while staying legible from hero scale down to card text. Weight 400 throughout. Italic Newsreader is the signature accent for testimonial quotes, pull-quotes, and the Early Move-In Marker's quote. Serif settings use a slight negative tracking (-0.012em) with kerning on.
- Body and UI typeface: Switzer (Indian Type Foundry, via Fontshare), self-hosted via `next/font/local`. Used for paragraph text, form fields, navigation, labels, and captions.
- Never more than two typefaces on the site. No third font is introduced for a single section, however small.
- Scale (desktop; use CSS `clamp()` for fluid scaling down to mobile rather than fixed breakpoint swaps):
  - Hero headline: `clamp(2.75rem, 6.5vw, 6rem)`, line-height 1.05
  - Section headline: `clamp(1.875rem, 4vw, 3.25rem)`, line-height 1.12
  - Pull quote or statement text: `clamp(1.5rem, 2.75vw, 2.125rem)`, line-height 1.35
  - Body paragraph: `1.125rem`, line-height 1.65
  - Small label or eyebrow (above headlines, in nav, in captions): `0.75rem`, uppercase, `letter-spacing: 0.1em`

## Spacing (fluid, not fixed breakpoints)

- Base unit: 8px. All spacing values are multiples of this.
- Section vertical padding (top and bottom): `clamp(4rem, 9vw, 9rem)`. A single fluid value replaces separate desktop and mobile numbers, scaling continuously with viewport width so the site never looks cramped or bloated at an in-between screen size.
- Section horizontal padding (gutter between content and viewport edge): `clamp(1.5rem, 5vw, 4rem)`.
- Content max-width for text blocks: 600px, even inside a wider section, so paragraphs never stretch into hard-to-read long lines. Use `width: min(600px, 100% - <horizontal padding>)` so this never overflows on very narrow phones.
- Grid: 12 columns, gutter `clamp(1rem, 2vw, 2rem)` on desktop. Content should rarely fill all 12 columns symmetrically; prefer asymmetric splits (a 7/5 or 8/4 column split between image and text) over centered, equal-width blocks. A symmetric centered layout is the default a template produces; asymmetry reads as a deliberate choice.
- Below 768px, every asymmetric multi-column layout collapses to a single column, image first, text second, full width, no exceptions. Never preserve a 7/5 split at phone width, it always breaks down to illegibly narrow columns.
- Use `clamp()` for every spacing and sizing value in this system, not fixed pixel values swapped at two or three breakpoints. This is what makes the site fluid rather than a small number of fixed layouts jumping between states.

## Motion

- One easing curve used everywhere on the site, no exceptions: `cubic-bezier(0.16, 1, 0.3, 1)`, a fast-start, slow-settle curve. Reusing a single curve across every animation is what makes several different bespoke effects still feel like one coherent product instead of a pile of separate ideas borrowed from different places.
- Micro-interactions (button hover, small element hover): 150 to 300ms.
- Section-level reveals (content entering as it scrolls into view): 500 to 650ms, translateY 24px to 0, opacity 0 to 1, triggered once per element, never replays on scroll back up.
- Scroll-linked effects (anything tied directly to scroll position rather than a one-time trigger, like the process page progress rail): driven by actual scroll progress, not a timer, so it always feels responsive to the visitor's own input rather than autoplaying near them.
- Respect `prefers-reduced-motion`: every animation above has a reduced version (opacity-only, no movement, no scroll-linked transforms) for visitors with that setting enabled. This is an accessibility requirement, not optional polish.

## Buttons (exactly two variants site-wide, no others)

- Primary: solid ink fill, base-background-colored text. Hover: a lighter fill sweeps in from the left edge (`scaleX` transform, `transform-origin: left`, 300ms, the shared easing curve), not an instant color change.
- Ghost: 1px ink border, transparent fill, ink text. Hover: fills to 10% ink opacity, 200ms, shared easing curve.
- Corner radius: 3px, both variants. Never pill-shaped.
- Label style: the small label type spec above, uppercase, tracked out.
- No third button style is introduced anywhere on the site, including the contact form's submit button.

## Cards and image tiles (shared base, used in the Portfolio grid, Featured Portfolio, etc.)

- Image wrapper: `overflow: hidden`, no border, no drop shadow.
- Hover: image scales from 1.0 to 1.04, 600ms, shared easing curve. A dark overlay fades in to 15% opacity over the same duration. Caption text, if present, slides up 8px and fades in, starting 100ms after the scale begins.
- No rounded corners larger than 4px on any image tile. No card border. Separation between tiles comes from spacing, not visible borders or shadows.
- On touch devices (no hover capability), the caption and overlay are shown by default instead of on hover, using a `(hover: hover)` media query. Never ship a hover-only reveal of information a touch user has no way to trigger.

## Marquee, continuous-loop strip (used in Awards and Testimonials, see the page specs)

- A horizontal row of items scrolls continuously and linearly at constant speed, not scroll-linked. This one motion type is deliberately time-based rather than tied to scroll position, since its whole job is to suggest an ongoing, uninterrupted stream.
- Speed: roughly 45 to 60 seconds for one full loop of the content, slow enough that nothing rushes past the visitor, fast enough to read as alive rather than static.
- The content list is duplicated once immediately after itself in the DOM so the loop point is invisible, never a visible jump-cut restart.
- Pauses completely on hover or keyboard focus (`animation-play-state: paused`), so a visitor can stop and actually read or click something inside it.
- Direction: left-to-right for the awards strip, right-to-left for testimonials. This small variation keeps the two from feeling like the same component reused twice, without adding a third motion pattern to the system.
- Under `prefers-reduced-motion`, the marquee stops entirely and displays as a static wrapped row instead.
- The marquee is the site's only carousel-type mechanism; the "no more than one carousel or slider mechanism" rule below still applies.

## Signature Feature: the Sequencing Ledger

- The single signature bespoke feature is the Sequencing Ledger, fully specified in haley-custom-homes-sequencing-ledger-spec.md (visual form, checkmark and strikethrough motion, copy, placement on Home and Process, reduced-motion behavior).

## Process Page Progress Rail (a second, distinct device, not a duplicate of the Sequencing Ledger)

- Used only on the Process page, below the Sequencing Ledger, alongside the six-phase sequential breakdown of the Accelerated Precision Building System (Design and Spec Lock, Pre-Construction Sequencing, Framing, Trade Sequencing, Finish Work, Move-In). These are two different devices answering two different questions and both belong on the page: the Sequencing Ledger answers "what specific failure does Haley's sequencing avoid, phase by phase," stated near the top of the page. The progress rail answers "what actually happens, in order," a sequential explanation, and belongs further down the page where the visitor is reading through the six real phases in detail. Neither replaces the other; using both is not redundant because they visualize two different kinds of fact.
- A thin vertical rail runs down the left margin of the six-phase section (4px wide, ink-at-10%-opacity track, accent-color fill). The fill height ties directly to actual scroll position through the section, so it visibly grows as the visitor reads through the phases, an honest reflection of real reading progress, not a decorative animation running on its own.
- Small circular markers sit on the rail at each phase's position, filling to accent color once the visitor scrolls past that phase.
- Each phase block uses the asymmetric 7/5 column split, alternating sides down the page (block one: image left, text right; block two: text left, image right, and so on), which creates visual rhythm without needing a second interactive mechanism.
- The final block (Move-In) includes the real supporting detail: the client who moved in a month ahead of schedule.

## Page Load and Transition State

- Initial page load: no full-screen loading spinner or splash animation. The hero content (video, headline, buttons) fades in together, 400ms, shared easing curve, the instant the page is ready, rather than delaying the visitor behind a branded loading screen. A loading splash costs the visitor real time for no real benefit and is skipped entirely.
- Route changes: a 300ms opacity cross-fade, per the Component and Interaction Spec. No spinner, the transition itself is fast enough to read as instant.
- Image loading: every image gets a solid-color placeholder matching a muted tone sampled from that specific image, not a generic gray box, so the layout never jumps and the placeholder still feels intentional. `next/image` with a build-time blur placeholder handles this automatically.
- Form submission loading state: the submit button's label changes to "Sending" and the button becomes non-interactive. No separate spinner icon, consistent with the site's no-decorative-icon rule.

## Signature Text Treatment (used exactly once)

- Used once, on the Home page's positioning statement. As this text scrolls into view, it reveals word by word rather than fading in as one block: each word's opacity animates from 0 to 1 in sequence, roughly 40ms delay between words, shared easing curve, so the sentence appears to be read aloud rather than simply appearing.
- Used exactly once across the entire site, on the single most important sentence Haley's site states. Using it a second time would dilute it into decoration; the whole point is that this one sentence gets a treatment nothing else on the site gets.

## Background Texture

- A very subtle film-grain noise texture (a small tiled PNG or SVG filter, 3% to 5% opacity) sits over every solid-color section background sitewide, applied once as a fixed global overlay, not per section.
- Purpose: keeps the flat greige backgrounds from reading as flat digital color, giving them a material, paper-like quality consistent with an architecture and craftsmanship brand.
- Never combined with a gradient, since the site has no gradients anywhere. The grain sits on flat color only.

## Icons: the distinction that matters

- Decorative icons are banned: a checkmark, shield, gear, or any small pictogram standing in for a concept (quality, trust, speed) instead of using real photography or typography to say it. This is absolute.
- Functional interface marks are not the same thing and are allowed wherever the interface genuinely needs one: a close mark on the mobile nav overlay, the accordion's expand and collapse mark, the Sequencing Ledger's state checkmark. These exist to operate the interface or show a real state, not to illustrate a concept. Keep every functional mark a simple single-weight line, ink or base-background color only, never colored or filled, and never introduced where plain text already does the job. The one exception is the Sequencing Ledger's checkmark, which uses the accent color as specified in haley-custom-homes-sequencing-ledger-spec.md.

## FAQ Accordion (Contact page)

- Fact: a prospective client at Haley's price point has real, predictable questions before filling out the form: minimum project size, typical timeline, whether Haley takes remodels below its usual floor. Answering these up front qualifies and reassures a serious visitor rather than making them ask.
- Placement: on the Contact page, below the form and service area columns so the form remains the first thing seen. Full width, single column, max-width matching the standard text-block width (600px), centered.
- Each question is a single row: question text in body type scale, ink color, a thin 1px ink-at-10%-opacity bottom border beneath each row. A small plus mark (functional icon) sits at the row's right edge and rotates 45 degrees into an X when expanded, 200ms, shared easing curve.
- Clicking a row expands it (auto-height animation, 300ms, shared easing curve) to reveal the answer below the question in body type scale. Only one row open at a time; opening a new one closes whichever was open, keeping the section compact.
- Real questions: minimum project size, typical build duration, whether Haley takes remodels as well as new builds, service area, how the Accelerated Precision Building System actually saves time. Actual answers to be confirmed with Haley before launch, do not invent specific figures.

## Service Area Map

- Replaced by the interactive Mapbox map specified in haley-custom-homes-fixes-spec.md (item 16): custom-styled in the site's palette, centered on the office at 5211 S Quebec Street, Greenwood Village, with an accent marker per service city, a one-time outline draw-in, and fly-to on hover or focus of each city in the adjacent list. No default map chrome beyond the provider's required attribution.

## Category decisions: adopted or rejected, nothing left silent

Every category below was weighed against the bespoke test and either adopted with a specific Haley-grounded design or deliberately rejected with a stated reason.

**Charts**: rejected. There's no real comparative dataset in Haley's business that needs a chart; the one genuine comparative fact they have (their process versus a typical build) is already expressed by the Sequencing Ledger (haley-custom-homes-sequencing-ledger-spec.md), a stronger, more concrete device than an abstract bar or line chart for the same fact.

**Galleries and lightbox behavior (Portfolio detail page)**: the stacked full-width scroll is the primary experience. Clicking any image in that stack opens it full-screen in a simple lightbox (dark ink background, the image centered and larger, a small close mark top-right), with left and right arrow keys or edge-tap navigating to the next image in that project's set without leaving the lightbox.

**Shapes**: rejected as decoration generally, consistent with the no-gradient rule, but adopted once in a grounded form: a single thin architectural line motif, a simple 1px stroke resembling a blueprint or floor-plan line, appears as a quiet divider between phase blocks in the Process page's six-phase section only. This is a shape used because Haley literally is a building company and blueprint lines are a real artifact of their work, not a decorative flourish borrowed from an unrelated aesthetic. It appears nowhere else on the site.

**Players (dedicated video player UI beyond the hero)**: only built if the Process or About page ends up including a second video beyond the hero, for instance a short walk-through of a completed home. If so, it plays inline, muted by default, with a single small play/pause mark bottom-left, no platform-branded chrome, no third-party embed frame. If no second video exists in the final asset set, this component is simply not built.

**Forms**: kept deliberately as a single-step form, not a multi-step or progressive-disclosure form, despite that being a common premium pattern elsewhere. A qualification form's job is to filter and capture a serious lead with minimal friction; a multi-step form increases perceived effort and drop-off for exactly the busy, high-net-worth audience this form is trying to capture.

**Footers**: one footer, identical on every page (see the Home Page Spec for the literal layout). A footer's job at this price point is quiet reference information a visitor scrolls down to find on purpose, not a second navigation system or a place to add newsletter signup and link columns the way a volume-oriented site does.

**Modals and overlays**: mostly rejected. No newsletter popup, no exit-intent offer, no promotional overlay of any kind, these are attention-grabbing devices built for sites chasing anonymous traffic volume, which works against a brand whose whole positioning is that it doesn't chase volume. Two overlays are adopted because they're functional, not promotional: the mobile navigation menu (full-screen, ink background, bone text, page links stacked and centered, a close mark top-right, 300ms fade and slight scale-in, shared easing curve) and the lightbox specified above.

**Badges, tags, and labels**: exactly one badge exists on the entire site, the bordered accent-color label used for the closing CTA's scarcity indicator (1px accent border, transparent fill, accent text, small label type scale), reserved for that one real, changing fact: current build-slot availability. It is never reused as a "new" tag on portfolio tiles, a category tag on cards, or a decorative pill anywhere else.

**Tooltips**: rejected outright. Every interactive element on the site (the accordion, the filter tabs, the form fields) is either self-explanatory or already labeled. A tooltip would mean either the design failed and needs fixing directly, or it's explaining something that didn't need explaining, decoration dressed as helpfulness. A hover-only mechanism also fails on touch devices regardless.

**Cookie consent and privacy notice**: adopted, a real compliance requirement, not a design choice. A minimal, single-tier bottom bar, not a full-screen blocking overlay and not a multi-category preference center: fixed to the viewport bottom, ink background, bone text, one sentence stating the site uses cookies for basic analytics, a single ghost-style button reading "Got It," dismisses permanently via a stored preference. If Haley's actual analytics or ad-tracking setup needs more than a basic notice, that's a legal question to confirm before launch, not a design one.

**Empty states**: one real case exists. If the Portfolio filter is ever applied to a category with zero projects, most likely once this becomes a resold template for a builder with a thinner portfolio, the grid area shows a single centered line of body-scale text ("No projects in this category yet.") rather than a blank gap that reads as a broken page. No illustration, no icon.

**404 page**: adopted, a real page rather than the framework default (see the Remaining Pages document for the literal spec). Same nav and footer as every other page for continuity, centered content in the same plain voice as the rest of the site's copy, no illustration, no broken-image graphic.

**Accessibility components**: two specific additions, not a general pass, since motion and touch-target accessibility are already covered under Motion and Cards above. A skip-to-content link, visually hidden by default and becoming visible (ink background, base-background-colored text, small padding) the instant it receives keyboard focus, positioned as the first focusable element on every page. Visible keyboard focus rings on every interactive element (2px, accent color, 2px offset), never suppressed with `outline: none`.

## What never appears anywhere on the site (hard rules, not preferences)

- No generic icon sets (checkmarks, shields, gears, or any icon standing in for a process step or feature). Real photography and typography carry meaning instead. Functional interface marks are the one exception, see the Icons section above.
- No stat-counter widgets (large animated numbers counting up).
- No drop shadows on cards, buttons, or images.
- No gradients anywhere.
- No more than one carousel or slider mechanism reused across the entire site (the marquee is that one mechanism; the Sequencing Ledger is a scroll-triggered list, not a carousel or slider).
- No third accent color introduced for a single section. If a section needs emphasis, use the existing accent, or increase whitespace or type size, don't add a new color.
- No illustration or hand-drawn or doodle elements anywhere. Real photography carries every visual moment on this site; an illustrated substitute always reads as a lower-effort stand-in for a photo Haley could have used instead.
- No promotional popups, newsletter signup modals, or exit-intent overlays of any kind. See the Modals and overlays section above for the two functional exceptions.
- No tooltips anywhere. See the Tooltips section above for why.
- No suppressed keyboard focus outlines (`outline: none` without a visible replacement). See the Accessibility components section above.
