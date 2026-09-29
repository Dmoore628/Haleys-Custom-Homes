'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import copy from '@content/copy.config';
import { BUDGETS, LOT_STATUSES, PROJECT_TYPES } from '@/lib/schema';
import { Button } from '@/components/ui/Button';

type FieldName =
  'name' | 'email' | 'phone' | 'projectType' | 'budget' | 'location' | 'lot' | 'message';
type Errors = Partial<Record<FieldName, string>>;

const REQUIRED: FieldName[] = ['name', 'email', 'phone', 'projectType', 'budget'];

const fieldBase =
  'w-full border-0 border-b border-ink/20 bg-transparent px-0 py-3 text-body text-ink transition-colors duration-200 ease-brand focus:border-accent focus:outline-none focus:ring-0 focus-visible:border-accent';

export function validateInquiry(values: Record<string, string>): Errors {
  const { contact } = copy;
  const errors: Errors = {};
  for (const f of REQUIRED) if (!values[f]?.trim()) errors[f] = contact.required;
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = contact.invalidEmail;
  }
  return errors;
}

/**
 * Single-step qualification form. Required fields show a small ink-colored message when left
 * empty on submit (no red). Submits to the site's own /api/contact route; while waiting the
 * button reads "Sending" and is disabled; on success the form is replaced by the confirmation.
 */
export function ContactForm() {
  const { contact } = copy;
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const found = validateInquiry(values);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <p
        role="status"
        className="font-serif text-section font-normal"
        data-testid="form-confirmation"
      >
        {contact.confirmation}
      </p>
    );
  }

  const label = (name: FieldName, optional = false) => (
    <label htmlFor={`f-${name}`} className="label block">
      {contact.fields[name]}
      {optional && (
        <span className="ml-2 normal-case tracking-normal text-ink/70">{contact.optional}</span>
      )}
    </label>
  );

  const errorFor = (name: FieldName) =>
    errors[name] ? (
      <p id={`f-${name}-error`} className="mt-2 text-[0.875rem] text-ink">
        {errors[name]}
      </p>
    ) : null;

  const aria = (name: FieldName) => ({
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `f-${name}-error` : undefined,
  });

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="relative flex flex-col gap-8"
      aria-busy={status === 'sending'}
    >
      <div>
        {label('name')}
        <input
          id={`f-name`}
          name="name"
          type="text"
          autoComplete="name"
          required
          className={fieldBase}
          {...aria('name')}
        />
        {errorFor('name')}
      </div>
      <div className="grid gap-8 md:grid-cols-2 md:gap-grid">
        <div>
          {label('email')}
          <input
            id="f-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={fieldBase}
            {...aria('email')}
          />
          {errorFor('email')}
        </div>
        <div>
          {label('phone')}
          <input
            id="f-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            className={fieldBase}
            {...aria('phone')}
          />
          {errorFor('phone')}
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2 md:gap-grid">
        <div>
          {label('projectType')}
          <select
            id="f-projectType"
            name="projectType"
            required
            defaultValue=""
            className={fieldBase}
            {...aria('projectType')}
          >
            <option value="" disabled>
              {contact.selectPrompt}
            </option>
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errorFor('projectType')}
        </div>
        <div>
          {label('budget')}
          <select
            id="f-budget"
            name="budget"
            required
            defaultValue=""
            className={fieldBase}
            {...aria('budget')}
          >
            <option value="" disabled>
              {contact.selectPrompt}
            </option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          {errorFor('budget')}
        </div>
      </div>
      <div>
        {label('location', true)}
        <input
          id="f-location"
          name="location"
          type="text"
          autoComplete="address-level2"
          className={fieldBase}
        />
      </div>
      <div>
        {label('lot', true)}
        <select id="f-lot" name="lot" defaultValue="" className={fieldBase}>
          <option value="">{contact.selectPrompt}</option>
          {LOT_STATUSES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
      <div>
        {label('message', true)}
        <textarea id="f-message" name="message" rows={4} className={`${fieldBase} resize-y`} />
      </div>
      {/* Honeypot for bots; hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="f-company">Company</label>
        <input id="f-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === 'error' && (
        <p role="alert" className="text-body text-ink">
          {contact.sendError}
        </p>
      )}
      <div>
        <Button
          type="submit"
          variant="primary"
          fullWidthMobile
          magnetic
          disabled={status === 'sending'}
        >
          {status === 'sending' ? contact.sending : contact.submit}
        </Button>
        <p className="mt-4 max-w-[30rem] text-[0.875rem] leading-relaxed text-ink/70">
          {contact.privacyNote}{' '}
          <Link
            href="/privacy"
            className="underline decoration-ink/30 underline-offset-[4px] hover:decoration-ink"
          >
            {contact.privacyLink}
          </Link>
        </p>
      </div>
    </form>
  );
}
