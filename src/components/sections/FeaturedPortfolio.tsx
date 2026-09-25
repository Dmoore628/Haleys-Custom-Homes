import copy from '@content/copy.config';
import { featuredProjects } from '@/lib/content';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { ProjectGrid } from './ProjectGrid';

export function FeaturedPortfolio() {
  const { featured } = copy.home;
  return (
    <section className="section-x section-y bg-bone">
      <Reveal>
        <Eyebrow>{featured.eyebrow}</Eyebrow>
        <h2 className="mt-4 font-serif text-section font-normal">{featured.headline}</h2>
      </Reveal>
      <div className="mt-12 md:mt-16">
        <ProjectGrid projects={featuredProjects} />
      </div>
      <div className="mt-14 flex justify-center">
        <ButtonLink href={featured.button.href} variant="ghost">
          {featured.button.label}
        </ButtonLink>
      </div>
    </section>
  );
}
