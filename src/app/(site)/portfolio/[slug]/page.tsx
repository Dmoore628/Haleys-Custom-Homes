import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import copy from '@content/copy.config';
import { getProject, projects } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';
import { SmartImage } from '@/components/ui/SmartImage';
import { ProjectGallery } from '@/components/sections/ProjectGallery';

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getProject(params.slug);
  if (!project) return {};
  return {
    title: project.name,
    description: `${project.name}, a Haley Custom Homes luxury custom home in the Denver Metro area.`,
    openGraph: { images: [project.coverImage] },
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const { stats } = copy.portfolio;
  const statRows = [
    [stats.location, project.location],
    [stats.squareFootage, project.squareFootage],
    [stats.buildDuration, project.buildDuration],
    [stats.completionYear, project.completionYear],
  ] as const;

  return (
    <>
      {/* Project hero: full-bleed, min 80vh, name and location bottom-left like the Home hero. */}
      <section className="relative flex min-h-[80vh] w-full items-end overflow-hidden bg-ink text-bone">
        {project.heroVideo ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={project.heroVideo}
            muted
            autoPlay
            loop
            playsInline
            aria-hidden="true"
          />
        ) : (
          <SmartImage src={project.heroImage} alt="" fill priority sizes="100vw" className="object-cover" />
        )}
        <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
        <div className="relative px-6 pb-6 md:px-16 md:pb-16">
          <h1 className="font-serif text-hero font-light">{project.name}</h1>
          <p className="label mt-4">{project.location}</p>
        </div>
      </section>

      <section className="py-section">
        <ProjectGallery images={project.images} name={project.name} />
      </section>

      <section className="section-x pb-section">
        <Reveal>
          <dl className="grid grid-cols-2 gap-8 border-t border-ink/10 pt-10 md:grid-cols-4">
            {statRows.map(([label, value]) => (
              <div key={label}>
                <dt className="label text-ink/70">{label}</dt>
                <dd className="label mt-2">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-12 max-w-text text-body">{project.description}</p>
        </Reveal>
      </section>
    </>
  );
}
