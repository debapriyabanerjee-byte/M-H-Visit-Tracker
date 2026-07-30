"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CheckCircle2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import type { CommonVisitFields, SubmissionResult, VisitType } from "@/types";

interface Props {
  result: SubmissionResult;
  common: CommonVisitFields;
  primaryLabel: string;
  primaryValue: string;
  todaysCount: number;
  onAddAnother: () => void;
}

const label: Record<VisitType, string> = {
  "Partner Meet": "Partner",
  "Team Connect": "Meeting Type",
  "Insurer Meet": "Insurer",
};

export function SuccessScreen({
  result,
  common,
  primaryLabel,
  primaryValue,
  todaysCount,
  onAddAnother,
}: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center py-8">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <CheckCircle2 className="h-20 w-20 text-emerald-500" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-4 text-xl font-bold text-gray-900"
      >
        Visit Submitted Successfully
      </motion.h2>
      <p className="mt-1 text-sm text-gray-500">Your visit has been recorded.</p>

      <Card className="mt-6 w-full space-y-2.5">
        <Row k="Visit ID" v={result.submissionId} mono />
        <Row k="Submitted" v={new Date(result.timestamp).toLocaleString("en-IN")} />
        <Row k="Visit Type" v={common.visitType} />
        <Row k={label[common.visitType] ?? primaryLabel} v={primaryValue} />
        <Row k="City" v={common.visitCity} />
        <div className="flex items-center gap-1.5 pt-1 text-xs font-medium text-emerald-700">
          <MapPin className="h-3.5 w-3.5" /> GPS captured successfully
        </div>
        <div className="border-t border-gray-100 pt-2 text-sm">
          <span className="text-gray-500">Today&apos;s visit count: </span>
          <span className="font-semibold text-gray-900">{todaysCount}</span>
        </div>
      </Card>

      <div className="mt-6 grid w-full grid-cols-2 gap-3">
        <Button variant="secondary" onClick={onAddAnother}>
          Add Another
        </Button>
        <Button onClick={() => router.push(ROUTES.dashboard)}>Back to Dashboard</Button>
      </div>
    </div>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{k}</span>
      <span className={mono ? "font-mono text-gray-900" : "font-medium text-gray-900"}>{v}</span>
    </div>
  );
}
