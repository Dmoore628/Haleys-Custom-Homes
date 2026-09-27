import Image from 'next/image';
import { getMedia } from '@/lib/content';

/**
 * A logo mark sized for optical balance rather than equal height: a wide wordmark and a
 * near-square emblem at the same height read as very different sizes, so height scales with
 * the inverse square root of the aspect ratio (equal visual area), clamped. `base` is the CSS
 * height a 3:1 mark gets.
 */
export function MarkImage({
  src,
  alt,
  base = 'clamp(40px, 4.6vw, 64px)',
  className = '',
}: {
  src: string;
  alt: string;
  base?: string;
  className?: string;
}) {
  const { width, height } = getMedia(src);
  const aspect = width / height;
  const factor = Math.min(1.5, Math.max(0.42, Math.sqrt(3 / aspect)));
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      unoptimized={src.endsWith('.svg')}
      quality={90}
      sizes="360px"
      className={`w-auto max-w-full object-contain ${className}`}
      style={{ height: `calc(${base} * ${factor.toFixed(3)})` }}
    />
  );
}
