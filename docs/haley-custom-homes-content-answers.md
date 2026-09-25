# Haley Custom Homes: Real Content Answers for Claude Code

This document now reflects actual web research against Haley's own site, their Houzz profile, and BuildZoom's licensing records, not just what was already on hand. Three categories of fact genuinely resolved through that research below. A separate, smaller set of items still can't be resolved by looking anything up, not because I didn't try, but because they're either private business decisions (current build-slot count), an account credential that doesn't exist until created (SMTP login), or a private asset library I've never been given access to (your extracted photos). Those are called out explicitly, not left silently blank.

## Contact Info (verified independently, not just carried forward)

- **Phone: 303-601-9446.** Confirmed independently on both Houzz and BuildZoom, matches what was already given, this one checks out.
- **Email: unresolved to a single address.** Every directory listing I found (ZoomInfo, ContactOut, LeadIQ) masks it as `d***@haleycustomhomes.com`, confirming the domain and that it starts with "d," consistent with Dan Fuller, but not the full address. "dan@haleycustomhomes.com" is a reasonable guess, not a verified fact, don't present it as confirmed. If you have Dan's real email from any other source, use that instead.
- **Address discrepancy, flagging rather than picking one silently:** Houzz lists 5211 S Quebec Street, Greenwood Village, CO 80111. BuildZoom lists 7555 E Hampden Ave, Denver, CO 80231. These may be a past and current office, or one may be stale. The site doesn't need a street address anywhere in the current spec, so this doesn't block anything, but don't introduce one without resolving which is current.

## Contact form email credentials (cannot be filled in by me, no third-party form service, self-hosted instead)

Per the updated Build Spec, the contact form no longer depends on Formspree or Web3Forms. It's a small API route this codebase owns (`/api/contact`), sending mail by SMTP through an email account you already control, no new company account, no per-submission fee, ever. It still needs real credentials, an account's login details, which only you can supply:

1. Pick an email account to send from during the demo phase. A personal account or a free account made for this purpose both work, since this is temporary. Most providers (Gmail, Outlook, a domain host's webmail) expose SMTP settings and let you generate an app-specific password for this exact purpose, rather than using your real login password.
2. Fill in these four values:
   - `SMTP_HOST = _______________`
   - `SMTP_PORT = _______________` (587 for most providers)
   - `SMTP_USER = _______________`
   - `SMTP_PASSWORD = _______________` (the app-specific password, not your real account password)
   - `CONTACT_TO_ADDRESS = _______________` (where submissions should land during the demo, doesn't need to be dan@haleycustomhomes.com yet)
3. Give these to Claude Code as environment variables, not as text anywhere in the codebase or in a document that gets shared. They go into Vercel's project settings and a local `.env.local` file that's git-ignored.

Once Haley accepts the pitch, swap `CONTACT_TO_ADDRESS` and the sending account's credentials for Haley's own (dan@haleycustomhomes.com's real SMTP details), that's the only change needed at handoff, no new integration to build.

## Project stats and categories (real project names found, stats still need your asset library)

Haley's Houzz profile lists these real project titles and locations, found through actual research, not invented:

| Project name (as listed on Houzz) | Location | Likely category |
|---|---|---|
| 36 Cherry Creek Historical Remodel | Denver | Remodel (unambiguous from the name) |
| 5 Modern Farm House in Cherry Hills | Englewood, CO | Confirm with Damian, new build or remodel unclear from the name alone |
| 5 Denver Modern | Englewood, CO | Confirm with Damian |
| Cherry Hills Transitional | Cherry Hills Village, CO | Confirm with Damian |
| Cherry Hills Traditional | Denver | Confirm with Damian |
| Modern | Denver, CO | Confirm with Damian |

None of these came with square footage, build duration, or completion year on the profile page, and I don't have access to your extracted photo library to match these titles to specific image folders or confirm which ones you actually have full photo sets for. This table is a real starting point, not a finished `projects.json`, cross-reference it against your asset library, fill in the missing stats, and confirm the ambiguous categories, then hand the completed table to Claude Code.

The Country Club remodel named in the Gendron testimonial doesn't appear under that exact name on Houzz, it may be listed under a different project title, or may not be posted there at all. Worth checking your own library for it directly rather than assuming it matches one of the six above.

## FAQ answers (now backed by real sourced figures, two items genuinely still unresolved)

**What's the minimum project size?**
"New builds start at $4 million, with a minimum of 5,000 square feet. Remodels typically start around $600,000." This is a real, sourced figure from Haley's own Houzz profile, not invented, use it as written.

**How long does a typical build take?**
Two different numbers belong in two different places here, don't conflate them:
- For the national comparison in the FAQ answer, use 12 months, the U.S. Census Bureau's Survey of Construction reports 12 months as the average completion time for contractor-built single-family homes (2024 data), the closest real published benchmark to a client hiring a builder like Haley, as opposed to a production builder-for-sale home (7.6 months) or an owner-built home (15.1 months). Label it as a national industry average, not a claim about any specific competitor.
- For "Haley's Process," her own actual average duration is still not publicly stated anywhere I could find. That number, and the FAQ answer built on it, still needs to come from Damian or Haley directly. I looked, it isn't published.

**Do you take on remodels as well as new builds?**
Yes. Confirmed both from the McDonald/Fisher/Gendron testimonials and directly from Haley's own Houzz profile, which lists both new construction and remodels with separate starting price points. Use as written.

**What areas do you build in?**
Denver, Boulder, Centennial, Englewood, Greenwood Village, Cherry Hills Village, and Bow Mar, per Haley's own Houzz profile. This is very close to, but not identical to, the service area list used elsewhere in these documents (which also includes Aspen and Vail and doesn't mention Englewood or Bow Mar). Reconcile this discrepancy with Damian before finalizing the FAQ answer and the Contact page list, they should say the same thing.

**How does the Accelerated Precision Building System actually save time?**
It sequences trades and materials in a fixed order, based on LEAN construction principles, so no crew is left waiting on a delivery or a decision that should have already happened. One documented result: a client moved into their home a full month ahead of schedule. Verified from the McDonald testimonial and Haley's own site description of the system. Use as written.

## What genuinely cannot be resolved by looking anything up

1. **Haley's own real build duration**, as opposed to the industry benchmark above. Not published anywhere. Needs a real number from Damian or Haley.
2. **Current real build-slot availability**, used in the closing CTA's scarcity badge. This changes month to month and by definition isn't published anywhere public, it's an internal capacity fact only Haley knows right now.
3. **SMTP credentials for the contact form.** Not a fact to discover, an account that doesn't exist until Damian creates it. See the section above.
4. **Exact per-project square footage, build duration, and completion year**, and confirmation of which of the six project titles above actually have full, usable photo sets in Damian's extracted library. That library was never shared with me, there's nothing further to look up on the public web that would resolve it.
5. **The exact service-area list discrepancy** flagged above, and which of the two listed business addresses is current.

These five are genuinely blocked on Damian, or on Haley once the pitch is accepted, not on more research.

Sources: [Houzz: Haley Custom Homes profile](https://www.houzz.com/professionals/home-builders/haley-custom-homes-pfvwus-pf~1703183129), [BuildZoom: Haley Custom Homes](https://www.buildzoom.com/contractor/haley-custom-homes), [Haley Custom Homes](https://www.haleycustomhomes.com/), [Eye On Housing: Single-Family Homes Are Built Faster in 2024](https://eyeonhousing.org/2025/09/single-family-homes-are-built-faster-in-2024/)
