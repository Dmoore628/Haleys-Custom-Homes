'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { signInAction } from '@/app/admin/actions';
import { Field, inputClass } from './ui';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="admin-btn admin-btn-primary mt-8 w-full">
      {pending ? 'Signing in…' : 'Sign in'}
    </button>
  );
}

export function LoginForm({ next }: { next: string }) {
  const [state, action] = useFormState(signInAction, null);
  return (
    <form action={action} className="mt-8">
      <input type="hidden" name="next" value={next} />
      <Field label="Email">
        <input name="email" type="email" autoComplete="username" required className={inputClass} />
      </Field>
      <Field label="Password">
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </Field>
      {state && !state.ok && (
        <p role="alert" className="mt-4 text-[0.9375rem] text-[#8a2c1d]">
          {state.error}
        </p>
      )}
      <Submit />
    </form>
  );
}
