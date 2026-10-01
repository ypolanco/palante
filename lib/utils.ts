export { cn } from "cn";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const compactUsd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
});

const count = new Intl.NumberFormat("en-US");

export function formatCurrency(value: number): string {
  return usd.format(value);
}

export function formatCompactCurrency(value: number): string {
  return compactUsd.format(value);
}

export function formatNumber(value: number): string {
  return count.format(value);
}

export function percentFunded(raised: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.round((raised / goal) * 100);
}

/** Formats an ISO date (YYYY-MM-DD) without timezone drift. */
export function formatDate(iso: string, opts?: { short?: boolean }): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: opts?.short ? "short" : "long",
    day: "numeric",
    year: "numeric",
  });
}
