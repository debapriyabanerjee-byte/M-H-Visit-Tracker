"use client";

import { useMemo } from "react";
import { getMonthMeta, getTravelPlan } from "@/services/calendar";
import { daysInMonth, firstWeekdayOfMonth, isToday } from "@/utils/date";
import { cn } from "@/lib/utils";
import type { TravelStatus } from "@/types";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const statusDot: Record<TravelStatus, string> = {
  completed: "bg-emerald-500",
  pending: "bg-amber-500",
  future: "bg-gray-300",
  today: "bg-brand",
};

interface Props {
  selected: string | null;
  onSelect: (iso: string) => void;
}

export function MonthCalendar({ selected, onSelect }: Props) {
  const { year, month, label } = getMonthMeta();
  const plan = getTravelPlan();

  const cityByDate = useMemo(() => {
    const map = new Map<string, { city: string; status: TravelStatus }>();
    for (const t of plan) map.set(t.date, { city: t.city, status: t.status });
    return map;
  }, [plan]);

  const total = daysInMonth(year, month);
  const lead = firstWeekdayOfMonth(year, month);
  const cells: (number | null)[] = [
    ...Array<null>(lead).fill(null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];

  function iso(day: number): string {
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-soft">
      <p className="mb-3 text-center text-sm font-semibold text-gray-900">{label} · Travel Plan</p>
      <div className="mb-2 grid grid-cols-7 text-center text-xs font-medium text-gray-400">
        {WEEKDAYS.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <span key={`e${i}`} />;
          const date = iso(day);
          const entry = cityByDate.get(date);
          const today = isToday(date);
          const isSelected = selected === date;
          return (
            <button
              key={date}
              onClick={() => onSelect(date)}
              className={cn(
                "flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition-colors",
                isSelected ? "bg-brand text-white" : "hover:bg-gray-50",
                today && !isSelected && "ring-2 ring-brand/40",
                !entry && !isSelected && "text-gray-400",
              )}
            >
              <span className={cn(isSelected ? "text-white" : "text-gray-800")}>{day}</span>
              {entry && (
                <span
                  className={cn(
                    "mt-0.5 h-1.5 w-1.5 rounded-full",
                    isSelected ? "bg-white" : statusDot[today ? "today" : entry.status],
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-3 text-xs text-gray-500">
        <Legend color="bg-emerald-500" label="Completed" />
        <Legend color="bg-amber-500" label="Pending" />
        <Legend color="bg-gray-300" label="Future" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("h-2 w-2 rounded-full", color)} /> {label}
    </span>
  );
}
