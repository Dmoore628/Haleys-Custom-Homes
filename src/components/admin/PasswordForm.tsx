'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { changePasswordAction } from '@/app/admin/actions';
import { Field, inputClass } from './ui';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="admin-btn admin-btn-primary mt-8">
      {pending ? 'Saving…' : 'Change password'}
    </button>
  );
}

export function PasswordForm() {
  const [state, action] = useFormState(changePasswordAction, null);
  return (
    <form action={action}>
      <Field label="Current password">
        <input
          name="current"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </Field>
      <Field label="New password" hint="12+ characters">
        <input
          name="next"
          type="password"
          autoComplete="new-password"
          minLength={12}
          required
          className={inputClass}
        />
      </Field>
      <Field label="Confirm new password">
        <input
          name="confirm"
          type="password"
          autoComplete="new-password"
          minLength={12}
          required
          className={inputClass}
        />
      </Field>
      {state && (
        <p
          role="status"
          className={`mt-4 text-[0.9375rem] ${state.ok ? 'text-[#2f5d3a]' : 'text-[#8a2c1d]'}`}
        >
          {state.ok ? 'Password changed.' : state.error}
        </p>
      )}
      <Submit />
    </form>
  );
}
