"use client";

import { Bell } from "lucide-react";
import { APP_NAME } from "@/constants";
import { useApp } from "@/lib/app-context";
import { useClock } from "@/hooks/useClock";
import { formatLongDate, formatTime, greeting } from "@/utils/date";

export function Header() {
  const { employee } = useApp();
  const now = useClock();

  return (
    <header className="sticky top-0 z-20 border-b border-gray-100 bg-surface/80 px-5 pb-4 pt-6 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">{APP_NAME}</p>
          <h1 className="mt-1 text-xl font-bold text-gray-900">
            {greeting(now)}
            {employee ? `, ${employee.employeeName.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-0.5 text-xs text-gray-500">
            {formatLongDate(now)} · {formatTime(now)}
          </p>
        </div>
        <button
          aria-label="Notifications"
          className="relative rounded-full border border-gray-100 bg-white p-2.5 shadow-soft"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand" />
        </button>
      </div>
    </header>
  );
}
