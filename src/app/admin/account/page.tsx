import { redirect } from 'next/navigation';
import { currentAdmin } from '@/lib/auth/admin';
import { PasswordForm } from '@/components/admin/PasswordForm';

export default async function AccountPage() {
  const admin = await currentAdmin();
  if (!admin) redirect('/admin/login');
  return (
    <div className="max-w-md">
      <h1 className="font-serif text-[2.25rem] leading-tight">Account</h1>
      <p className="mt-2 text-[0.9375rem] text-ink/75">Signed in as {admin.email}.</p>
      <h2 className="label mt-10">Change password</h2>
      <PasswordForm />
    </div>
  );
}
