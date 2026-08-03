import Image from "next/image";
import { cn } from "@/lib/utils";

interface GameImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * next/image optimizes raster formats but not local SVGs (would need
 * `dangerouslyAllowSVG` + a strict CSP). Since a few placeholder game
 * thumbnails are SVG gradients, render those with a plain <img> and
 * everything else through next/image.
 */
export function GameImage({ src, alt, className, sizes, priority }: GameImageProps) {
  if (src.endsWith(".svg")) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={cn("absolute inset-0 size-full object-cover", className)} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "(max-width: 768px) 50vw, 200px"}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}
