import type { Metadata } from 'next';
import copy from '@content/copy.config';
import { Hero } from '@/components/sections/Hero';
import { PositioningStatement } from '@/components/sections/PositioningStatement';
import { ProcessHighlight } from '@/components/sections/ProcessHighlight';
import { FeaturedPortfolio } from '@/components/sections/FeaturedPortfolio';
import { Testimonials } from '@/components/sections/Testimonials';
import { AwardsStrip } from '@/components/sections/AwardsStrip';
import { ClosingCta } from '@/components/sections/ClosingCta';

export const metadata: Metadata = {
  title: { absolute: copy.home.meta.title },
  description: copy.home.meta.description,
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <PositioningStatement />
      <ProcessHighlight />
      <FeaturedPortfolio />
      <Testimonials />
      <AwardsStrip />
      <ClosingCta />
    </>
  );
}
