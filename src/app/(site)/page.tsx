import type { Metadata } from 'next';
import copy from '@content/copy.config';
import { Hero } from '@/components/sections/Hero';
import { PositioningStatement } from '@/components/sections/PositioningStatement';
import { ProcessTeaser } from '@/components/sections/ProcessTeaser';
import { FeaturedPortfolio } from '@/components/sections/FeaturedPortfolio';
import { ClientReviews } from '@/components/sections/ClientReviews';
import { AwardsStrip } from '@/components/sections/AwardsStrip';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { CoverStack } from '@/components/ui/CoverStack';
import { sharePreview, heroShareVideo } from '@/lib/seo';

export const metadata: Metadata = {
  title: { absolute: copy.home.meta.title },
  description: copy.home.meta.description,
  // The hero video plays in previews that support it; the card shows everywhere else.
  openGraph: sharePreview('/', { url: '/og/home.jpg' }, { videos: [heroShareVideo] }),
};

export default function HomePage() {
  return (
    <CoverStack>
      <Hero />
      <PositioningStatement />
      <FeaturedPortfolio />
      <ClientReviews />
      <ProcessTeaser />
      <AwardsStrip />
      <ClosingCta />
    </CoverStack>
  );
}
