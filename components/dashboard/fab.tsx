"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { ROUTES } from "@/constants";

export function FloatingActionButton() {
  return (
    <Link
      href={ROUTES.visits}
      aria-label="Add visit"
      className="no-print fixed bottom-20 right-5 z-30 flex h-14 items-center gap-2 rounded-2xl bg-brand px-5 text-sm font-semibold text-white shadow-elevated transition-transform duration-300 active:scale-95"
    >
      <Plus className="h-5 w-5" />
      Add Visit
    </Link>
  );
}
