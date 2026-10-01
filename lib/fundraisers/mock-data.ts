/**
 * Development mock data for peer-to-peer fundraising. Every person,
 * fundraiser, and figure here is fictional. Only lib/services/* should
 * import this file, so swapping in a real backend touches one layer.
 */
import type {
  AnalyticsTimelinePoint,
  Contribution,
  Fundraiser,
  FundraiserAnalytics,
  FundraiserReport,
  ReferralChannel,
  ReferralSource,
  User,
} from "@/lib/types";
import { COMMITTEE } from "@/lib/mock-data";
import { DEFAULT_SHARE_MESSAGE, MOCK_NOW, MOCK_TODAY, REFERRAL_LABELS } from "@/lib/fundraisers/utils";

export const users: User[] = [
  { id: "u-maria", name: "Maria Delgado", firstName: "Maria", email: "maria@example.com", location: "Durham, NC", bio: "Community organizer, mom of two, and lifelong believer that our neighborhood's voice matters.", role: "supporter", joinedOn: "2026-05-14" },
  { id: "u-jamal", name: "Jamal Carter", firstName: "Jamal", email: "jamal@example.com", location: "Philadelphia, PA", bio: "Block captain in West Philly.", role: "supporter", joinedOn: "2026-04-02" },
  { id: "u-rosa", name: "Rosa Martinez", firstName: "Rosa", email: "rosa@example.com", location: "San Antonio, TX", role: "supporter", joinedOn: "2026-06-20" },
  { id: "u-dana", name: "Dana Whitfield", firstName: "Dana", email: "dana@example.com", location: "Columbus, OH", bio: "High school civics teacher.", role: "supporter", joinedOn: "2026-03-09" },
  { id: "u-luis", name: "Luis Ortega", firstName: "Luis", email: "luis@example.com", location: "Bronx, NY", role: "supporter", joinedOn: "2026-09-18" },
  { id: "u-priya", name: "Priya Nair", firstName: "Priya", email: "priya@example.com", location: "Atlanta, GA", bio: "First in my family to go to college.", role: "supporter", joinedOn: "2026-07-01" },
  { id: "u-tomas", name: "Tomás Reyes", firstName: "Tomás", email: "tomas@example.com", location: "Phoenix, AZ", role: "supporter", joinedOn: "2026-09-22" },
  { id: "u-keisha", name: "Keisha Brown", firstName: "Keisha", email: "keisha@example.com", location: "Milwaukee, WI", bio: "ICU nurse.", role: "supporter", joinedOn: "2026-05-30" },
  { id: "u-hank", name: "Hank Olsen", firstName: "Hank", email: "hank@example.com", location: "Grand Rapids, MI", role: "supporter", joinedOn: "2026-02-11" },
  { id: "u-admin", name: "Sam Okafor", firstName: "Sam", email: "sam@example.com", role: "admin", joinedOn: "2026-01-05" },
];

const MARIA_STORY = `My kids are growing up in a neighborhood that too often gets overlooked when big decisions are made. I started this fundraiser because I believe **change starts with people who show up for each other**.

Every dollar raised here goes directly to Palante Together to support independent, people-powered political work. I don't touch the money. I just want to help our community be part of it.

Here's what I hope we can do together:

- Show that everyday families care about the future of our community
- Bring more neighbors into civic life, especially first-time voters
- Prove that small contributions add up when we move together

Thank you for being part of this. *Palante, siempre.*`;

type Seed = Omit<Fundraiser, "updates" | "story" | "coverImageAlt" | "shareMessage"> & {
  story?: string;
  coverImageAlt?: string;
  shareMessage?: string;
  updates?: Array<{ postedOn: string; title: string; body: string }>;
};

const seeds: Seed[] = [
  {
    id: "f-001", slug: "marias-community-for-change", title: "Maria's Community for Change", organizerId: "u-maria",
    summary: "Neighbors in Durham coming together to power independent, people-first political work.",
    story: MARIA_STORY, coverImage: "/fundraisers/community-for-change.svg",
    goal: 5000, raised: 3750, contributorCount: 42, pageViews: 1284, shareCount: 67,
    createdOn: "2026-08-28", launchedOn: "2026-08-30", endsOn: "2026-11-02", status: "active", momentum: 84,
    shareMessage: "I'm raising money with Palante Together for our Durham community. Every bit helps us reach our goal!",
    updates: [
      { postedOn: "2026-09-27", title: "75% of the way there!", body: "We just passed $3,700 thanks to 42 of you. Can we close the gap before November? Share this page with one friend today." },
      { postedOn: "2026-09-12", title: "Halfway!", body: "I'm so grateful. Our block party table brought in eleven new contributors in a single afternoon." },
      { postedOn: "2026-08-30", title: "We're live", body: "Thank you for being here on day one. Let's show what our community can do." },
    ],
  },
  {
    id: "f-002", slug: "block-by-block-philly", title: "Block by Block Philly", organizerId: "u-jamal",
    summary: "West Philly block captains raising together so every corner of our city is heard.",
    coverImage: "/fundraisers/block-by-block.svg",
    goal: 10000, raised: 8920, contributorCount: 118, pageViews: 3410, shareCount: 140,
    createdOn: "2026-08-10", launchedOn: "2026-08-12", endsOn: "2026-10-20", status: "active", momentum: 96,
    updates: [{ postedOn: "2026-09-25", title: "Almost 9K!", body: "Our Saturday canvass crew shared this page on every block. It's working." }],
  },
  {
    id: "f-003", slug: "abuela-said-vote", title: "Because Abuela Said Vote", organizerId: "u-rosa",
    summary: "Honoring my grandmother's lesson that showing up is how we take care of each other.",
    coverImage: "/fundraisers/abuela-said-vote.svg",
    goal: 2500, raised: 2310, contributorCount: 51, pageViews: 1490, shareCount: 58,
    createdOn: "2026-09-01", launchedOn: "2026-09-02", endsOn: "2026-10-15", status: "active", momentum: 78,
  },
  {
    id: "f-004", slug: "teachers-for-turnout", title: "Teachers for Turnout", organizerId: "u-dana",
    summary: "Educators raising money for civic engagement work that reaches young people where they are.",
    coverImage: "/fundraisers/teachers-for-turnout.svg",
    goal: 15000, raised: 12450, contributorCount: 134, pageViews: 4720, shareCount: 205,
    createdOn: "2026-07-18", launchedOn: "2026-07-20", endsOn: "2026-11-01", status: "active", momentum: 88,
  },
  {
    id: "f-005", slug: "bodega-bulletin-board", title: "The Bodega Bulletin Board", organizerId: "u-luis",
    summary: "From the corner store counter to the whole Bronx: small contributions, big neighborhood energy.",
    coverImage: "/fundraisers/bodega-bulletin.svg",
    goal: 3000, raised: 640, contributorCount: 14, pageViews: 402, shareCount: 21,
    createdOn: "2026-09-24", launchedOn: "2026-09-25", endsOn: null, status: "active", momentum: 62,
  },
  {
    id: "f-006", slug: "first-gen-forward", title: "First Gen Forward", organizerId: "u-priya",
    summary: "First-generation students and alumni raising together for a more inclusive democracy.",
    coverImage: "/fundraisers/first-gen-forward.svg",
    goal: 7500, raised: 4890, contributorCount: 77, pageViews: 2210, shareCount: 96,
    createdOn: "2026-08-20", launchedOn: "2026-08-21", endsOn: "2026-11-03", status: "active", momentum: 71,
  },
  {
    id: "f-007", slug: "riverside-rising", title: "Riverside Rising", organizerId: "u-tomas",
    summary: "A riverside neighborhood in Phoenix getting organized and raising its voice together.",
    coverImage: "/fundraisers/riverside-rising.svg",
    goal: 4000, raised: 1320, contributorCount: 29, pageViews: 690, shareCount: 33,
    createdOn: "2026-09-27", launchedOn: "2026-09-28", endsOn: "2026-11-03", status: "active", momentum: 80,
  },
  {
    id: "f-008", slug: "nurses-who-vote", title: "Nurses Who Vote", organizerId: "u-keisha",
    summary: "We care for our communities on every shift. This is how we care for them at the ballot box too.",
    coverImage: "/fundraisers/nurses-who-vote.svg",
    goal: 6000, raised: 5640, contributorCount: 96, pageViews: 2650, shareCount: 112,
    createdOn: "2026-08-05", launchedOn: "2026-08-06", endsOn: "2026-10-31", status: "active", momentum: 74,
  },
  {
    id: "f-009", slug: "small-towns-big-voices", title: "Small Towns, Big Voices", organizerId: "u-hank",
    summary: "Rural Michigan neighbors proving that small towns have a lot to say.",
    coverImage: "/fundraisers/small-towns-big-voices.svg",
    goal: 3500, raised: 3610, contributorCount: 63, pageViews: 1830, shareCount: 74,
    createdOn: "2026-06-01", launchedOn: "2026-06-03", endsOn: "2026-09-15", status: "ended", momentum: 10,
  },
  {
    id: "f-010", slug: "marias-spring-kickoff", title: "Maria's Spring Kickoff", organizerId: "u-maria",
    summary: "My first fundraiser with Palante Together, kicking off the season with neighbors.",
    coverImage: "/fundraisers/community-for-change.svg",
    goal: 2000, raised: 2180, contributorCount: 37, pageViews: 960, shareCount: 41,
    createdOn: "2026-05-15", launchedOn: "2026-05-16", endsOn: "2026-07-01", status: "ended", momentum: 5,
  },
  {
    id: "f-011", slug: "marias-holiday-push", title: "Maria's Holiday Push", organizerId: "u-maria",
    summary: "A year-end push with friends and family.",
    coverImage: "/fundraisers/community-for-change.svg",
    goal: 2500, raised: 0, contributorCount: 0, pageViews: 0, shareCount: 0,
    createdOn: "2026-09-29", launchedOn: null, endsOn: "2026-12-31", status: "draft", momentum: 0,
  },
];

function defaultStory(seed: Seed): string {
  const organizer = users.find((u) => u.id === seed.organizerId);
  return `${seed.summary}\n\nI'm raising money with Palante Together because I believe our communities are stronger when we act together. Contributions made through this page go directly to Palante Together, and I'm grateful for every one of them.\n\n- Share this page with someone who cares\n- Contribute what feels right\n- Follow along for updates\n\nThank you,\n${organizer?.firstName ?? ""}`;
}

export const fundraisers: Fundraiser[] = seeds.map((seed) => ({
  ...seed,
  story: seed.story ?? defaultStory(seed),
  coverImageAlt: seed.coverImageAlt ?? "Illustration of neighbors standing together",
  shareMessage: seed.shareMessage ?? DEFAULT_SHARE_MESSAGE,
  updates: (seed.updates ?? []).map((u, i) => ({ ...u, id: `${seed.id}-up-${i + 1}`, fundraiserId: seed.id })),
}));

/* ----------------------------- Deterministic generators ----------------------------- */

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32: small seeded PRNG so mock figures are stable across renders. */
function rng(seed: string) {
  let a = hash(seed);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Splits an integer total across weights so the parts sum exactly to the total. */
function distribute(total: number, weights: number[]): number[] {
  const sum = weights.reduce((s, w) => s + w, 0) || 1;
  const raw = weights.map((w) => (w / sum) * total);
  const parts = raw.map(Math.floor);
  let remainder = total - parts.reduce((s, p) => s + p, 0);
  const order = raw.map((r, i) => [r - Math.floor(r), i] as const).sort((a, b) => b[0] - a[0]);
  for (const [, i] of order) {
    if (remainder <= 0) break;
    parts[i] += 1;
    remainder -= 1;
  }
  return parts;
}

function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/* ----------------------------------- Contributions ---------------------------------- */

const NAMES = ["Marisol R.", "Devon K.", "Ana P.", "Chris L.", "Fatima S.", "José M.", "Grace W.", "Andre T.", "Lena H.", "Omar B.", "Beth C.", "Kenji T.", "Yolanda G.", "Sean D."];
const AMOUNTS = [10, 25, 25, 50, 50, 100, 25, 250, 50, 10];
const MESSAGES = [
  "So proud of you for doing this!",
  "Palante! Let's go.",
  "For our neighborhood.",
  "Happy to chip in. Keep it up!",
  "My mom would have loved this.",
  "Sharing with my whole group chat.",
];
const CHANNELS: ReferralChannel[] = ["direct", "facebook", "instagram", "x", "email", "sms"];

export const contributions: Contribution[] = fundraisers.flatMap((f) => {
  if (f.contributorCount === 0) return [];
  const rand = rng(`contrib-${f.id}`);
  const count = Math.min(f.contributorCount, 12);
  const end = f.status === "ended" && f.endsOn ? `${f.endsOn}T18:00:00Z` : MOCK_NOW;
  let at = Date.parse(end);
  return Array.from({ length: count }, (_, i): Contribution => {
    at -= Math.round((20 + rand() * 600) * 60_000);
    const anonymous = rand() < 0.15;
    const hasMessage = rand() < 0.45;
    return {
      id: `${f.id}-c-${i + 1}`,
      amount: AMOUNTS[Math.floor(rand() * AMOUNTS.length)],
      createdAt: new Date(at).toISOString(),
      displayName: anonymous ? null : NAMES[Math.floor(rand() * NAMES.length)],
      message: hasMessage ? MESSAGES[Math.floor(rand() * MESSAGES.length)] : undefined,
      status: "succeeded",
      recipient: COMMITTEE.name,
      attribution: {
        fundraiserId: f.id,
        referralChannel: CHANNELS[Math.floor(rand() * CHANNELS.length)],
        landingPath: `/fundraisers/${f.slug}`,
      },
    };
  });
});

/* ------------------------------------- Analytics ------------------------------------ */

type TrackedChannel = Exclude<ReferralChannel, "other">;

const BASE_WEIGHTS: Record<TrackedChannel, number> = {
  direct: 0.24, facebook: 0.22, instagram: 0.14, x: 0.06, email: 0.14, sms: 0.2,
};

// Text and email tend to convert better than social feeds; skew contributions that way.
const CONVERT_BOOST: Record<TrackedChannel, number> = {
  sms: 1.6, email: 1.4, direct: 1.1, facebook: 0.9, instagram: 0.7, x: 0.6,
};

export function buildAnalytics(f: Fundraiser): FundraiserAnalytics {
  const rand = rng(`analytics-${f.id}`);
  const channels = Object.keys(BASE_WEIGHTS) as TrackedChannel[];
  const visitWeights = channels.map((c) => BASE_WEIGHTS[c] * (0.6 + rand() * 0.8));
  const contribWeights = channels.map((c, i) => visitWeights[i] * CONVERT_BOOST[c]);

  const visits = distribute(f.pageViews, visitWeights);
  const contribs = distribute(f.contributorCount, contribWeights);
  const raised = distribute(f.raised, contribWeights);

  const referralSources: ReferralSource[] = channels
    .map((channel, i) => ({ channel, label: REFERRAL_LABELS[channel], visits: visits[i], contributions: contribs[i], raised: raised[i] }))
    .sort((a, b) => b.raised - a.raised);

  const start = f.launchedOn ?? f.createdOn;
  const last = f.status === "ended" && f.endsOn && f.endsOn < MOCK_TODAY ? f.endsOn : MOCK_TODAY;
  const totalDays = Math.max(1, Math.round((Date.parse(last) - Date.parse(start)) / 86_400_000) + 1);
  const days = Math.min(totalDays, 30);
  const firstDay = addDays(last, -(days - 1));

  // Launch spike, then a gentle ramp toward the present, with daily noise.
  const dayWeights = Array.from({ length: days }, (_, i) => {
    const sinceLaunch = Math.round((Date.parse(addDays(firstDay, i)) - Date.parse(start)) / 86_400_000);
    const launchSpike = sinceLaunch < 2 ? 2.2 : 1;
    return (0.4 + rand()) * (0.7 + i / days) * launchSpike;
  });

  // The chart window may not cover every day since launch, so scale totals to it.
  const windowShare = Math.min(1, (days / totalDays) * 1.15);
  const dv = distribute(Math.round(f.pageViews * windowShare), dayWeights);
  const dc = distribute(Math.round(f.contributorCount * windowShare), dayWeights.map((w) => w * (0.7 + rand() * 0.6)));
  const dr = distribute(Math.round(f.raised * windowShare), dc.map((c) => c + 0.01));

  const timeline: AnalyticsTimelinePoint[] = dayWeights.map((_, i) => ({
    date: addDays(firstDay, i),
    views: dv[i],
    contributions: dc[i],
    raised: dr[i],
  }));

  return {
    fundraiserId: f.id,
    totalRaised: f.raised,
    contributors: f.contributorCount,
    averageContribution: f.contributorCount ? f.raised / f.contributorCount : 0,
    pageViews: f.pageViews,
    conversionRate: f.pageViews ? f.contributorCount / f.pageViews : 0,
    shares: f.shareCount,
    referralSources,
    timeline,
  };
}

/* -------------------------------------- Admin --------------------------------------- */

export const reports: FundraiserReport[] = [
  { id: "r-1", fundraiserId: "f-005", reason: "Misleading content", details: "Story could be read as implying the organizer keeps the funds.", reportedOn: "2026-09-29", status: "open" },
  { id: "r-2", fundraiserId: "f-007", reason: "Impersonation", details: "Reporter says the organizer may be using someone else's photo.", reportedOn: "2026-09-30", status: "reviewing" },
  { id: "r-3", fundraiserId: "f-002", reason: "Spam", details: "Repeated share messages in a community group.", reportedOn: "2026-09-18", status: "resolved" },
];
