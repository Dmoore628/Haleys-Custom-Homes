# Haley Custom Homes: Component and Interaction Spec

Companion to the Build Spec. That document covers strategy, sitemap, and tech stack. This one defines the sitewide interaction system, every shared component's exact behavior, and the interior page layouts, in enough literal detail that nothing is left for Claude Code to fill with a generic default. Read both before building.

This is an independent rewrite. The reasoning below was re-derived from first principles about what makes a small, high-trust, low-volume service business read as premium online, not carried forward from a prior pass.

## The actual principle behind "premium"

A site reads as premium when very few elements appear per screen, each one is given real size and real whitespace, and exactly one interactive feature is genuinely bespoke, meaning it exists because of a specific, real, verifiable fact about the business, not because it's an available template pattern. A site reads as generic or crowded when the opposite happens: many small elements competing for attention on one screen, stat-counter widgets, decorative icon rows, and interactive mechanisms (carousels, sliders, hover effects) reused in more than one place for no reason beyond that the mechanism was available. Every decision below follows from that one principle.

## The signature bespoke feature

The site needs exactly one genuinely custom interactive centerpiece, tied to a specific true fact about Haley, not a borrowed effect. The candidate that survives the bespoke test (would this survive unchanged if you swapped in a different builder's name and facts) is a device that visualizes Haley's real, named, sequenced construction process, the Accelerated Precision Building System, in a way a paragraph of text cannot. A generic template has no equivalent fact to visualize, so this device could not simply be dropped into another site unchanged, which is exactly why it belongs here. The literal mechanism for this feature (a draggable before/after comparison slider showing Haley's actual tight trade sequencing against a generic gapped timeline) is fully specified in the Design System document's Comparison Slider section, and its placement on both the Home page and the Process page is specified in those page documents.

A single smaller bespoke touch also belongs near the Home hero and the closing CTA: a small tracked-uppercase tag reflecting the real, current build-slot scarcity, something like "Currently accepting a limited number of [year] build slots." The real current number must be confirmed with Haley before launch, never invented. This is restraint-appropriate urgency, the opposite of a homes-built counter that brags about volume, it communicates less capacity, not more, which is the honest and differentiating claim here.

No third signature feature is added anywhere on the site. One genuinely bespoke interactive element, reinforced by one smaller supporting device, is the right amount. A third would start competing with the first two for the visitor's attention and stop feeling deliberate.

## Sitewide interaction system, exact values

**Navigation:**
- Fixed position, transparent background over the hero, on every screen size. After 80px of scroll, the background transitions to the base bone color with a 1px ink-at-10%-opacity bottom border, per the Build Spec's nav section, not a solid ink fill. Transition: 200ms ease-out on background-color and border-opacity together.
- **Desktop:** logo left, the four page links plus the distinct "Start the Conversation" CTA visible at all times, per the Build Spec's nav section. No trigger, no overlay, nothing hidden behind a click, since there's room to show all five items and the CTA staying visible matters more here than the minimalism a hidden trigger would buy.
- **Mobile only:** logo left, a single nav trigger right, the word "Menu" in tracked-uppercase small type. On hover or focus, each letter lifts individually (`translateY(-2px)`, staggered 40ms per letter, 150ms ease-out per letter), a small, cheap-to-build microinteraction that reads as deliberate craft rather than a default link style, because it only shows up on the one word a visitor is about to tap. Tapping opens a full-screen overlay, not a dropdown panel: ink background, nav links in large serif type, each link fading up on entrance with a 60ms stagger between links, 400ms duration, 20px initial translateY. The trigger label changes to "Exit," using the same letter-stagger treatment.

**Buttons, exactly two variants, nothing else:**
- Primary: ink fill, bone text. On hover, a lighter-tone layer sweeps in from the left edge (`scaleX(0)` to `scaleX(1)`, `transform-origin: left`, 300ms ease-in-out). A directional wipe reads more considered than an instant color swap.
- Ghost: 1px ink border, transparent fill. On hover, fills to 10% ink opacity, 200ms ease, no wipe needed since there's no fill to sweep.
- Both variants: 2 to 4px corner radius maximum, never pill-shaped, sharp corners read architectural rather than app-like. Label text: 12 to 13px, uppercase, `letter-spacing: 0.05em`.

**Image hover (portfolio tiles, project cards):**
- Wrapper: `overflow: hidden`. Image scales `1.0` to `1.04` on hover, 600ms, the shared easing curve defined in the Design System document. No bounce.
- A black overlay fades from 0% to 8% opacity over the same duration.
- Caption text (project name, location) slides up 8px and fades in over 300ms, delayed 100ms after the scale begins.

**Scroll reveals (every major section):**
- Opacity 0 to 1, translateY 24px to 0, 600ms, the shared easing curve.
- Triggers once at roughly 20% element visibility and never replays on scroll-back. Re-triggering an animation every time a section re-enters the viewport is one of the fastest tells of a template site.

**Page transitions:**
- 300ms opacity cross-fade on route change. No slides, no wipes. Restraint applies here too, an elaborate page-transition gimmick works against the "premium equals quiet" principle above.

**Custom cursor (adopted, not a maybe):**
- A small filled dot follows the pointer. Hovering any link or image expands it into a soft outlined ring (roughly 40px diameter, 1px ink border, transparent fill), 200ms ease. This single detail is exactly the kind of touch a generic build skips and a bespoke one includes, and it costs little to implement.

## Portfolio page

- Filter bar at top: two tabs, "New Builds" and "Remodels," small tracked-uppercase type. The active tab's underline physically slides to the new position on click using a shared layout animation, not a jump-cut. Filtering re-triggers the scroll-reveal treatment for newly visible tiles only.
- Grid: asymmetric, varying tile heights and widths, not a uniform grid. A perfectly uniform grid reads as a stock template; visual rhythm through varied module sizes reads as curated.
- Each tile uses the image hover treatment above. Project name and location appear on hover, bottom-left, not visible at rest, keeping the grid quiet until the visitor engages it.
- Clicking a tile routes to the project detail page: a full-bleed hero image or short video loop specific to that project, a stacked full-bleed gallery, a small stats block, and a short description. Full literal spec is in the Remaining Pages document.

## Process page

- Hero: short statement plus a small tracked eyebrow, the same restraint as Home's hero, different copy specific to the building philosophy.
- The comparison slider device from the signature feature above is the page's centerpiece and gets the most vertical scroll real estate. Full placement and sequencing detail is in the Remaining Pages document.
- Concierge program: a simple two-column layout, real description text on one side, a real photo on the other. No icon set, no illustrated diagram. Generic process icons (checkmarks, gears, shields) are a template tell and are avoided across the entire site, not only here.
- Closing CTA: identical visual treatment to Home's closing CTA, for consistency across the site.

## About page

- A large real photo of Dan Fuller (environmental portrait, not a corporate headshot, if a better option exists in the extracted assets), paired with the founding story written as one flowing narrative paragraph, not a bulleted timeline. A bulleted milestone timeline reads corporate; a paragraph reads as someone telling you the truth about their history.
- The 3-to-5-homes-a-year philosophy statement repeats here, reusing Home's large single-statement treatment, with a different supporting line since this page can go a layer deeper into why, not just that it's true.
- Awards and credentials: the same understated row treatment as Home, but since this is the dedicated deeper page, each award gets one short line of context rather than only a logo mark.

## Contact page

- Two-column layout. Left: the qualification-oriented form fully specified in the Remaining Pages document.
- Right: a clean typographic service-area list, paired with the custom line-art service-area map specified in the Design System document, not an embedded map widget, which would break the site's visual consistency with someone else's interface. Phone and email as understated tracked-type links beneath, no icon blocks.

## Explicit guardrails: what is never built

Every item below is something a crowded, volume-oriented competitor site does that works against this brief. Listed so Claude Code never defaults to any of them:

- **No stat-counter widgets.** A row of animated homes-built or years-in-business counters is marketing-volume bragging, the opposite of a scarcity-driven premium position. If a number belongs on the site (a founding year, for instance), it lives inside a sentence, never a counter.
- **No stacking of credibility signals.** Press logos, podcast embeds, partner-org logo walls, and video testimonials piling up on top of each other multiply credibility signals past the point of being read individually. Keep credibility to the one understated award treatment specified in the Home and About page documents.
- **No more than one carousel or slider mechanism reused across the whole site.** The marquee (Design System document) and the comparison slider are the two motion mechanisms this site uses, each tied to a distinct real content type. No third mechanism is introduced, and neither of these two is reused for content it wasn't designed for.
- **No decorative icon illustration anywhere.** No checkmarks, shields, or generic process icons. Real photography and typography carry the premium feeling; a generic icon set is the fastest way to make a custom build read as a theme.
- **No embedded third-party widgets** (map iframes, video players with visible platform branding, or anything that introduces someone else's interface language into the site).

## Build order addition

Insert this into the Build Spec's checklist, between building the shared layout and building individual pages: build the sitewide interaction primitives (nav behavior, button variants, image hover treatment, the scroll-reveal wrapper, the custom cursor) as shared, reusable components before building any page section. Every page pulls from the same primitive set rather than inventing its own button or hover style per page, and that consistency is itself part of what reads as premium rather than assembled.
