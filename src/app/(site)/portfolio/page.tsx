import type { Metadata } from 'next';
import copy from '@content/copy.config';
import { getPublishedProjects } from '@/lib/projects/repo';
import { PortfolioBrowser } from '@/components/sections/PortfolioBrowser';
import { CoverStack } from '@/components/ui/CoverStack';
import { sharePreview } from '@/lib/seo';

export const metadata: Metadata = {
  title: copy.portfolio.meta.title,
  description: copy.portfolio.meta.description,
  openGraph: sharePreview('/portfolio', { url: '/og/portfolio.jpg' }),
};

export default async function PortfolioPage() {
  const projects = await getPublishedProjects();
  return (
    // Nav height plus 96px, so the filter tabs sit 96px below the nav.
    <CoverStack>
      <section className="section-x bg-white pb-section pt-[calc(5.75rem+96px)] md:pt-[calc(6.5rem+96px)]">
        <h1 className="sr-only">{copy.portfolio.meta.title}</h1>
        <PortfolioBrowser projects={projects} />
      </section>
    </CoverStack>
  );
}
