import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/projects/repo';
import { ProjectEditor } from '@/components/admin/ProjectEditor';

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  if (!/^\d+$/.test(params.id)) notFound();
  const project = await getProjectById(params.id);
  if (!project) notFound();
  return <ProjectEditor key={project.updatedAt} project={project} />;
}
