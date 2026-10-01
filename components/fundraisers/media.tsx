import Image from "next/image";
import { cn } from "@/lib/utils";

/** Uploaded previews arrive as data:/blob: URLs, which the image optimizer can't fetch. */
function isLocalUpload(src: string) {
  return src.startsWith("data:") || src.startsWith("blob:");
}

export function FundraiserCover({
  src,
  alt,
  sizes,
  priority,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-sand", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={isLocalUpload(src)}
        className="object-cover"
      />
    </div>
  );
}

const AVATAR_TONES = [
  "bg-jade text-white",
  "bg-marigold text-noche",
  "bg-noche text-white",
  "bg-bougainvillea text-white",
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export function OrganizerAvatar({
  name,
  src,
  size = "md",
  className,
}: {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const tone = AVATAR_TONES[[...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % AVATAR_TONES.length];
  const sizeClass = {
    sm: "size-8 text-xs",
    md: "size-10 text-sm",
    lg: "size-14 text-lg",
    xl: "size-20 text-2xl",
  }[size];

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-heading font-bold ring-2 ring-white",
        sizeClass,
        !src && tone,
        className,
      )}
    >
      {src ? (
        <Image src={src} alt="" fill sizes="80px" unoptimized={isLocalUpload(src)} className="object-cover" />
      ) : (
        <span aria-hidden="true">{initials(name)}</span>
      )}
    </span>
  );
}
