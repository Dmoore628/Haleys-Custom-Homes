import type { ReactNode } from 'react';

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`label ${className}`}>{children}</p>;
}
