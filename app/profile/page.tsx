"use client";

import { useEffect, useState } from "react";
import { LogOut, ShieldCheck, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/app-context";
import { useToast } from "@/components/ui/toast";
import { storage } from "@/services/storage";
import { initials } from "@/utils/format";
import { APP_VERSION } from "@/constants";
import type { SubmissionResult } from "@/types";

export default function ProfilePage() {
  const { employee, clearEmployee } = useApp();
  const toast = useToast();
  const [last, setLast] = useState<SubmissionResult | null>(null);

  useEffect(() => {
    setLast(storage.getLastSubmission());
  }, []);

  function reset() {
    clearEmployee();
    toast.success("Saved employee details cleared.");
  }

  return (
    <AppShell>
      <h1 className="mb-4 text-lg font-bold text-gray-900">Profile</h1>

      <Card className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-lg font-bold text-white">
          {employee ? initials(employee.employeeName) : "—"}
        </div>
        <div className="min-w-0">
          <CardTitle className="truncate">{employee?.employeeName ?? "No employee saved"}</CardTitle>
          <CardSubtitle>
            {employee ? `${employee.employeeCode} · ${employee.designation}` : "Log a visit to save details"}
          </CardSubtitle>
        </div>
      </Card>

      <Card className="mt-4 space-y-3">
        <Detail k="Zone" v={employee?.zone ?? "—"} />
        <Detail k="Region" v={employee?.region ?? "—"} />
        <Detail k="Base Location" v={employee?.baseCity ?? "—"} />
        <Detail
          k="Last Submission"
          v={last ? new Date(last.timestamp).toLocaleString("en-IN") : "None yet"}
        />
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">GPS Status</span>
          <Badge tone="green">Enabled</Badge>
        </div>
        <Detail k="App Version" v={APP_VERSION} />
      </Card>

      <Card className="mt-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-brand" />
          <CardTitle>Privacy Notice</CardTitle>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-gray-500">
          Employee details are stored only on this device (browser storage) to save you re-typing.
          Visit data and GPS coordinates are sent to InsuranceDekho&apos;s internal Google Sheet for
          management reporting. No data is shared with third parties.
        </p>
      </Card>

      <div className="mt-4 space-y-3">
        <Button variant="outline" className="w-full" onClick={reset}>
          <Trash2 className="h-4 w-4" /> Reset Saved Employee Details
        </Button>
      </div>
      <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <LogOut className="h-3.5 w-3.5" /> M&amp;H Visit Tracker v{APP_VERSION}
      </div>
      <div className="h-8" />
    </AppShell>
  );
}

function Detail({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{k}</span>
      <span className="font-medium text-gray-900">{v}</span>
    </div>
  );
}
