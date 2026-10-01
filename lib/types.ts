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
