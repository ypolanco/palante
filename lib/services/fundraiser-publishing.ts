/**
 * Fundraiser create/update boundary.
 *
 * TODO(backend): replace with authenticated API calls. Until then, published
 * fundraisers are kept in this browser's localStorage so the preview can
 * show the full create → share → view loop. Nothing leaves the device.
 */
import { DEFAULT_SHARE_MESSAGE, MOCK_TODAY, slugify } from "@/lib/fundraisers/utils";
import type { Fundraiser, User } from "@/lib/types";

export interface FundraiserInput {
  title: string;
  goal: number;
  endsOn: string | null;
  story: string;
  coverImage: string | null;
  coverImageAlt: string;
  /** Optional organizer photo for this fundraiser (data URL in the preview). */
  profileImage: string | null;
  shareMessage: string;
}

export const DEFAULT_COVER = "/fundraisers/community-for-change.svg";

const STORAGE_KEY = "palante:fundraisers";

/** Raw stored value; a stable string, so it is safe as a useSyncExternalStore snapshot. */
export function readLocalSnapshot(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function parse(raw: string): Fundraiser[] {
  try {
    return raw ? (JSON.parse(raw) as Fundraiser[]) : [];
  } catch {
    return [];
  }
}

function readAll(): Fundraiser[] {
  return parse(readLocalSnapshot());
}

function writeAll(list: Fundraiser[]): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

/** First paragraph of the story, stripped of formatting, for cards and previews. */
export function summarize(story: string): string {
  const first =
    story.split(/\n\s*\n/).find((p) => p.trim() && !p.trim().startsWith("- ")) ?? "";
  const plain = first.replace(/[*_]/g, "").replace(/\s+/g, " ").trim();
  return plain.length > 160 ? `${plain.slice(0, 157).trimEnd()}…` : plain;
}

/** Builds the Fundraiser the public page would show; also powers the wizard preview. */
export function draftToFundraiser(
  input: FundraiserInput,
  organizer: User,
  overrides: Partial<Fundraiser> = {},
): Fundraiser {
  const slug = slugify(input.title) || "untitled-fundraiser";
  return {
    id: `local-${slug}`,
    slug,
    title: input.title || "Untitled fundraiser",
    organizerId: organizer.id,
    organizerPhoto: input.profileImage,
    summary: summarize(input.story),
    story: input.story,
    coverImage: input.coverImage ?? DEFAULT_COVER,
    coverImageAlt: input.coverImageAlt || "Fundraiser cover image",
    goal: input.goal,
    raised: 0,
    contributorCount: 0,
    pageViews: 0,
    shareCount: 0,
    createdOn: MOCK_TODAY,
    launchedOn: MOCK_TODAY,
    endsOn: input.endsOn,
    status: "active",
    shareMessage: input.shareMessage || DEFAULT_SHARE_MESSAGE,
    momentum: 0,
    updates: [],
    ...overrides,
  };
}

export interface PublishResult {
  fundraiser: Fundraiser;
  /** False when the browser refused to store the preview copy. */
  savedLocally: boolean;
}

export async function publishFundraiser(
  input: FundraiserInput,
  organizer: User,
  reservedSlugs: string[] = [],
): Promise<PublishResult> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const existing = readAll();
  const draft = draftToFundraiser(input, organizer);
  const taken = new Set([...reservedSlugs, ...existing.map((f) => f.slug)]);
  let slug = draft.slug;
  for (let n = 2; taken.has(slug); n++) slug = `${draft.slug}-${n}`;
  let fundraiser: Fundraiser = { ...draft, slug, id: `local-${slug}` };

  let savedLocally = writeAll([...existing, fundraiser]);
  if (!savedLocally) {
    // Large image uploads can exceed storage quota; keep the page with defaults.
    fundraiser = { ...fundraiser, coverImage: DEFAULT_COVER, organizerPhoto: null };
    savedLocally = writeAll([...existing, fundraiser]);
  }
  return { fundraiser, savedLocally };
}

export interface UpdateResult {
  /** False for mock fundraisers, which are read-only until a backend exists. */
  saved: boolean;
}

export async function updateFundraiser(id: string, input: FundraiserInput): Promise<UpdateResult> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const list = readAll();
  const index = list.findIndex((f) => f.id === id);
  if (index === -1) return { saved: false };
  list[index] = {
    ...list[index],
    title: input.title,
    goal: input.goal,
    endsOn: input.endsOn,
    story: input.story,
    summary: summarize(input.story),
    coverImage: input.coverImage ?? list[index].coverImage,
    organizerPhoto: input.profileImage ?? list[index].organizerPhoto,
    shareMessage: input.shareMessage,
  };
  return { saved: writeAll(list) };
}

export function findLocalFundraiser(snapshot: string, slug: string): Fundraiser | null {
  return parse(snapshot).find((f) => f.slug === slug) ?? null;
}

/**
 * Admin moderation: change a fundraiser's status (e.g. suspend after a report).
 * TODO(backend): authenticated admin API call; record who changed it and why.
 */
export async function updateFundraiserStatus(
  id: string,
  status: Fundraiser["status"],
): Promise<{ saved: boolean; id: string; status: Fundraiser["status"] }> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { saved: false, id, status };
}
