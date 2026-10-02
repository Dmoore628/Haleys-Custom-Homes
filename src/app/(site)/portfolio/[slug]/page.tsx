import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import copy from '@content/copy.config';
import { getPublishedProject, getPublishedProjects } from '@/lib/projects/repo';
import { CoverStack } from '@/components/ui/CoverStack';
import { Reveal } from '@/components/ui/Reveal';
import { SmartImage } from '@/components/ui/SmartImage';
import { ProjectGallery } from '@/components/sections/ProjectGallery';
import { sharePreview } from '@/lib/seo';

// Projects published after the build (from the admin) render on first request, then cache.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getPublishedProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await getPublishedProject(params.slug);
  if (!project) return {};
  const where = project.location ? `, ${project.location}` : '';
  return {
    title: project.name,
    description: `${project.name}${where}. ${project.tagline ?? project.description}`.slice(0, 300),
    openGraph: sharePreview(`/portfolio/${project.slug}`, {
      url: project.cover.src,
      width: project.cover.width,
      height: project.cover.height,
      alt: project.name,
    }),
  };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getPublishedProject(params.slug);
  if (!project) notFound();

  const { stats } = copy.portfolio;
  // Only stats with a real, sourced value are shown. Nothing is ever filled with a placeholder.
  const candidates: [string, string | undefined][] = [
    [stats.category, copy.portfolio.categories[project.category]],
    [stats.location, project.location],
    [stats.squareFootage, project.squareFootage],
    [stats.buildDuration, project.buildDuration],
    [stats.completionYear, project.completionYear],
  ];
  const statRows = candidates.filter((row): row is [string, string] => Boolean(row[1]));

  return (
    <CoverStack>
      <section className="relative flex min-h-[80vh] w-full items-end overflow-hidden bg-ink text-white">
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
            src={project.cover.src}
            meta={project.cover}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
        <div className="section-x relative w-full pb-6 text-center md:pb-16 md:text-left">
          <h1 className="mx-auto max-w-[14em] font-serif text-hero font-normal md:mx-0">
            {project.name}
          </h1>
          {project.location && <p className="label mt-4">{project.location}</p>}
        </div>
      </section>

      {/* The gallery and the project facts read as one section. */}
      <div className="bg-white">
        <section className="py-section">
          <ProjectGallery
            images={project.images.filter((i) => i.src !== project.cover.src)}
            name={project.name}
          />
        </section>

        <section className="section-x pb-section">
          <Reveal className="text-center md:text-left">
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
            {project.tagline && (
              <p className="mx-auto mt-12 max-w-[32em] font-serif text-statement italic md:mx-0">
                {project.tagline}
              </p>
            )}
            <p
              className={`${project.tagline ? 'mt-6' : 'mt-12'} mx-auto max-w-text text-body md:mx-0`}
            >
              {project.description}
            </p>
            {project.credits.length > 0 && (
              <dl className="mt-10 space-y-2">
                {project.credits.map((c) => (
                  <div
                    key={`${c.role}-${c.name}`}
                    className="flex flex-wrap justify-center gap-x-3 md:justify-start"
                  >
                    <dt className="label text-ink/70">{c.role}</dt>
                    <dd className="label">{c.name}</dd>
                  </div>
                ))}
              </dl>
            )}
          </Reveal>
        </section>
      </div>
    </CoverStack>
  );
}
