# Haley Custom Homes: The Sequencing Ledger (Final)

This document fully replaces the earlier "Comparison Slider" and "Zero-Gap Schedule" component specs, and supersedes the first version of this document already sent to Claude Code. Every decision below is final. Every numbered item ends with an Acceptance line, a plain yes-or-no test. If Claude Code cannot answer yes to every Acceptance line for a given item, that item is not done, there is no judgment call left to make on any of them.

This document is self-contained. Hand it to Claude Code alongside the separate Fixes document. No other document needs to be resent for this change to take effect.

## The fact this device proves

Haley's real, named process (the Accelerated Precision Building System, a LEAN-construction-based sequencing method) has one concrete, verifiable claim behind it: the specific waits that normally stall a custom build are designed out of the sequence in advance. This is a structural claim about the absence of specific named failure modes, not a duration claim, so it needs no unconfirmed number to be true and to ship.

## Why this replaces the slider and the Zero-Gap Schedule entirely

The comparison slider depended on a duration figure Haley has never published, had no actual visual timeline, and used a confusing drag interaction. The Zero-Gap Schedule fixed the number dependency but stayed an abstract gap-versus-no-gap diagram. The Sequencing Ledger fixes both: real six phases, in order, each one naming the specific real failure a typical build risks and showing it eliminated.

---

## 1. Visual form and layout

A vertical, scroll-driven ledger, styled like an architect's punch list or inspection sheet, not a web dashboard component. Six rows, one per real phase, single column, full-width within its section's content column (not full-bleed). A thin, 1px, accent-color vertical rule runs down the page behind the phase-number column only, connecting all six numbers into one visual spine, like a straightedge line drawn down the margin of a real punch list before the numbers were written in. This rule is the detail that makes the ledger read as one composed object instead of six stacked, unrelated rows.

**Acceptance:** Yes if a single continuous 1px accent-colored vertical line is visible running behind the phase-number column from row 1 through row 6, and the whole ledger sits in a single column that does not span full-bleed. No if the rows appear as six separate, disconnected blocks with no unifying vertical element, or if the ledger stretches edge to edge of the viewport.

## 2. Phase numbers, hand-designed, not a UI list index

Phase numbers ("01" through "06") render in Bodoni Moda (the site's display serif, not Switzer), size `clamp(1.5rem, 3vw, 2.25rem)`, ink color at 50 percent opacity. This is a deliberate upgrade from a small tracked-uppercase label, a number at this size in the display typeface is what makes the row read as a designed, typographically considered object rather than a generic numbered list, the same way a designed editorial page uses a large folio number, not a small index digit.

**Acceptance:** Yes if the phase numbers are visibly larger than the phase name text beside them and rendered in the serif display typeface, not the body sans typeface. No if the numbers are the same size as or smaller than the phase name, or rendered in the body typeface.

## 3. Phase name

Body type scale, bold weight, ink color, full opacity. Text: Design and Spec Lock, Pre-Construction Sequencing, Framing, Trade Sequencing, Finish Work, Move-In, in that order. Unchanged from the original spec.

**Acceptance:** Yes if these six phase names appear in this exact order in bold body type. No if the order, wording, or weight differs.

## 4. The checkmark glyph, corrected contrast, hand-drawn quality

Drawn as two straight line segments meeting at roughly 130 degrees, custom-drawn geometry, never an icon font or an icon-library SVG. To avoid the contrast bug already caught before build (accent strokes drawn on top of an accent-filled circle would be invisible), the states are:

- **Unchecked (at rest):** a thin, 1px, ink-at-40%-opacity circle outline, no fill, no strokes inside it.
- **Checked:** the circle outline itself transitions to solid accent color (still unfilled, outline only), and the two strokes draw in inside it, accent color, left stroke first over 150ms, then the right stroke over 150ms.
- **Hand-drawn detail:** the two strokes are not perfectly symmetrical. The left stroke is drawn 10 to 15 percent longer than the right, and the vertex where they meet sits very slightly (2 to 3 degrees) off from a mathematically centered angle. This is what separates a hand mark from a vector checkbox icon, a real pen mark is never perfectly symmetrical, and a mark this small only needs a small asymmetry to read as drawn rather than rendered.

**Acceptance:** Yes if, in the checked state, the circle outline color and the stroke color are visibly distinguishable from the page background and from each other is not required, since both are accent color, but the strokes must be visible against the circle's unfilled interior at every zoom level. Yes if the two strokes are not identical in length or perfectly symmetrical around their vertex. No if the checkmark is invisible or low-contrast against its own circle, or if the strokes are a perfectly symmetrical, machine-drawn checkmark shape.

## 5. Annotation line and strikethrough

To the right of the checkmark, one line of real annotation text, label type scale, ink at 65 percent opacity, italic. Six exact lines, see section 7 below. The moment a row's checkmark completes drawing in, the annotation's strikethrough draws left to right over 200ms using the site's shared easing curve, ink-at-40%-opacity color. The strikethrough itself is drawn as a very slightly irregular path (a subtle hand-wobble, not a perfectly straight vector line), consistent with the site's overall drawn, not rendered, visual language established by the checkmark's asymmetry above. The annotation text itself never fades, changes color, or disappears, only the strikethrough appears over it, and it stays struck through permanently once drawn.

**Acceptance:** Yes if the strikethrough line is very slightly irregular rather than a perfectly straight ruled line, and the annotation text underneath remains fully legible and unchanged in color after the strikethrough appears. No if the annotation text fades, hides, or changes color, or if the strikethrough is perfectly straight with no hand-drawn irregularity.

## 6. Scroll and entrance behavior

Rows activate one at a time as the visitor scrolls, each row's checkmark and strikethrough triggering once, roughly when that row crosses 60 percent up the viewport, and never resetting or replaying once triggered. Before a row's checkmark triggers, the row itself enters using the site's standard scroll-reveal (opacity 0 to 1, translateY 24px to 0, 600ms, shared easing curve). A thin 1px ink-at-10%-opacity horizontal rule sits between each row.

**Acceptance:** Yes if scrolling down the page triggers each row's animation once, in order, and scrolling back up and back down again does not replay any row's animation. No if any row replays on repeated scroll, or if all six rows animate simultaneously regardless of scroll position.

## 7. Copy slots, exact text

Row 1, Design and Spec Lock: "The wait a typical build risks here: mid-build changes to layout or finishes that weren't locked in advance."

Row 2, Pre-Construction Sequencing: "The wait a typical build risks here: a crew standing idle on a delivery or a permit that wasn't sequenced ahead of time."

Row 3, Framing: "The wait a typical build risks here: framing crews sitting on a decision that should have already been made."

Row 4, Trade Sequencing: "The wait a typical build risks here: one trade waiting on the last trade to finish before starting their own work."

Row 5, Finish Work: "The wait a typical build risks here: a finish selection made too late to install on schedule."

Row 6, Move-In: "The wait a typical build risks here: a final walk-through finding problems that push move-in back."

**Acceptance:** Yes if all six lines appear verbatim, in this order, attached to their named phase. No if any line is paraphrased, reordered, or attached to the wrong phase.

## 8. The Early Move-In Marker, replacing the old caption line

The earlier flat caption line ("One family moved into their new Haley home a full month ahead of schedule. Their words: 'Yes, that is correct.'") is removed entirely and replaced by this dedicated component, placed directly beneath Row 6.

**Visual form:** a horizontal calendar strip, drawn in the same single-stroke ink line-art style as the checkmark and the site's tool-motif vectors, approximately 30 day-tiles wide, centered in the section's content column. One tile, positioned roughly four-fifths of the way along the strip, carries a small accent-colored flag marker and the label "Expected" in label type scale beneath it. A second, unlabeled marker sits at rest directly on top of the "Expected" marker's tile.

**Animation, triggers once on scroll into view:** the second marker slides left along the strip from the "Expected" tile to a tile roughly one-fifth of the strip's width earlier (representing a month), over 900ms, shared easing curve. When it settles, the label "Move-In" fades in beneath it in label type scale, accent color.

**Interaction:** hovering or focusing the calendar strip replays the slide animation once per hover, so a visitor can trigger it again deliberately. This does not count as an unwanted replay under the "trigger once" rule elsewhere on the site, because it is visitor-initiated, not scroll-triggered.

**Supporting quote:** directly beside the calendar strip on desktop (7/5 asymmetric split, calendar at 7 columns, quote at 5), stacked below it on mobile, the real McDonald testimonial quote renders at pull-quote scale (larger than the standard testimonial marquee card text), italic Bodoni Moda, centered within its own column: "Yes, that is correct." attributed "Michael and Jane McDonald" in body type, label scale, not italic, directly beneath the quote.

**Placement:** this component appears on both the Home teaser version and the Process page's full version of the ledger, directly beneath Row 6 in both places.

**Acceptance:** Yes if a calendar-strip graphic with two markers is visible beneath Row 6, the second marker visibly animates from the "Expected" tile to an earlier tile on scroll into view, the animation replays on hover or focus, and the real McDonald quote appears beside or below it at a visibly larger size than the testimonial marquee cards elsewhere on the site. No if the old caption sentence still appears anywhere, if the calendar graphic is missing, if the marker does not move, or if the quote is the same size as an ordinary testimonial card.

## 9. Home page placement

Replaces the current Process Highlight section's left-column device entirely, in the same two-column asymmetric layout already specified (7 of 12 columns for the ledger, 4 of 12 offset by 1 for the supporting text). Same eyebrow ("THE ACCELERATED PRECISION BUILDING SYSTEM") and same right-column text and "Learn the Process" button, unchanged. All six rows appear, not a truncated version.

**Acceptance:** Yes if the Home page's Process Highlight section shows all six ledger rows plus the Early Move-In Marker, in the existing two-column layout, with the existing eyebrow and button unchanged. No if fewer than six rows appear, or if the eyebrow or button text has changed.

## 10. Process page placement and heading

Replaces the current "Comparative Hook" section entirely. Heading above the ledger stays "See the Difference," unchanged. The old second line ("Drag to compare a typical custom build against a Haley build, phase by phase") is deleted and not replaced with any new supporting line, the ledger's own row annotations do that job. Placed directly beneath the page's intro, before the existing Six-Phase Sequence breakdown lower on the page. Full-width within the page's content column, with inter-row spacing increased by roughly 50 percent over the Home version.

**Acceptance:** Yes if the heading "See the Difference" appears alone above the ledger with no supporting sentence beneath it, and the ledger sits between the Intro section and the Six-Phase Sequence section. No if any supporting sentence appears beneath the heading, or if the drag-comparison language appears anywhere on the page.

## 11. Relationship to the Six-Phase Sequence section

Unchanged. The Sequencing Ledger and the Six-Phase Sequence (the alternating image/text blocks with the vertical progress rail, further down the Process page) both stay, they answer different questions and are not redundant.

**Acceptance:** Yes if both sections exist on the Process page, in this order: Intro, Sequencing Ledger, Six-Phase Sequence. No if either section is missing or their order is reversed.

## 12. Accessibility and reduced motion

Under `prefers-reduced-motion: reduce`, all rows render already checked, already struck through, with no draw-in or strikethrough animation, and the row-entrance scroll-reveal is replaced by ordinary static layout. The Early Move-In Marker renders with its second marker already in the settled, moved-in-early position, no slide animation plays. The annotation text remains fully readable regardless of strikethrough state, so no information is lost for assistive technology.

**Acceptance:** Yes if, with reduced motion enabled in the operating system or browser, the page loads with every row already checked and struck through and the calendar marker already in its final position, with no animation playing at any point. No if any animation still plays under reduced motion.

## 13. What to remove

Delete every reference to the "Comparison Slider" and the "Zero-Gap Schedule" from the Design System, Home Page Spec, Remaining Pages Spec, and Component/Interaction Spec documents, and replace each with a pointer to this document.

**Acceptance:** Yes if a text search for "Comparison Slider" and "Zero-Gap Schedule" across the whole codebase and content files returns zero results. No if either term still appears anywhere.
