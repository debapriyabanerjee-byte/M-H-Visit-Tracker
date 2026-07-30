"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: boolean;
  index?: number;
}

export function KpiCard({ label, value, icon: Icon, accent, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={cn(
        "rounded-2xl border p-4 shadow-soft",
        accent ? "border-brand/20 bg-brand text-white" : "border-gray-100 bg-white",
      )}
    >
      <div className="flex items-center justify-between">
        <span className={cn("text-xs font-medium", accent ? "text-white/80" : "text-gray-500")}>
          {label}
        </span>
        <Icon className={cn("h-4 w-4", accent ? "text-white/80" : "text-brand")} />
      </div>
      <p className={cn("mt-2 text-2xl font-bold", accent ? "text-white" : "text-gray-900")}>
        {value}
      </p>
    </motion.div>
  );
}
