// ---------------------------------------------------------------------------
// ⚠️  SAMPLE ANALYTICS DATA for the Admin dashboard.
// Used only when the live Apps Script dashboard endpoint returns no rows
// (e.g. a fresh deployment). Once real submissions exist, wire the admin
// charts to services/dashboard.ts / a dedicated analytics endpoint and delete
// this module. Shapes are intentionally simple and chart-ready.
// ---------------------------------------------------------------------------

export interface NameValue {
  name: string;
  value: number;
}

export interface TrendPoint {
  label: string;
  visits: number;
}

export interface AdminVisitRow {
  submissionId: string;
  leader: string;
  zone: string;
  visitType: string;
  city: string;
  date: string;
  outcome: string;
}

export const VISITS_BY_ZONE: NameValue[] = [
  { name: "North", value: 42 },
  { name: "West", value: 55 },
  { name: "South", value: 38 },
  { name: "East", value: 27 },
  { name: "Central", value: 19 },
];

export const VISIT_TYPE_SPLIT: NameValue[] = [
  { name: "Partner Meet", value: 96 },
  { name: "Team Connect", value: 51 },
  { name: "Insurer Meet", value: 34 },
];

export const SUPPORT_REQUESTED: NameValue[] = [
  { name: "Pricing", value: 34 },
  { name: "Payout", value: 28 },
  { name: "Claims", value: 22 },
  { name: "Technology", value: 19 },
  { name: "Training", value: 14 },
  { name: "Onboarding", value: 11 },
];

export const DAILY_TREND: TrendPoint[] = [
  { label: "Aug 1", visits: 12 },
  { label: "Aug 4", visits: 18 },
  { label: "Aug 6", visits: 9 },
  { label: "Aug 8", visits: 21 },
  { label: "Aug 11", visits: 15 },
  { label: "Aug 13", visits: 24 },
  { label: "Aug 18", visits: 17 },
];

export const ADMIN_VISITS: AdminVisitRow[] = [
  { submissionId: "MH-20260801-0001", leader: "ZH North", zone: "North", visitType: "Partner Meet", city: "Gurgaon", date: "2026-08-01", outcome: "Positive" },
  { submissionId: "MH-20260804-0002", leader: "ZH North", zone: "North", visitType: "Insurer Meet", city: "Jaipur", date: "2026-08-04", outcome: "Neutral" },
  { submissionId: "MH-20260806-0003", leader: "RH West", zone: "West", visitType: "Team Connect", city: "Mumbai", date: "2026-08-06", outcome: "Positive" },
  { submissionId: "MH-20260808-0004", leader: "RH West", zone: "West", visitType: "Partner Meet", city: "Pune", date: "2026-08-08", outcome: "Blocked" },
  { submissionId: "MH-20260811-0005", leader: "SH East", zone: "East", visitType: "Partner Meet", city: "Kolkata", date: "2026-08-11", outcome: "Positive" },
  { submissionId: "MH-20260813-0006", leader: "RM South", zone: "South", visitType: "Insurer Meet", city: "Bengaluru", date: "2026-08-13", outcome: "Neutral" },
];
