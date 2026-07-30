"use client";

import {
  CalendarCheck,
  CalendarClock,
  Building2,
  Users,
  Shield,
  ListTodo,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardData } from "@/types";

export function KpiGrid({ data, loading }: { data: DashboardData | null; loading: boolean }) {
  if (loading || !data) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  const cards = [
    { label: "Today's Visits", value: data.todaysVisits, icon: CalendarCheck, accent: true },
    { label: "This Week", value: data.thisWeekVisits, icon: CalendarClock },
    { label: "Partner Meets", value: data.partnerMeets, icon: Building2 },
    { label: "Team Connects", value: data.teamConnects, icon: Users },
    { label: "Insurer Meets", value: data.insurerMeets, icon: Shield },
    { label: "Follow-ups Pending", value: data.followUpsPending, icon: ListTodo },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {cards.map((c, i) => (
        <KpiCard key={c.label} {...c} index={i} />
      ))}
    </div>
  );
}
