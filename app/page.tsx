"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { LocationCard } from "@/components/dashboard/location-card";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { SectionHeader } from "@/components/dashboard/section-header";
import { RecentVisits } from "@/components/dashboard/recent-visits";
import { FloatingActionButton } from "@/components/dashboard/fab";
import { MonthCalendar } from "@/components/calendar/month-calendar";
import { DayDetail } from "@/components/calendar/day-detail";
import { useDashboard } from "@/hooks/useDashboard";
import { todayIso } from "@/utils/date";
import { ROUTES } from "@/constants";

export default function DashboardPage() {
  const { data, loading } = useDashboard();
  const [selectedDate, setSelectedDate] = useState<string>(todayIso());

  return (
    <AppShell>
      <LocationCard />

      <SectionHeader title="Overview" />
      <KpiGrid data={data} loading={loading} />

      <SectionHeader title="August 2026 Travel" />
      <div className="space-y-4">
        <MonthCalendar selected={selectedDate} onSelect={setSelectedDate} />
        <DayDetail isoDate={selectedDate} />
      </div>

      <SectionHeader
        title="Recent Visits"
        action={
          <Link href={ROUTES.visits} className="text-xs font-semibold text-brand">
            Add new
          </Link>
        }
      />
      <RecentVisits visits={data?.recentVisits ?? []} />

      <div className="h-24" />
      <FloatingActionButton />
    </AppShell>
  );
}
