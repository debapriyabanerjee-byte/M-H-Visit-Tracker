import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-5">{children}</main>
      <BottomNav />
    </div>
  );
}
