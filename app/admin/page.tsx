"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminKpis } from "@/components/admin/admin-kpis";
import { AdminCharts } from "@/components/admin/admin-charts";
import { VisitsTable } from "@/components/admin/visits-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/hooks/useDashboard";
import { travelCompliance } from "@/services/calendar";
import { pct } from "@/utils/format";
import { ROUTES } from "@/constants";
import type { DashboardData } from "@/types";

// Fallback so the MIS view is meaningful on a fresh deployment.
const SAMPLE: DashboardData = {
  todaysVisits: 8,
  thisWeekVisits: 47,
  partnerMeets: 96,
  teamConnects: 51,
  insurerMeets: 34,
  followUpsPending: 12,
  gpsCompliance: 98,
  travelCompliance: travelCompliance(),
  recentVisits: [],
};

export default function AdminPage() {
  const { data, loading } = useDashboard();
  const total = data ? data.partnerMeets + data.teamConnects + data.insurerMeets : 0;
  const view = data && total > 0 ? data : SAMPLE;

  return (
    <div className="min-h-dvh bg-surface">
      <header className="sticky top-0 z-20 border-b border-gray-100 bg-surface/80 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">
              M&amp;H Visit Tracker
            </p>
            <h1 className="text-lg font-bold text-gray-900">Admin · Executive MIS</h1>
          </div>
          <Link
            href={ROUTES.dashboard}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" /> App
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-5 px-6 py-6">
        {loading ? <Skeleton className="h-24" /> : <AdminKpis data={view} />}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ComplianceBar label="GPS Compliance" value={view.gpsCompliance} />
          <ComplianceBar label="Travel Compliance" value={view.travelCompliance} />
          <ComplianceBar
            label="Follow-up Closure"
            value={
              view.followUpsPending === 0
                ? 100
                : Math.max(0, 100 - view.followUpsPending * 2)
            }
          />
        </div>

        <AdminCharts />
        <VisitsTable />

        <p className="pb-6 text-center text-xs text-gray-400">
          Charts show representative analytics. Wire the Apps Script analytics endpoint for live
          data — see README.
        </p>
      </main>
    </div>
  );
}

function ComplianceBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-brand">{pct(value)}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
        <div className="h-full rounded-full bg-brand transition-all" style={{ width: pct(value) }} />
      </div>
    </div>
  );
}
