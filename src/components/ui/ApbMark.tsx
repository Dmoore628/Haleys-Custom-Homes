import copy from '@content/copy.config';

/**
 * The APB System™ lockup: the monogram set in the serif inside a fine rule, beside the full
 * name, like a stamp on a drawing set. Used wherever the system leads a section; `tone="light"`
 * for dark surfaces.
 */
export function ApbMark({
  className = '',
  tone = 'dark',
}: {
  className?: string;
  tone?: 'dark' | 'light';
}) {
  const { monogram, name } = copy.apb;
  const light = tone === 'light';
  return (
    <p className={`flex items-center gap-4 ${className}`}>
      <span
        className={`inline-flex items-center border px-2.5 pb-[0.3rem] pt-[0.4rem] font-serif text-[1.375rem] leading-none tracking-[0.14em] ${
          light ? 'border-white/60 text-white' : 'border-ink/60 text-ink'
        }`}
        aria-hidden="true"
      >
        {monogram}
      </span>
      <span
        className={`label max-w-[15rem] leading-snug ${light ? 'text-white/75' : 'text-ink/70'}`}
      >
        {name}
      </span>
    </p>
  );
}
