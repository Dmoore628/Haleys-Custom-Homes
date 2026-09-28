import { hasDatabase } from '@/lib/db';
import { LoginForm } from '@/components/admin/LoginForm';

export default function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  return (
    <div className="mx-auto max-w-sm pt-6 md:pt-16">
      <h1 className="font-serif text-[2.25rem] leading-tight">Sign in</h1>
      <p className="mt-3 text-[0.9375rem] text-ink/75">Manage the projects in the portfolio.</p>
      {!hasDatabase() && (
        <p className="mt-6 rounded-[4px] border border-accent/40 bg-accent/10 p-4 text-[0.9375rem]">
          No database is connected yet, so the admin can’t sign anyone in. docs/ADMIN.md explains
          the two-minute setup.
        </p>
      )}
      <LoginForm next={searchParams.next ?? ''} />
    </div>
  );
}
