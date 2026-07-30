"use client";

import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  Activity,
  CalendarCheck,
  CalendarRange,
  MapPin,
  Percent,
  Users,
} from "lucide-react";
import type { DashboardData } from "@/types";

export function AdminKpis({ data }: { data: DashboardData }) {
  const total = data.partnerMeets + data.teamConnects + data.insurerMeets;
  const cards = [
    { label: "Total Visits", value: total, icon: Activity, accent: true },
    { label: "Today", value: data.todaysVisits, icon: CalendarCheck },
    { label: "This Week", value: data.thisWeekVisits, icon: CalendarRange },
    { label: "Partner Meets", value: data.partnerMeets, icon: MapPin },
    { label: "Team Connects", value: data.teamConnects, icon: Users },
    { label: "GPS Compliance", value: `${Math.round(data.gpsCompliance)}%`, icon: Percent },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((c, i) => (
        <KpiCard key={c.label} {...c} index={i} />
      ))}
    </div>
  );
}
