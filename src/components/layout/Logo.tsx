import Image from 'next/image';
import Link from 'next/link';
import siteConfig from '@content/site.config';

interface LogoProps {
  tone: 'white' | 'ink';
  className?: string;
  onClick?: () => void;
}

// The Haley mark (401x313), recolored to the two palette tones at build time.
export function Logo({ tone, className = 'h-12 w-auto md:h-14', onClick }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name}, home`}
      className="inline-block"
      onClick={onClick}
    >
      <Image
        src={`/images/brand/logo-${tone}.png`}
        alt=""
        width={401}
        height={313}
        priority
        quality={90}
        className={className}
      />
    </Link>
  );
}
