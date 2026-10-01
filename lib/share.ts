import type { ReferralChannel, ShareChannel, ShareEvent } from "@/lib/types";
import { fundraiserPath } from "@/lib/fundraisers/utils";

const REF_PARAM = "ref";

/** Share URLs carry `?ref=<channel>` so contributions can be attributed to the share. */
export function buildShareUrl(origin: string, slug: string, channel?: ShareChannel): string {
  const url = new URL(fundraiserPath(slug), origin || "http://localhost");
  if (channel && channel !== "copy_link" && channel !== "native") {
    url.searchParams.set(REF_PARAM, channel);
  }
  return origin ? url.toString() : `${url.pathname}${url.search}`;
}

export function shareTargets({
  origin,
  slug,
  message,
  title,
}: {
  origin: string;
  slug: string;
  message: string;
  title: string;
}) {
  const link = (c: ShareChannel) => buildShareUrl(origin, slug, c);
  const enc = encodeURIComponent;
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(link("facebook"))}`,
    x: `https://x.com/intent/post?text=${enc(message)}&url=${enc(link("x"))}`,
    email: `mailto:?subject=${enc(title)}&body=${enc(`${message}\n\n${link("email")}`)}`,
    sms: `sms:?&body=${enc(`${message} ${link("sms")}`)}`,
  };
}

const KNOWN: ReferralChannel[] = ["direct", "facebook", "instagram", "x", "email", "sms"];

/** Reads the referral channel from a query string (`?ref=` or `?utm_source=`). */
export function referralChannelFrom(search: string): ReferralChannel {
  const params = new URLSearchParams(search);
  const raw = (params.get(REF_PARAM) ?? params.get("utm_source") ?? "").toLowerCase();
  if (!raw) return "direct";
  if (raw === "twitter") return "x";
  if (raw === "text") return "sms";
  return (KNOWN as string[]).includes(raw) ? (raw as ReferralChannel) : "other";
}

/**
 * Records that a fundraiser was shared.
 * TODO(analytics): POST to the analytics backend.
 */
export async function trackShareEvent(
  fundraiserId: string,
  channel: ShareChannel,
): Promise<ShareEvent> {
  return {
    id: `share-${Date.now().toString(36)}`,
    fundraiserId,
    channel,
    createdAt: new Date().toISOString(),
  };
}
