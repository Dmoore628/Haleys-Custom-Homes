import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import copy from '@content/copy.config';
import { getProject, projects } from '@/lib/content';
import { Pinned } from '@/components/ui/Pinned';
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
    description: `${project.name}, ${project.location}. ${project.description}`,
    openGraph: {
      images: [
        { url: `/og/project-${project.slug}.jpg`, width: 1200, height: 630, alt: project.name },
      ],
    },
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const { stats } = copy.portfolio;
  // Only stats with a real, sourced value are shown. Nothing is ever filled with a placeholder.
  const candidates: [string, string | undefined][] = [
    [stats.location, project.location],
    [stats.squareFootage, project.squareFootage],
    [stats.buildDuration, project.buildDuration],
    [stats.completionYear, project.completionYear],
  ];
  const statRows = candidates.filter((row): row is [string, string] => Boolean(row[1]));

  return (
    <>
      {/* Pinned pair: the gallery slides up over the project hero. */}
      <div>
        <Pinned>
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
              <SmartImage
                src={project.heroImage}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
            <div className="section-x relative w-full pb-6 md:pb-16">
              <h1 className="max-w-[14em] font-serif text-hero font-normal">{project.name}</h1>
              <p className="label mt-4">{project.location}</p>
            </div>
          </section>
        </Pinned>

        <section className="relative z-10 bg-bone py-section">
          <ProjectGallery images={project.images} name={project.name} />
        </section>
      </div>

      <section className="section-x relative z-10 bg-bone pb-section">
        <Reveal>
          <dl
            className={`grid grid-cols-2 gap-8 border-t border-ink/10 pt-10 ${
              statRows.length > 2 ? 'md:grid-cols-4' : 'md:max-w-xl'
            }`}
          >
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
