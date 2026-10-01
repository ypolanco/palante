/**
 * Development mock data. Every project, payee, and figure here is fictional.
 * Replace with real data sources before launch.
 */
import type {
  ActivityItem,
  BudgetLine,
  Category,
  Expenditure,
  Filing,
  Project,
  ProjectUpdate,
  Strategy,
} from "./types";

export const COMMITTEE = {
  name: "Palante Together PAC",
  type: "Independent expenditure-only political committee (Super PAC)",
  /** Same as `type`, phrased for use mid-sentence. */
  descriptor: "independent expenditure-only political committee (Super PAC)",
  fecId: "C00XXXXXX (placeholder)",
  treasurer: "Treasurer name (placeholder)",
};

export const PLATFORM_STATS = {
  raised: 1_840_000,
  contributors: 18_420,
  projectsFunded: 12,
  expendituresReported: 1_230_000,
};

type ExpenditureSeed = [
  date: string,
  payee: string,
  category: string,
  amount: number,
  purpose: string,
  report?: string,
];

interface ProjectSeed {
  slug: string;
  title: string;
  category: Category;
  location: string;
  summary: string;
  imageAlt: string;
  goal: number;
  raised: number;
  contributors: number;
  daysLeft: number;
  launchedOn: string;
  momentum: number;
  overview: string[];
  whyItMatters: string[];
  strategy: Strategy[];
  budget: Array<[category: string, planned: number]>;
  expenditures: ExpenditureSeed[];
  updates: Array<Omit<ProjectUpdate, "id">>;
}

function buildProject(seed: ProjectSeed): Project {
  const expenditures: Expenditure[] = seed.expenditures.map(
    ([date, payee, category, amount, purpose, report], i) => ({
      id: `${seed.slug}-exp-${i + 1}`,
      date,
      payee,
      category,
      amount,
      purpose,
      report: report ?? "Schedule E (Form 3X)",
    }),
  );

  const budget: BudgetLine[] = seed.budget.map(([category, planned]) => ({
    category,
    planned,
    spent: expenditures
      .filter((e) => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0),
  }));

  const filings: Filing[] = [
    {
      id: `${seed.slug}-f1`,
      name: "Monthly Report (Form 3X)",
      period: "Aug 1 – Aug 31, 2026",
      filedOn: "2026-09-18",
      status: "Filed",
    },
    {
      id: `${seed.slug}-f2`,
      name: "24/48-Hour Independent Expenditure Reports",
      period: "Rolling",
      filedOn: expenditures.at(-1)?.date ?? seed.launchedOn,
      status: "Filed",
    },
    {
      id: `${seed.slug}-f3`,
      name: "Monthly Report (Form 3X)",
      period: "Sep 1 – Sep 30, 2026",
      filedOn: "2026-10-20",
      status: "Upcoming",
    },
  ];

  return {
    ...seed,
    image: `/projects/${seed.slug}.svg`,
    budget,
    expenditures,
    filings,
    updates: seed.updates.map((u, i) => ({ ...u, id: `${seed.slug}-u${i + 1}` })),
  };
}

const seeds: ProjectSeed[] = [
  {
    slug: "nc-independent-voter-outreach",
    title: "Independent Voter Outreach — North Carolina",
    category: "Voter Outreach",
    location: "North Carolina",
    summary:
      "A statewide independent digital and voter-awareness initiative focused on increasing participation and civic engagement.",
    imageAlt: "Abstract illustration of paths converging and moving forward",
    goal: 250_000,
    raised: 173_450,
    contributors: 2_841,
    daysLeft: 24,
    launchedOn: "2026-07-14",
    momentum: 96,
    overview: [
      "This initiative reaches eligible North Carolina voters with clear, factual information about registration deadlines, early voting, and polling locations — across digital channels, mail, and community events.",
      "The project is run independently. It does not coordinate with any candidate, campaign, or political party, and every expenditure is reported publicly.",
    ],
    whyItMatters: [
      "Turnout among young and first-time voters in North Carolina lags the statewide average by double digits. Many of those voters say they simply didn't know when or where to vote.",
      "Timely, plain-language outreach closes that information gap. Every dollar raised here goes toward reaching people who are eligible but under-informed.",
    ],
    strategy: [
      {
        title: "Digital advertising",
        description: "Targeted video and display ads with registration and early-voting reminders.",
        icon: "megaphone",
      },
      {
        title: "Community outreach",
        description: "Tabling at campuses, festivals, and community centers in 14 counties.",
        icon: "users",
      },
      {
        title: "Voter education",
        description: "Bilingual guides explaining ballots, ID rules, and voting options.",
        icon: "book",
      },
      {
        title: "Direct mail",
        description: "Postcards with polling locations sent to newly registered households.",
        icon: "mail",
      },
    ],
    budget: [
      ["Digital Advertising", 90_000],
      ["Video Production", 35_000],
      ["Research", 20_000],
      ["Direct Mail", 45_000],
      ["Technology", 15_000],
      ["Operations", 20_000],
      ["Contingency", 25_000],
    ],
    expenditures: [
      ["2026-07-22", "Northfield Research Group", "Research", 12_500, "Voter information-gap survey"],
      ["2026-08-03", "Lumen Video Co.", "Video Production", 18_000, "Production of three 30-second spots"],
      ["2026-08-11", "Openroad Software", "Technology", 6_200, "Polling-place lookup tool"],
      ["2026-08-19", "Brightline Digital LLC", "Digital Advertising", 26_400, "Digital video placement, wave 1", "24-Hour Report"],
      ["2026-08-28", "Carolina Mailworks", "Direct Mail", 14_800, "Postcards to 48,000 households", "48-Hour Report"],
      ["2026-09-06", "Lumen Video Co.", "Video Production", 9_500, "Spanish-language edits"],
      ["2026-09-12", "Brightline Digital LLC", "Digital Advertising", 21_600, "Digital video placement, wave 2", "24-Hour Report"],
      ["2026-09-20", "Palante Field Services", "Operations", 7_300, "Event materials and travel"],
    ],
    updates: [
      {
        date: "2026-09-24",
        title: "Wave 2 ads are live in 9 media markets",
        body: "Our second wave of early-voting reminders launched this week, including Spanish-language versions. The full expenditure has been filed as a 24-hour report.",
        kind: "spending",
      },
      {
        date: "2026-09-02",
        title: "48,000 postcards delivered",
        body: "Newly registered households across 14 counties received postcards with their polling place and early-voting hours.",
        kind: "milestone",
      },
      {
        date: "2026-08-15",
        title: "We crossed 50% of our goal",
        body: "Thanks to more than 1,600 contributors, we're past the halfway mark. The polling-place lookup tool is now live.",
        kind: "milestone",
      },
      {
        date: "2026-07-14",
        title: "Project launched",
        body: "We published our full budget and research plan. Expect an update every time we report spending.",
        kind: "general",
      },
    ],
  },
  {
    slug: "digital-voter-education",
    title: "Digital Voter Education Initiative",
    category: "Public Education",
    location: "Nationwide, online",
    summary:
      "Independent digital education designed to help voters understand upcoming elections and civic issues.",
    imageAlt: "Abstract illustration of overlapping screens and speech shapes",
    goal: 75_000,
    raised: 48_225,
    contributors: 1_147,
    daysLeft: 31,
    launchedOn: "2026-08-02",
    momentum: 81,
    overview: [
      "A library of short, nonpartisan explainers — video, carousel, and audio — covering how elections work, what's on the ballot, and how to verify information.",
      "Content is published openly so schools, libraries, and community groups can reuse it.",
    ],
    whyItMatters: [
      "Most people now get election information from social feeds, where accuracy varies widely.",
      "Plain-language explainers that cite their sources help voters make sense of what they're seeing.",
    ],
    strategy: [
      { title: "Explainer videos", description: "Sixty-second videos on ballot measures and voting rules.", icon: "video" },
      { title: "Voter education", description: "Shareable guides in English, Spanish, and Vietnamese.", icon: "book" },
      { title: "Digital advertising", description: "Promoted placements to reach people outside existing audiences.", icon: "megaphone" },
    ],
    budget: [
      ["Video Production", 28_000],
      ["Digital Advertising", 25_000],
      ["Research", 8_000],
      ["Translation", 7_000],
      ["Operations", 7_000],
    ],
    expenditures: [
      ["2026-08-14", "Plainspoken Media", "Video Production", 11_200, "First 12 explainer videos"],
      ["2026-08-27", "Linguaverde Translation", "Translation", 3_100, "Spanish and Vietnamese captions"],
      ["2026-09-09", "Brightline Digital LLC", "Digital Advertising", 9_800, "Promoted explainer placements", "24-Hour Report"],
    ],
    updates: [
      {
        date: "2026-09-18",
        title: "12 explainers published",
        body: "Our first set of explainers is live and free to reuse. Libraries in four states have already shared them.",
        kind: "milestone",
      },
      {
        date: "2026-08-02",
        title: "Project launched",
        body: "We've published our content plan and budget. Suggest a topic by replying to any update.",
        kind: "general",
      },
    ],
  },
  {
    slug: "community-turnout-initiative",
    title: "Community Turnout Initiative",
    category: "Community Organizing",
    location: "Phoenix, Arizona",
    summary:
      "Independent outreach designed to increase civic participation in underserved communities.",
    imageAlt: "Abstract illustration of many small circles gathering into a larger shape",
    goal: 100_000,
    raised: 72_810,
    contributors: 1_984,
    daysLeft: 12,
    launchedOn: "2026-07-28",
    momentum: 88,
    overview: [
      "Neighbors trained as civic ambassadors host conversations, help people check their registration, and share accurate voting information on their own blocks.",
      "The project focuses on neighborhoods where turnout has historically been lowest.",
    ],
    whyItMatters: [
      "People are far more likely to vote when someone they know talks with them about it.",
      "Investing in local ambassadors builds civic capacity that lasts beyond a single election.",
    ],
    strategy: [
      { title: "Community outreach", description: "120 trained ambassadors in 30 neighborhoods.", icon: "users" },
      { title: "Phone and text", description: "Reminder calls and texts in English and Spanish.", icon: "phone" },
      { title: "Neighborhood events", description: "Block gatherings with registration help.", icon: "map" },
    ],
    budget: [
      ["Field Outreach", 42_000],
      ["Training", 15_000],
      ["Phone & Text", 18_000],
      ["Event Materials", 12_000],
      ["Operations", 13_000],
    ],
    expenditures: [
      ["2026-08-09", "Desert Bloom Training Co-op", "Training", 9_000, "Ambassador training sessions"],
      ["2026-08-22", "Palante Field Services", "Field Outreach", 16_500, "Ambassador stipends, August"],
      ["2026-09-05", "Relay Text Systems", "Phone & Text", 7_400, "Reminder text platform", "48-Hour Report"],
      ["2026-09-19", "Palante Field Services", "Field Outreach", 17_200, "Ambassador stipends, September"],
    ],
    updates: [
      {
        date: "2026-09-21",
        title: "4,300 conversations and counting",
        body: "Ambassadors have now held more than 4,300 one-on-one conversations about registration and voting options.",
        kind: "milestone",
      },
      {
        date: "2026-08-10",
        title: "First 60 ambassadors trained",
        body: "Our first training cohort graduated this weekend. A second cohort starts next month.",
        kind: "general",
      },
    ],
  },
  {
    slug: "public-policy-awareness-campaign",
    title: "Public Policy Awareness Campaign",
    category: "Digital Advertising",
    location: "Pennsylvania",
    summary:
      "A public information initiative focused on increasing awareness around major policy issues.",
    imageAlt: "Abstract illustration of layered bars rising to the right",
    goal: 150_000,
    raised: 39_400,
    contributors: 638,
    daysLeft: 45,
    launchedOn: "2026-09-08",
    momentum: 64,
    overview: [
      "A digital and streaming campaign that explains how major policy proposals would affect household costs, healthcare, and local jobs.",
      "Every ad links to a public source page listing the research behind each claim.",
    ],
    whyItMatters: [
      "Policy debates are often reduced to slogans. People deserve to know what's actually being proposed.",
      "Sourced, specific messaging helps voters evaluate claims on their own.",
    ],
    strategy: [
      { title: "Digital advertising", description: "Streaming, social, and search placements statewide.", icon: "megaphone" },
      { title: "Research", description: "Independent policy analysis published alongside each ad.", icon: "search" },
      { title: "Video production", description: "Short documentary-style spots featuring local voices.", icon: "video" },
    ],
    budget: [
      ["Digital Advertising", 80_000],
      ["Video Production", 30_000],
      ["Research", 20_000],
      ["Operations", 10_000],
      ["Contingency", 10_000],
    ],
    expenditures: [
      ["2026-09-15", "Keystone Policy Lab", "Research", 8_000, "Policy impact analysis"],
      ["2026-09-26", "Lumen Video Co.", "Video Production", 6_500, "Pre-production and casting"],
    ],
    updates: [
      {
        date: "2026-09-16",
        title: "Research brief published",
        body: "Our first policy brief is public. It's the source document for every claim in the upcoming ads.",
        kind: "general",
      },
    ],
  },
  {
    slug: "youth-participation-research",
    title: "Youth Civic Participation Study",
    category: "Research",
    location: "Texas and New Mexico",
    summary:
      "Independent research into what keeps voters under 30 from participating — and what helps.",
    imageAlt: "Abstract illustration of scattered points forming an upward trend",
    goal: 60_000,
    raised: 41_900,
    contributors: 912,
    daysLeft: 19,
    launchedOn: "2026-08-12",
    momentum: 72,
    overview: [
      "A mixed-methods study combining surveys and focus groups with voters ages 18–29 across border communities.",
      "Findings and the full anonymized dataset will be published openly for organizers, journalists, and researchers.",
    ],
    whyItMatters: [
      "Outreach to young voters is often built on assumptions instead of evidence.",
      "Open research lets every independent effort spend smarter.",
    ],
    strategy: [
      { title: "Surveys", description: "A 3,000-person bilingual survey.", icon: "search" },
      { title: "Focus groups", description: "Twelve community focus groups led by local facilitators.", icon: "users" },
      { title: "Open publication", description: "Public report and anonymized dataset.", icon: "book" },
    ],
    budget: [
      ["Research", 34_000],
      ["Field Outreach", 12_000],
      ["Technology", 6_000],
      ["Operations", 8_000],
    ],
    expenditures: [
      ["2026-08-30", "Northfield Research Group", "Research", 15_000, "Survey design and fielding"],
      ["2026-09-17", "Frontera Facilitators", "Field Outreach", 5_400, "Focus group facilitation"],
    ],
    updates: [
      {
        date: "2026-09-20",
        title: "Survey fielding complete",
        body: "We reached 3,140 respondents. Focus groups continue through October.",
        kind: "milestone",
      },
    ],
  },
  {
    slug: "water-accountability-advocacy",
    title: "Clean Water Accountability Project",
    category: "Advocacy",
    location: "Michigan",
    summary:
      "Independent advocacy raising public awareness of local water-infrastructure decisions.",
    imageAlt: "Abstract illustration of flowing lines in blue and green",
    goal: 80_000,
    raised: 22_350,
    contributors: 487,
    daysLeft: 38,
    launchedOn: "2026-09-01",
    momentum: 58,
    overview: [
      "Public information about water-infrastructure funding, delivered through community forums, mail, and digital ads.",
      "The project publishes plain-language summaries of public records so residents can follow decisions.",
    ],
    whyItMatters: [
      "Infrastructure decisions affect health for decades but rarely get public attention.",
      "Accessible information helps residents take part in the decisions that affect them.",
    ],
    strategy: [
      { title: "Community forums", description: "Six public forums with local experts.", icon: "users" },
      { title: "Direct mail", description: "Mailers explaining funding timelines.", icon: "mail" },
      { title: "Digital advertising", description: "Local digital placements.", icon: "megaphone" },
    ],
    budget: [
      ["Digital Advertising", 30_000],
      ["Direct Mail", 22_000],
      ["Event Materials", 10_000],
      ["Research", 10_000],
      ["Operations", 8_000],
    ],
    expenditures: [
      ["2026-09-14", "Great Lakes Records Review", "Research", 4_200, "Public records analysis"],
    ],
    updates: [
      {
        date: "2026-09-14",
        title: "First records summary released",
        body: "We published a plain-language summary of the last three years of water-infrastructure funding decisions.",
        kind: "general",
      },
    ],
  },
  {
    slug: "georgia-first-time-voters",
    title: "First-Time Voter Outreach — Georgia",
    category: "Voter Outreach",
    location: "Georgia",
    summary:
      "Independent outreach helping first-time voters register, make a plan, and cast a ballot with confidence.",
    imageAlt: "Abstract illustration of a forward chevron made of small tiles",
    goal: 120_000,
    raised: 101_640,
    contributors: 2_210,
    daysLeft: 6,
    launchedOn: "2026-06-30",
    momentum: 92,
    overview: [
      "Campus and community outreach paired with digital reminders to help newly eligible voters make a voting plan.",
      "All materials are nonpartisan and available in English and Spanish.",
    ],
    whyItMatters: [
      "First-time voters who make a concrete plan are significantly more likely to follow through.",
      "Reaching people early builds lifelong participation.",
    ],
    strategy: [
      { title: "Campus outreach", description: "Registration drives at 22 colleges and trade schools.", icon: "users" },
      { title: "Digital reminders", description: "Plan-your-vote reminders via social and text.", icon: "phone" },
      { title: "Voter guides", description: "Pocket guides on ID rules and polling hours.", icon: "book" },
    ],
    budget: [
      ["Field Outreach", 45_000],
      ["Digital Advertising", 35_000],
      ["Printing", 15_000],
      ["Technology", 10_000],
      ["Operations", 15_000],
    ],
    expenditures: [
      ["2026-07-18", "Peach State Print", "Printing", 9_800, "Pocket voter guides"],
      ["2026-08-05", "Palante Field Services", "Field Outreach", 21_000, "Campus outreach teams"],
      ["2026-08-26", "Brightline Digital LLC", "Digital Advertising", 18_500, "Plan-your-vote placements", "24-Hour Report"],
      ["2026-09-10", "Openroad Software", "Technology", 7_200, "Voting plan builder"],
      ["2026-09-22", "Palante Field Services", "Field Outreach", 16_000, "Campus outreach teams, September"],
    ],
    updates: [
      {
        date: "2026-09-23",
        title: "11,000 voting plans created",
        body: "First-time voters have created more than 11,000 voting plans with our plan builder.",
        kind: "milestone",
      },
      {
        date: "2026-08-06",
        title: "Campus teams on the ground",
        body: "Outreach teams are now active at 22 campuses statewide.",
        kind: "general",
      },
    ],
  },
];

export const projects: Project[] = seeds.map(buildProject);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

function requireProject(slug: string): Project {
  const project = getProject(slug);
  if (!project) throw new Error(`Mock project not found: ${slug}`);
  return project;
}

export const featuredProjects: Project[] = [
  "nc-independent-voter-outreach",
  "digital-voter-education",
  "community-turnout-initiative",
  "public-policy-awareness-campaign",
].map(requireProject);

/** The project whose budget illustrates the homepage transparency section. */
export const showcaseProject = requireProject("nc-independent-voter-outreach");

export const activity: ActivityItem[] = [
  { id: "a1", kind: "contribution", text: "Marisol from Durham contributed $50", projectSlug: "nc-independent-voter-outreach", ago: "2 min ago" },
  { id: "a2", kind: "expenditure", text: "$17,200 in field outreach reported", projectSlug: "community-turnout-initiative", ago: "1 hr ago" },
  { id: "a3", kind: "contribution", text: "Devon from Atlanta contributed $25", projectSlug: "georgia-first-time-voters", ago: "1 hr ago" },
  { id: "a4", kind: "update", text: "New update: 12 explainers published", projectSlug: "digital-voter-education", ago: "3 hr ago" },
  { id: "a5", kind: "contribution", text: "A contributor from Pittsburgh gave $100", projectSlug: "public-policy-awareness-campaign", ago: "5 hr ago" },
  { id: "a6", kind: "update", text: "New update: Survey fielding complete", projectSlug: "youth-participation-research", ago: "1 day ago" },
];

export const mockContributor = {
  name: "Alex Rivera",
  memberSince: "2026-03-12",
  following: [
    "nc-independent-voter-outreach",
    "community-turnout-initiative",
    "digital-voter-education",
  ],
  contributions: [
    { id: "c1", date: "2026-09-20", projectSlug: "nc-independent-voter-outreach", amount: 100, recurring: true },
    { id: "c2", date: "2026-09-02", projectSlug: "community-turnout-initiative", amount: 50, recurring: false },
    { id: "c3", date: "2026-08-20", projectSlug: "nc-independent-voter-outreach", amount: 100, recurring: true },
    { id: "c4", date: "2026-08-04", projectSlug: "digital-voter-education", amount: 25, recurring: false },
    { id: "c5", date: "2026-07-20", projectSlug: "nc-independent-voter-outreach", amount: 100, recurring: true },
  ],
};
