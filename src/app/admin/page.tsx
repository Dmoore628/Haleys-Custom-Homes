import Link from 'next/link';
import { hasDatabase } from '@/lib/db';
import { listAllProjects } from '@/lib/projects/repo';
import { ProjectList } from '@/components/admin/ProjectList';

export default async function AdminHome() {
  const projects = await listAllProjects();
  const connected = hasDatabase();
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-[2.25rem] leading-tight">Portfolio</h1>
          <p className="mt-2 text-[0.9375rem] text-ink/75">
            {projects.filter((p) => p.published).length} published ·{' '}
            {projects.filter((p) => !p.published).length} drafts. Drag to reorder; the order here is
            the order on the site.
          </p>
        </div>
        {connected && (
          <Link href="/admin/projects/new" className="admin-btn admin-btn-primary">
            + New project
          </Link>
        )}
      </div>
      {!connected && (
        <p className="mt-6 rounded-[4px] border border-accent/40 bg-accent/10 p-4 text-[0.9375rem]">
          Read-only: no database is connected, so this lists content/projects.json. See
          docs/ADMIN.md.
        </p>
      )}
      <ProjectList initial={projects} editable={connected} />
    </div>
  );
}
