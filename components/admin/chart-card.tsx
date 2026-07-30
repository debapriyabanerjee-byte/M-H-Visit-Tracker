import type { ReactNode } from "react";

export function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-soft">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">{title}</h3>
      <div className="h-64">{children}</div>
    </div>
  );
}
