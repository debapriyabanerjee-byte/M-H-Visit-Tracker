"use client";

import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ADMIN_VISITS } from "@/data/adminMock";
import { downloadCsv } from "@/utils/export";

const PAGE_SIZE = 5;

const outcomeTone = (o: string): "green" | "amber" | "brand" | "gray" => {
  if (o.startsWith("Positive")) return "green";
  if (o.startsWith("Neutral")) return "amber";
  if (o.startsWith("Blocked")) return "brand";
  return "gray";
};

export function VisitsTable() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return ADMIN_VISITS.filter((r) =>
      [r.submissionId, r.leader, r.zone, r.visitType, r.city].some((f) =>
        f.toLowerCase().includes(q),
      ),
    );
  }, [query]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-soft">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Recent Visits</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
              placeholder="Search…"
              className="h-10 w-40 bg-transparent text-sm outline-none"
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => downloadCsv("mh-visits.csv", filtered as unknown as Record<string, unknown>[])}
          >
            <Download className="h-4 w-4" /> CSV
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase text-gray-400">
              <th className="py-2 pr-4 font-medium">Visit ID</th>
              <th className="py-2 pr-4 font-medium">Leader</th>
              <th className="py-2 pr-4 font-medium">Type</th>
              <th className="py-2 pr-4 font-medium">City</th>
              <th className="py-2 pr-4 font-medium">Date</th>
              <th className="py-2 font-medium">Outcome</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.submissionId} className="border-b border-gray-50">
                <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">{r.submissionId}</td>
                <td className="py-2.5 pr-4 text-gray-700">{r.leader}</td>
                <td className="py-2.5 pr-4 text-gray-700">{r.visitType}</td>
                <td className="py-2.5 pr-4 text-gray-700">{r.city}</td>
                <td className="py-2.5 pr-4 text-gray-500">{r.date}</td>
                <td className="py-2.5">
                  <Badge tone={outcomeTone(r.outcome)}>{r.outcome}</Badge>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-400">
                  No visits match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>
          Page {page + 1} of {pages}
        </span>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Prev
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= pages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
