/**
 * Fundraiser read service. Every page reads fundraiser data through these
 * async functions so the mock implementation can be replaced with real
 * backend calls without touching UI code.
 *
 * TODO(backend): replace mock lookups with API/database calls.
 */
import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth/session";
import {
  buildAnalytics,
  contributions,
  fundraisers,
  reports,
  users,
} from "@/lib/fundraisers/mock-data";
import type {
  Contribution,
  Fundraiser,
  FundraiserAnalytics,
  FundraiserReport,
  FundraiserStatus,
  User,
} from "@/lib/types";

export async function listFundraisers(
  opts: { status?: FundraiserStatus | FundraiserStatus[] } = {},
): Promise<Fundraiser[]> {
  const statuses = opts.status === undefined ? null : [opts.status].flat();
  return fundraisers.filter((f) => !statuses || statuses.includes(f.status));
}

/** Publicly visible fundraisers: active and ended (drafts and suspended pages are hidden). */
export async function listPublicFundraisers(): Promise<Fundraiser[]> {
  return listFundraisers({ status: ["active", "ended"] });
}

export async function getFundraiserBySlug(slug: string): Promise<Fundraiser | undefined> {
  return fundraisers.find((f) => f.slug === slug);
}

export async function getFundraiserById(id: string): Promise<Fundraiser | undefined> {
  return fundraisers.find((f) => f.id === id);
}

export async function listFundraisersByOrganizer(userId: string): Promise<Fundraiser[]> {
  return fundraisers
    .filter((f) => f.organizerId === userId)
    .sort((a, b) => b.createdOn.localeCompare(a.createdOn));
}

export async function getUser(id: string): Promise<User | undefined> {
  return users.find((u) => u.id === id);
}

export async function listOrganizers(): Promise<User[]> {
  const ids = new Set(fundraisers.map((f) => f.organizerId));
  return users.filter((u) => ids.has(u.id));
}

/**
 * The signed-in user, resolved from the session cookie. Redirects to sign-in
 * when there is no valid session.
 */
export async function getCurrentUser(): Promise<User> {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in");
  return user;
}

/** The signed-in user, or undefined when signed out. */
export async function getSessionUser(): Promise<User | undefined> {
  const userId = await getSessionUserId();
  return userId ? users.find((u) => u.id === userId) : undefined;
}

/** Demo credential check: any known mock email signs in. */
export async function findUserByEmail(email: string): Promise<User | undefined> {
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === normalized);
}

export async function listRecentContributions(
  fundraiserId?: string,
  limit = 10,
): Promise<Contribution[]> {
  return contributions
    .filter((c) => !fundraiserId || c.attribution.fundraiserId === fundraiserId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export async function getFundraiserAnalytics(
  fundraiserId: string,
): Promise<FundraiserAnalytics | undefined> {
  const fundraiser = fundraisers.find((f) => f.id === fundraiserId);
  return fundraiser ? buildAnalytics(fundraiser) : undefined;
}

export async function listReports(): Promise<FundraiserReport[]> {
  return [...reports].sort((a, b) => b.reportedOn.localeCompare(a.reportedOn));
}

/** Fundraiser + organizer pairs, the shape most list views need. */
export async function withOrganizers(
  list: Fundraiser[],
): Promise<Array<{ fundraiser: Fundraiser; organizer: User | undefined }>> {
  return Promise.all(
    list.map(async (fundraiser) => ({
      fundraiser,
      organizer: await getUser(fundraiser.organizerId),
    })),
  );
}

/** Campaign-wide analytics: every public fundraiser's analytics, summed. */
export async function getCampaignAnalytics(): Promise<FundraiserAnalytics> {
  const list = fundraisers.filter((f) => f.status === "active" || f.status === "ended");
  const all = list.map(buildAnalytics);

  const sources = new Map<string, FundraiserAnalytics["referralSources"][number]>();
  const days = new Map<string, FundraiserAnalytics["timeline"][number]>();
  for (const a of all) {
    for (const s of a.referralSources) {
      const prev = sources.get(s.channel);
      sources.set(s.channel, prev
        ? { ...prev, visits: prev.visits + s.visits, contributions: prev.contributions + s.contributions, raised: prev.raised + s.raised }
        : { ...s });
    }
    for (const p of a.timeline) {
      const prev = days.get(p.date);
      days.set(p.date, prev
        ? { date: p.date, views: prev.views + p.views, contributions: prev.contributions + p.contributions, raised: prev.raised + p.raised }
        : { ...p });
    }
  }

  const totalRaised = all.reduce((s, a) => s + a.totalRaised, 0);
  const contributors = all.reduce((s, a) => s + a.contributors, 0);
  const pageViews = all.reduce((s, a) => s + a.pageViews, 0);
  const timeline = [...days.values()].sort((a, b) => a.date.localeCompare(b.date)).slice(-30);

  return {
    fundraiserId: "all",
    totalRaised,
    contributors,
    averageContribution: contributors ? totalRaised / contributors : 0,
    pageViews,
    conversionRate: pageViews ? contributors / pageViews : 0,
    shares: all.reduce((s, a) => s + a.shares, 0),
    referralSources: [...sources.values()].sort((a, b) => b.raised - a.raised),
    timeline,
  };
}
