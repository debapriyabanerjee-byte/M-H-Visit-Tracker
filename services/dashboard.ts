// Dashboard service — fetches KPIs/recent visits, with a resilient fallback.

import type { ApiResponse, DashboardData } from "@/types";
import { postAction } from "@/services/api";

const EMPTY_DASHBOARD: DashboardData = {
  todaysVisits: 0,
  thisWeekVisits: 0,
  partnerMeets: 0,
  teamConnects: 0,
  insurerMeets: 0,
  followUpsPending: 0,
  gpsCompliance: 0,
  travelCompliance: 0,
  recentVisits: [],
};

export async function fetchDashboard(): Promise<DashboardData> {
  const res: ApiResponse<DashboardData> = await postAction<DashboardData>("dashboard", {});
  if (res.status === "success") return res.data;
  return EMPTY_DASHBOARD;
}
