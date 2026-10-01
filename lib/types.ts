export const CATEGORIES = [
  "Voter Outreach",
  "Digital Advertising",
  "Public Education",
  "Research",
  "Community Organizing",
  "Advocacy",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type StrategyIcon =
  | "megaphone"
  | "users"
  | "book"
  | "video"
  | "mail"
  | "search"
  | "map"
  | "phone";

export interface Strategy {
  title: string;
  description: string;
  icon: StrategyIcon;
}

export interface BudgetLine {
  category: string;
  planned: number;
  /** Reported spending to date for this line. */
  spent: number;
}

export interface Expenditure {
  id: string;
  date: string;
  payee: string;
  category: string;
  amount: number;
  purpose: string;
  /** Mock FEC report type, e.g. "24-Hour Report". */
  report: string;
}

export interface ProjectUpdate {
  id: string;
  date: string;
  title: string;
  body: string;
  kind: "milestone" | "spending" | "general";
}

export interface Filing {
  id: string;
  name: string;
  period: string;
  filedOn: string;
  status: "Filed" | "Upcoming";
}

export interface Project {
  slug: string;
  title: string;
  category: Category;
  location: string;
  summary: string;
  image: string;
  imageAlt: string;
  goal: number;
  raised: number;
  contributors: number;
  daysLeft: number;
  launchedOn: string;
  /** Relative momentum used for the "Trending" sort. */
  momentum: number;
  overview: string[];
  whyItMatters: string[];
  strategy: Strategy[];
  budget: BudgetLine[];
  expenditures: Expenditure[];
  updates: ProjectUpdate[];
  filings: Filing[];
}

export interface ActivityItem {
  id: string;
  kind: "contribution" | "update" | "expenditure";
  text: string;
  projectSlug: string;
  ago: string;
}

/* ------------------------------------------------------------------------ */
/* Peer-to-peer fundraising                                                  */
/*                                                                           */
/* Supporters create fundraising pages; every contribution is made directly  */
/* to the committee. A fundraiser ID is attached to a contribution only for  */
/* attribution and analytics; organizers never receive or control funds.     */
/* ------------------------------------------------------------------------ */

export type UserRole = "supporter" | "admin";

export interface User {
  id: string;
  name: string;
  /** Used in friendly copy, e.g. "Maria's fundraiser". */
  firstName: string;
  email: string;
  avatarUrl?: string;
  location?: string;
  bio?: string;
  role: UserRole;
  joinedOn: string;
}

export type FundraiserStatus = "draft" | "active" | "ended" | "suspended";

export interface FundraiserUpdate {
  id: string;
  fundraiserId: string;
  postedOn: string;
  title: string;
  body: string;
}

export interface Fundraiser {
  id: string;
  slug: string;
  title: string;
  organizerId: string;
  /** Optional photo for this fundraiser; falls back to the organizer's avatar. */
  organizerPhoto?: string | null;
  /** One or two sentences used on cards and share previews. */
  summary: string;
  /** Organizer's story in the lightweight rich-text format (see components/rich-text). */
  story: string;
  coverImage: string;
  coverImageAlt: string;
  goal: number;
  /** Denormalized totals, maintained by the backend from attributed contributions. */
  raised: number;
  contributorCount: number;
  pageViews: number;
  shareCount: number;
  createdOn: string;
  launchedOn: string | null;
  /** Optional end date (YYYY-MM-DD). Open-ended fundraisers have none. */
  endsOn: string | null;
  status: FundraiserStatus;
  /** Organizer-customizable message prefilled into share links. */
  shareMessage: string;
  /** Relative recent activity used for the "Trending" sort. */
  momentum: number;
  updates: FundraiserUpdate[];
}

export type ReferralChannel =
  | "direct"
  | "facebook"
  | "instagram"
  | "x"
  | "email"
  | "sms"
  | "other";

export type ShareChannel = Exclude<ReferralChannel, "direct" | "instagram" | "other"> | "copy_link" | "native";

/** Links a contribution to the fundraiser page (and share) that produced it. */
export interface ContributionAttribution {
  fundraiserId: string;
  referralChannel: ReferralChannel;
  shareEventId?: string;
  landingPath?: string;
}

export type ContributionStatus = "pending" | "succeeded" | "failed" | "refunded";

export interface Contribution {
  id: string;
  amount: number;
  createdAt: string;
  /** Public display name; null when the contributor chose to stay anonymous. */
  displayName: string | null;
  /** Optional public message of support shown on the fundraiser page. */
  message?: string;
  status: ContributionStatus;
  /** The committee that receives the funds. Never the fundraiser organizer. */
  recipient: string;
  attribution: ContributionAttribution;
}

export interface ShareEvent {
  id: string;
  fundraiserId: string;
  channel: ShareChannel;
  createdAt: string;
  sharedByUserId?: string;
}

export interface ReferralSource {
  channel: ReferralChannel;
  label: string;
  visits: number;
  contributions: number;
  raised: number;
}

export interface AnalyticsTimelinePoint {
  date: string;
  views: number;
  contributions: number;
  raised: number;
}

export interface FundraiserAnalytics {
  fundraiserId: string;
  totalRaised: number;
  contributors: number;
  averageContribution: number;
  pageViews: number;
  /** Contributors divided by page views, 0–1. */
  conversionRate: number;
  shares: number;
  referralSources: ReferralSource[];
  timeline: AnalyticsTimelinePoint[];
}

export type FundraiserReportStatus = "open" | "reviewing" | "resolved";

export interface FundraiserReport {
  id: string;
  fundraiserId: string;
  reason: string;
  details: string;
  reportedOn: string;
  status: FundraiserReportStatus;
}
