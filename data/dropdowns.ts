// ---------------------------------------------------------------------------
// Dropdown Master — every option list lives here. No inline arrays in UI.
// Replace this module with an API fetch later; UI never changes.
// ---------------------------------------------------------------------------

import type { Designation, VisitType } from "@/types";

export const DESIGNATIONS: Designation[] = ["ZH", "RH", "SH", "Regional Manager"];

export const VISIT_TYPES: VisitType[] = ["Partner Meet", "Team Connect", "Insurer Meet"];

// Zone taxonomy sourced from the August 2026 Travel Plan workbook.
// E&C = East & Central, RON = Rest of North.
export const ZONES = ["North", "RON", "E&C", "South", "West"] as const;

export const PARTNER_TYPES = ["Existing Partner", "New Partner"] as const;

export const PARTNER_STATUSES = ["Active", "Inactive"] as const;

export const PARTNER_CATEGORIES = [
  "POSP Agent",
  "Sub-Broker",
  "Dealer / Garage",
  "DSA",
  "Corporate Agent",
  "MISP",
  "Individual Advisor",
] as const;

export const BUSINESS_OPPORTUNITY = [
  "High — Ready to scale",
  "Medium — Needs nurturing",
  "Low — Early stage",
  "At Risk — Declining",
] as const;

export const CONVERSION_PROBABILITY = ["High", "Medium", "Low"] as const;

export const SUPPORT_REQUIRED = [
  "Pricing",
  "Payout / Commission",
  "Claims",
  "Technology / Portal",
  "Training",
  "Product Knowledge",
  "Marketing Collateral",
  "Onboarding / KYC",
  "Escalation Resolution",
  "Lead Support",
] as const;

export const TEAM_MEETING_TYPES = [
  "1:1 Review",
  "Team Huddle",
  "Field Ride-Along",
  "Performance Review",
  "Onboarding",
  "Skip-Level",
] as const;

export const TEAM_CHALLENGES = [
  "Low Activation",
  "Pricing Competitiveness",
  "Attrition Risk",
  "Product Gaps",
  "Payout Delays",
  "Tech / Portal Issues",
  "Motivation / Morale",
  "Territory Coverage",
] as const;

export const INSURER_DISCUSSION_TOPICS = [
  "Pricing",
  "Claims",
  "Payout Structure",
  "Technology Integration",
  "Product Launch",
  "Co-marketing",
  "SLA / TAT",
  "Compliance",
  "Volume Commitments",
] as const;

export const MEETING_OUTCOME = [
  "Positive — Action agreed",
  "Neutral — Follow-up needed",
  "Blocked — Escalation required",
] as const;

export const ACTION_OWNERS = [
  "Self",
  "Reporting Manager",
  "Zonal Head",
  "Product Team",
  "Tech Team",
  "Claims Team",
  "Payout Team",
  "Insurer SPOC",
] as const;

export const PURPOSE_OF_VISIT = [
  "Business Development",
  "Relationship Management",
  "Issue Resolution",
  "Activation Drive",
  "Review",
  "Onboarding",
] as const;

export const HEALTH_ASSESSMENT = [
  "Green — On track",
  "Amber — Watch",
  "Red — Intervention needed",
] as const;
