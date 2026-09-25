import type { Metadata } from 'next';
import copy from '@content/copy.config';
import { projects } from '@/lib/content';
import { PortfolioBrowser } from '@/components/sections/PortfolioBrowser';

export const metadata: Metadata = {
  title: copy.portfolio.meta.title,
  description: copy.portfolio.meta.description,
};

export default function PortfolioPage() {
  return (
    // Nav height plus 96px, so the filter tabs sit 96px below the nav.
    <section className="section-x pb-section pt-[calc(5.75rem+96px)] md:pt-[calc(6.5rem+96px)]">
      <h1 className="sr-only">{copy.portfolio.meta.title}</h1>
      <PortfolioBrowser projects={projects} />
    </section>
  );
}
