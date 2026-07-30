"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, LayoutDashboard, MapPin, User } from "lucide-react";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

const items = [
  { href: ROUTES.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.visits, label: "Visits", icon: MapPin },
  { href: ROUTES.calendar, label: "Calendar", icon: Calendar },
  { href: ROUTES.profile, label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="no-print sticky bottom-0 z-20 border-t border-gray-100 bg-white/90 backdrop-blur">
      <div className="mx-auto grid max-w-3xl grid-cols-4">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                active ? "text-brand" : "text-gray-400",
              )}
            >
              <Icon className={cn("h-5 w-5", active && "fill-brand-50")} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
