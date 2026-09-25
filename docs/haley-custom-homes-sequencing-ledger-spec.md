# Haley Custom Homes: The Sequencing Ledger

This document fully replaces the earlier "Comparison Slider" and "Zero-Gap Schedule" component specs, wherever either was referenced in the Design System, Home Page Spec, Remaining Pages Spec, Component/Interaction Spec, or Final Copy documents. This is now the single signature bespoke feature for the site. Hand this document to Claude Code alongside the separate Fixes document; no other document needs to be resent for this change to take effect, this one is self-contained.

## The fact this device proves

Haley's real, named process (the Accelerated Precision Building System, a LEAN-construction-based sequencing method) has one concrete, verifiable claim behind it: the specific waits that normally stall a custom build (a crew standing idle on a permit, a trade waiting on a client's finish selection, a delivery arriving before the site is ready for it) are designed out of the sequence in advance. This is a structural claim about the absence of specific named failure modes, not a duration claim, so it needs no unconfirmed number to be true and to ship.

## Why this replaces the slider and the Zero-Gap Schedule entirely, not just in name

The comparison slider failed for three real reasons: it depended on a duration figure Haley has never published, it had no actual visual timeline on the page, and the drag interaction itself was confusing rather than clarifying. The Zero-Gap Schedule fixed the number dependency but was still an abstract gap-versus-no-gap diagram, it didn't visually communicate anything concrete about what's actually happening at each phase. The Sequencing Ledger fixes both: it shows the real six phases in order, and for each one, names the specific real failure mode that a typical build risks and shows it eliminated, which is a concrete, legible claim rather than an abstract structural one.

## The mechanism, literally

**Visual form:** A vertical, scroll-driven ledger, styled like an architect's punch list or inspection sheet rather than a web dashboard component. Six rows, one per real phase, in a single column, full-width within its section's content column (not full-bleed).

**Each row, left to right:**
1. A phase number in label type scale, tracked uppercase, ink at 40% opacity (Phase 01 through Phase 06).
2. The phase name in body type scale, bold weight, ink color, full opacity (Design and Spec Lock, Pre-Construction Sequencing, Framing, Trade Sequencing, Finish Work, Move-In, matching the six-phase sequence already established in the Remaining Pages document, unchanged).
3. A single checkmark glyph, drawn as a simple two-stroke line (not an icon font, not an SVG from an icon library, hand-specified as two straight line segments meeting at roughly 130 degrees, per the site's no-decorative-icon rule this is a functional mark tied to a real state change, not decoration). Unchecked state: the two strokes are absent, only a thin 1px circle outline sits in that position. Checked state: the two strokes draw in, left stroke first (150ms), then right stroke (150ms), stroke color accent, circle outline fades to accent-filled.
4. To the right of the checkmark position, a single line of real annotation text in label type scale, ink at 65% opacity, italic. This line names the specific real wait a typical build risks at this phase (see Copy Slots below for the exact six lines). The moment the row's checkmark completes its draw-in, this line's text gets a strikethrough that draws left to right (200ms, same easing curve as the rest of the site), ink-at-40%-opacity strikethrough color, the text itself does not fade or change color, only the strikethrough appears. The struck-through annotation stays visible and struck through, it is not hidden after the animation completes.

**Scroll behavior:** Rows activate one at a time as the visitor scrolls through the section, each row's checkmark and strikethrough triggering once, roughly when that row crosses 60% up the viewport. Once triggered, a row never resets, consistent with the site's standing scroll-reveal rule (trigger once, never replay on scroll back).

**Row entrance (separate from the checkmark animation):** Before a row's checkmark triggers, the row itself enters using the site's standard scroll-reveal (opacity 0 to 1, translateY 24px to 0, 600ms, shared easing curve) as it becomes visible, so the ledger reads as being written down the page, not simply present.

**Divider:** A thin 1px ink-at-10%-opacity horizontal rule between each row, consistent with a real ledger or punch list, not decorative.

## Copy slots (exact text, use as written)

Row 1, Design and Spec Lock: "The wait a typical build risks here: mid-build changes to layout or finishes that weren't locked in advance."

Row 2, Pre-Construction Sequencing: "The wait a typical build risks here: a crew standing idle on a delivery or a permit that wasn't sequenced ahead of time."

Row 3, Framing: "The wait a typical build risks here: framing crews sitting on a decision that should have already been made."

Row 4, Trade Sequencing: "The wait a typical build risks here: one trade waiting on the last trade to finish before starting their own work."

Row 5, Finish Work: "The wait a typical build risks here: a finish selection made too late to install on schedule."

Row 6, Move-In: "The wait a typical build risks here: a final walk-through finding problems that push move-in back." Below this row only, add the real supporting line, unchanged from the existing Final Copy document: "One family moved into their new Haley home a full month ahead of schedule."

## Placement

**Home page (compact teaser version):** Replaces the current Process Highlight section's left-column device entirely, in the same two-column asymmetric layout already specified (7 of 12 columns for the ledger, 4 of 12 offset by 1 for the supporting text). Same eyebrow ("THE ACCELERATED PRECISION BUILDING SYSTEM") and same right-column text and "Learn the Process" button, unchanged. Only the left-column device changes, from the Zero-Gap Schedule diagram to this ledger. On Home, use all six rows, this is not truncated to a shorter teaser version, the full ledger at this size is still compact enough for a homepage section.

**Process page:** Replaces the current "Comparative Hook" section entirely. Placed directly beneath the intro, before the existing Six-Phase Sequence breakdown lower on the page. Full-width within the page's content column, given more vertical breathing room than the Home version (increase inter-row spacing by roughly 50%). This is the larger, primary presentation of the device, the Home version is its compact echo.

**Relationship to the existing Six-Phase Sequence section further down the Process page:** These remain two different, non-redundant things. The Sequencing Ledger answers "what specific failure does Haley's sequencing avoid, phase by phase." The Six-Phase Sequence (unchanged, still using the asymmetric alternating image/text blocks and the vertical progress rail) answers "what actually happens, in order, with photos." Keep both.

## Accessibility and reduced motion

Under `prefers-reduced-motion: reduce`, all rows render already checked, already struck through, with no draw-in or strikethrough animation, and the row-entrance scroll-reveal is replaced by ordinary static layout, consistent with the site's existing reduced-motion rule for every other animated component. The checkmark and strikethrough are never the only way the state is conveyed, the annotation text itself remains fully readable whether struck through or not, so no information is lost for a screen reader, which will simply read the annotation line as plain text regardless of its visual strikethrough state.

## What to remove

Delete every reference to the "Comparison Slider" and the "Zero-Gap Schedule" from the Design System, Home Page Spec, Remaining Pages Spec, and Component/Interaction Spec documents, and replace each with a pointer to this document. Do not leave both devices specified in parallel anywhere, this is a full replacement, not an addition.
