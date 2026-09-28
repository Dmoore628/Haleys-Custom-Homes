import { redirect } from 'next/navigation';
import { hasDatabase } from '@/lib/db';
import { ProjectEditor } from '@/components/admin/ProjectEditor';

export default function NewProjectPage() {
  if (!hasDatabase()) redirect('/admin');
  return <ProjectEditor />;
}
