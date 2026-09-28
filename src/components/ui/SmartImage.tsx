import Image, { type ImageProps } from 'next/image';
import { getMedia } from '@/lib/content';
import type { MediaEntry } from '@/lib/schema';

type SmartImageProps = Omit<
  ImageProps,
  'src' | 'width' | 'height' | 'placeholder' | 'blurDataURL'
> & {
  src: string;
  /** Size and placeholder for images not in the build manifest (uploaded from the admin). */
  meta?: MediaEntry;
};

/** Every image is served at quality 85 or higher (Fixes spec item 11). */
const QUALITY = 85;

/**
 * next/image with an image-specific placeholder: a muted tone sampled from the photo
 * behind a build-time blur preview, so layout never jumps and the gap never reads as a gray box.
 */
export function SmartImage({
  src,
  fill,
  style,
  alt,
  quality = QUALITY,
  meta,
  ...rest
}: SmartImageProps) {
  const q = Math.max(QUALITY, Number(quality));
  const media = meta ?? getMedia(src);
  const placeholder = media.blurDataURL ? ('blur' as const) : ('empty' as const);
  const bg = media.color !== 'transparent' ? { backgroundColor: media.color } : {};
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        quality={q}
        placeholder={placeholder}
        blurDataURL={media.blurDataURL || undefined}
        style={{ ...bg, ...style }}
        {...rest}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={media.width}
      height={media.height}
      quality={q}
      placeholder={placeholder}
      blurDataURL={media.blurDataURL || undefined}
      style={{ ...bg, ...style }}
      {...rest}
    />
  );
}
