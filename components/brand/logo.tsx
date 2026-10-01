import Link from "next/link";
import { cn } from "@/lib/utils";

/** Forward-motion mark: two stacked chevrons stepping forward. */
export function LogoMark({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("size-8 shrink-0", className)}
    >
      <rect width="32" height="32" rx="9" fill={tone === "dark" ? "var(--noche)" : "rgba(255,255,255,0.12)"} />
      <path d="M8 9.5 14.5 16 8 22.5h4.6l6.5-6.5-6.5-6.5z" fill="var(--marigold)" />
      <path d="M15 9.5 21.5 16 15 22.5h3.2l6.5-6.5-6.5-6.5z" fill="#fff" opacity="0.9" />
    </svg>
  );
}

export function Logo({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <Link
      href="/"
      aria-label="Palante Together home"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <LogoMark tone={tone} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading text-[1.15rem] font-extrabold tracking-[-0.03em]",
            tone === "dark" ? "text-noche" : "text-white",
          )}
        >
          Palante
        </span>
        <span
          className={cn(
            "text-[0.72rem] font-medium tracking-[0.02em]",
            tone === "dark" ? "text-muted-foreground" : "text-white/70",
          )}
        >
          Together
        </span>
      </span>
    </Link>
  );
}
