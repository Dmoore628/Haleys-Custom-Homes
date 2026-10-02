import { Reveal } from '@/components/ui/Reveal';
import { HouzzReviews } from './HouzzReviews';

/**
 * Home: what clients say, right after the work itself. Haley's Houzz standing, centered, over
 * the marquee of client reviews.
 */
export function ClientReviews() {
  return (
    <section
      className="section-y relative isolate overflow-hidden bg-white"
      aria-label="Testimonials"
      data-testid="client-reviews"
    >
      <Reveal>
        <HouzzReviews />
      </Reveal>
    </section>
  );
}
