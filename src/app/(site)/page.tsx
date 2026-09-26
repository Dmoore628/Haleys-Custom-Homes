import type { Metadata } from 'next';
import copy from '@content/copy.config';
import { Hero } from '@/components/sections/Hero';
import { PositioningStatement } from '@/components/sections/PositioningStatement';
import { ProcessHighlight } from '@/components/sections/ProcessHighlight';
import { FeaturedPortfolio } from '@/components/sections/FeaturedPortfolio';
import { AwardsStrip } from '@/components/sections/AwardsStrip';
import { ClosingCta } from '@/components/sections/ClosingCta';

export const metadata: Metadata = {
  title: { absolute: copy.home.meta.title },
  description: copy.home.meta.description,
  openGraph: { images: [{ url: '/og/home.jpg', width: 1200, height: 630 }] },
};

export default function HomePage() {
  return (
    <>
      {/* Pinned pair: the statement slides up over the hero. The wrapper ends the pin. */}
      <div>
        <Hero />
        <PositioningStatement />
      </div>
      <ProcessHighlight />
      <FeaturedPortfolio />
      <AwardsStrip />
      <ClosingCta pinned />
    </>
  );
}
