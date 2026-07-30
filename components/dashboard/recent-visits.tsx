"use client";

import { motion } from "framer-motion";
import { Building2, Users, Shield, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RecentVisit, VisitType } from "@/types";

const icon: Record<VisitType, typeof Building2> = {
  "Partner Meet": Building2,
  "Team Connect": Users,
  "Insurer Meet": Shield,
};

export function RecentVisits({ visits }: { visits: RecentVisit[] }) {
  if (visits.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
        <p className="text-sm text-gray-500">No visits logged yet. Tap “Add Visit” to start.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {visits.map((v, i) => {
        const Icon = icon[v.visitType];
        return (
          <motion.div
            key={v.submissionId}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-soft"
          >
            <div className="rounded-xl bg-brand-50 p-2.5">
              <Icon className="h-5 w-5 text-brand" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">{v.primaryName}</p>
              <p className="truncate text-xs text-gray-500">
                {v.city} · {v.time}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge tone="brand">{v.visitType.split(" ")[0]}</Badge>
              <span className="text-xs text-gray-400">{v.outcome}</span>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-gray-300" />
          </motion.div>
        );
      })}
    </div>
  );
}
