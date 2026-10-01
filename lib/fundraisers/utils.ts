import type { Fundraiser, FundraiserStatus, ReferralChannel } from "@/lib/types";

/**
 * Fixed reference "now" for the preview so server and client renders agree.
 * TODO(backend): use real timestamps once data is live.
 */
export const MOCK_TODAY = "2026-10-01";
export const MOCK_NOW = "2026-10-01T16:00:00Z";

export const DEFAULT_SHARE_MESSAGE =
  "I'm raising money with Palante Together. Help us reach our goal.";

export const REFERRAL_LABELS: Record<ReferralChannel, string> = {
  direct: "Direct",
  facebook: "Facebook",
  instagram: "Instagram",
  x: "X",
  email: "Email",
  sms: "Text Message",
  other: "Other",
};

export const STATUS_LABELS: Record<FundraiserStatus, string> = {
  draft: "Draft",
  active: "Active",
  ended: "Ended",
  suspended: "Suspended",
};

export function fundraiserPath(slug: string): string {
  return `/fundraisers/${slug}`;
}

/** Whole days until the end date, or null for open-ended or finished fundraisers. */
export function daysRemaining(
  f: Pick<Fundraiser, "endsOn" | "status">,
  today = MOCK_TODAY,
): number | null {
  if (!f.endsOn || f.status !== "active") return null;
  const diff = Math.round((Date.parse(f.endsOn) - Date.parse(today)) / 86_400_000);
  return Math.max(0, diff);
}

export function relativeTime(iso: string, now = MOCK_NOW): string {
  const minutes = Math.max(0, Math.round((Date.parse(now) - Date.parse(iso)) / 60_000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "1 day ago" : `${days} days ago`;
}

/** 0.0327 → "3.3%" */
export function formatRate(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
