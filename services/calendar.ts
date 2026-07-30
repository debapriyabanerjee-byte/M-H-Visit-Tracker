// Calendar service — reads ONLY from the travel-plan data module today.
// Swap the import for an API call later without touching the UI.

import { TRAVEL_PLAN, TRAVEL_PLAN_MONTH, getTravelForDate } from "@/data/travelPlan";
import type { TravelPlanEntry } from "@/types";

export function getMonthMeta() {
  return TRAVEL_PLAN_MONTH;
}

export function getTravelPlan(): TravelPlanEntry[] {
  return TRAVEL_PLAN;
}

export function getTravelByDate(isoDate: string): TravelPlanEntry[] {
  return getTravelForDate(isoDate);
}

export function travelCompliance(): number {
  const total = TRAVEL_PLAN.length;
  if (!total) return 0;
  const done = TRAVEL_PLAN.filter((t) => t.status === "completed").length;
  return (done / total) * 100;
}
