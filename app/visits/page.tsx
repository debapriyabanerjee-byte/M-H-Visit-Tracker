import { AppShell } from "@/components/layout/app-shell";
import { VisitTabs } from "@/components/forms/visit-tabs";

export default function VisitsPage() {
  return (
    <AppShell>
      <div className="pb-8">
        <h1 className="mb-1 text-lg font-bold text-gray-900">Log a Visit</h1>
        <p className="mb-4 text-sm text-gray-500">
          Capture a market visit in under two minutes.
        </p>
        <VisitTabs />
      </div>
    </AppShell>
  );
}
