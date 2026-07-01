export const STAGES = ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"] as const;
export type Stage = typeof STAGES[number];

export interface Lead {
  id: string;
  name: string;
  businessName: string;
  service: string;
  stage: Stage;
  owner: string;
  city?: string;
  budget?: number;
  notes?: string;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const STAGE_COLORS: Record<Stage, string> = {
  New: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  Contacted: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800",
  Qualified: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:border-indigo-800",
  Proposal: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800",
  Won: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800",
  Lost: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800",
};

export const DUMMY_LEADS: Lead[] = [
  {
    id: "uuid-1",
    name: "Sarah Jenkins",
    businessName: "Jenkins Legal Group",
    service: "SEO",
    stage: "New",
    owner: "Alex Sales",
    city: "Sydney",
    budget: 2500,
    notes: "Wants to rank for local legal terms.",
    createdAt: new Date(Date.now() - 10000000).toISOString(),
    updatedAt: new Date(Date.now() - 10000000).toISOString(),
  },
  {
    id: "uuid-2",
    name: "Liam O'Connor",
    businessName: "O'Connor Plumbers",
    service: "Google Ads",
    stage: "Contacted",
    owner: "Alex Sales",
    city: "Melbourne",
    budget: 1500,
    notes: "Currently paying too much per click.",
    createdAt: new Date(Date.now() - 20000000).toISOString(),
    updatedAt: new Date(Date.now() - 5000000).toISOString(),
  },
  {
    id: "uuid-3",
    name: "Priya Patel",
    businessName: "Spice Route Eats",
    service: "Social Media",
    stage: "Qualified",
    owner: "Sam Closer",
    city: "Brisbane",
    budget: 800,
    notes: "Needs Instagram reels and tiktok help.",
    createdAt: new Date(Date.now() - 30000000).toISOString(),
    updatedAt: new Date(Date.now() - 3000000).toISOString(),
  },
  {
    id: "uuid-4",
    name: "David Chen",
    businessName: "Chen Logistics",
    service: "Web Design",
    stage: "Proposal",
    owner: "Alex Sales",
    city: "Sydney",
    budget: 6000,
    notes: "Complete redesign needed for 10 pages.",
    createdAt: new Date(Date.now() - 40000000).toISOString(),
    updatedAt: new Date(Date.now() - 2000000).toISOString(),
  },
  {
    id: "uuid-5",
    name: "Emma Wilson",
    businessName: "Wilson Dental",
    service: "SEO",
    stage: "Won",
    owner: "Sam Closer",
    city: "Perth",
    budget: 2000,
    notes: "Signed a 6 month retainer.",
    createdAt: new Date(Date.now() - 50000000).toISOString(),
    updatedAt: new Date(Date.now() - 1000000).toISOString(),
  },
  {
    id: "uuid-6",
    name: "James Taylor",
    businessName: "Taylor Construction",
    service: "Google Ads",
    stage: "Lost",
    owner: "Alex Sales",
    city: "Auckland",
    budget: 1000,
    notes: "Went with a cheaper agency.",
    createdAt: new Date(Date.now() - 60000000).toISOString(),
    updatedAt: new Date(Date.now() - 500000).toISOString(),
  },
  {
    id: "uuid-7",
    name: "Chloe Smith",
    businessName: "Glow Beauty Bar",
    service: "Branding",
    stage: "Proposal",
    owner: "Sam Closer",
    city: "Melbourne",
    budget: 3500,
    notes: "Loves the moodboard, waiting on final approval.",
    createdAt: new Date(Date.now() - 70000000).toISOString(),
    updatedAt: new Date(Date.now() - 100000).toISOString(),
  },
  {
    id: "uuid-8",
    name: "Ryan Davies",
    businessName: "Davies Fitness",
    service: "Social Media",
    stage: "Qualified",
    owner: "Alex Sales",
    city: "Sydney",
    budget: 1200,
    notes: "Wants 3 posts a week + community management.",
    createdAt: new Date(Date.now() - 80000000).toISOString(),
    updatedAt: new Date(Date.now() - 50000).toISOString(),
  },
  {
    id: "uuid-9",
    name: "Sophie Brown",
    businessName: "Brown's Boutique",
    service: "Email Marketing",
    stage: "New",
    owner: "Sam Closer",
    city: "Brisbane",
    budget: 500,
    notes: "Has a list of 5k but never emails them.",
    createdAt: new Date(Date.now() - 90000000).toISOString(),
    updatedAt: new Date(Date.now() - 10000).toISOString(),
  },
  {
    id: "uuid-10",
    name: "Tom Harris",
    businessName: "Harris Accounting",
    service: "SEO",
    stage: "Contacted",
    owner: "Alex Sales",
    city: "Perth",
    budget: 1800,
    notes: "Need to audit their current site first.",
    createdAt: new Date(Date.now() - 100000000).toISOString(),
    updatedAt: new Date(Date.now() - 5000).toISOString(),
  }
];
