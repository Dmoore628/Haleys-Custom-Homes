import type { ReactNode } from 'react';

export const inputClass =
  'mt-2 block w-full rounded-[4px] border border-ink/25 bg-[#fbf9f5] px-3.5 py-3 text-[1rem] text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-ink focus:bg-[#fffdf9]';

export function Field({
  label,
  hint,
  children,
  className = '',
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`mt-5 block ${className}`}>
      <span className="label">{label}</span>
      {hint && <span className="ml-2 text-[0.8125rem] text-ink/60">{hint}</span>}
      {children}
    </label>
  );
}
