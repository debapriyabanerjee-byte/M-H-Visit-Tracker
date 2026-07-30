"use client";

import { MapPin, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getTravelByDate } from "@/services/calendar";
import { findEmployeeByCode } from "@/data/employeeMaster";
import type { TravelStatus } from "@/types";

const tone: Record<TravelStatus, "green" | "amber" | "gray" | "brand"> = {
  completed: "green",
  pending: "amber",
  future: "gray",
  today: "brand",
};

export function DayDetail({ isoDate }: { isoDate: string }) {
  const entries = getTravelByDate(isoDate);

  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
        No travel planned for {isoDate}.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((e) => {
        const leader = findEmployeeByCode(e.leader);
        return (
          <div
            key={`${e.date}-${e.city}-${e.leader}`}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-soft"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand" />
                <span className="text-sm font-semibold text-gray-900">{e.city}</span>
              </div>
              <Badge tone={tone[e.status]}>{e.status}</Badge>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
              <User className="h-3.5 w-3.5" />
              {leader ? leader.employeeName : e.leader} · {e.zone} Zone
            </p>
          </div>
        );
      })}
    </div>
  );
}
