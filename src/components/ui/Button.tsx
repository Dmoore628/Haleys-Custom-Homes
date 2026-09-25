import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type Variant = 'primary' | 'ghost';
/** `dark` = the button sits on a dark surface (video, image overlay, ink footer). Same variant, inverted tones. */
type Surface = 'light' | 'dark';

interface CommonProps {
  variant: Variant;
  surface?: Surface;
  fullWidthMobile?: boolean;
  className?: string;
  children: ReactNode;
}

function classes({ variant, surface = 'light', fullWidthMobile, className }: Omit<CommonProps, 'children'>) {
  const base =
    'group relative inline-flex items-center justify-center overflow-hidden rounded-btn px-7 py-4 font-sans text-label uppercase select-none disabled:pointer-events-none';
  const width = fullWidthMobile ? 'w-full md:w-auto' : '';
  if (variant === 'primary') {
    const tone = surface === 'dark' ? 'bg-ink text-bone' : 'bg-ink text-bone';
    return [base, tone, width, className].filter(Boolean).join(' ');
  }
  const tone =
    surface === 'dark' ? 'border border-bone text-bone' : 'border border-ink text-ink';
  return [base, tone, width, className].filter(Boolean).join(' ');
}

/**
 * Primary: a lighter (accent) layer sweeps in from the left, scaleX 0 to 1, 300ms.
 * Ghost: fills to 10% ink opacity (10% bone on dark surfaces), 200ms.
 */
function Layers({ variant, surface = 'light' }: { variant: Variant; surface?: Surface }) {
  if (variant === 'primary') {
    return (
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-300 ease-brand group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`absolute inset-0 opacity-0 transition-opacity duration-200 ease-brand group-hover:opacity-10 group-focus-visible:opacity-10 ${
        surface === 'dark' ? 'bg-bone' : 'bg-ink'
      }`}
    />
  );
}

type LinkButtonProps = CommonProps & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    'href' | 'className' | 'children'
  >;

export function ButtonLink({ variant, surface, fullWidthMobile, className, children, href, ...rest }: LinkButtonProps) {
  return (
    <Link href={href} className={classes({ variant, surface, fullWidthMobile, className })} {...rest}>
      <Layers variant={variant} surface={surface} />
      <span className="relative">{children}</span>
    </Link>
  );
}

type NativeButtonProps = CommonProps &
  Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'>;

export function Button({ variant, surface, fullWidthMobile, className, children, type = 'button', ...rest }: NativeButtonProps) {
  return (
    <button type={type} className={classes({ variant, surface, fullWidthMobile, className })} {...rest}>
      <Layers variant={variant} surface={surface} />
      <span className="relative">{children}</span>
    </button>
  );
}
