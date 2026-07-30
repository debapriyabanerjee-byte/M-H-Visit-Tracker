"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { MonthCalendar } from "@/components/calendar/month-calendar";
import { DayDetail } from "@/components/calendar/day-detail";
import { SectionHeader } from "@/components/dashboard/section-header";
import { travelCompliance } from "@/services/calendar";
import { pct } from "@/utils/format";
import { todayIso } from "@/utils/date";

export default function CalendarPage() {
  const [selected, setSelected] = useState<string>(todayIso());
  const compliance = travelCompliance();

  return (
    <AppShell>
      <h1 className="mb-1 text-lg font-bold text-gray-900">Travel Calendar</h1>
      <p className="mb-4 text-sm text-gray-500">August 2026 planned market travel.</p>

      <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Travel Compliance</span>
          <span className="text-sm font-bold text-brand">{pct(compliance)}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-brand transition-all" style={{ width: pct(compliance) }} />
        </div>
      </div>

      <MonthCalendar selected={selected} onSelect={setSelected} />
      <SectionHeader title="Plan for Selected Day" />
      <DayDetail isoDate={selected} />
      <div className="h-8" />
    </AppShell>
  );
}
