"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CommonDetails } from "@/components/forms/common-details";
import { PhotoUpload } from "@/components/forms/photo-upload";
import { PartnerForm } from "@/components/forms/partner-form";
import { TeamForm } from "@/components/forms/team-form";
import { InsurerForm } from "@/components/forms/insurer-form";
import { FormSection } from "@/components/forms/form-section";
import { SuccessScreen } from "@/components/forms/success-screen";
import { useApp } from "@/lib/app-context";
import { useGps } from "@/hooks/useGps";
import { useToast } from "@/components/ui/toast";
import { submitVisit } from "@/services/submission";
import { commonSchema } from "@/services/validation";
import { findEmployeeByCode } from "@/data/employeeMaster";
import { todayIso } from "@/utils/date";
import type {
  CommonVisitFields,
  InsurerVisitFields,
  PartnerVisitFields,
  PhotoAsset,
  SubmissionResult,
  TeamVisitFields,
  VisitType,
} from "@/types";

const TABS: VisitType[] = ["Partner Meet", "Team Connect", "Insurer Meet"];

type CommonErrors = Partial<Record<keyof CommonVisitFields, string>>;

export function VisitTabs() {
  const { employee, setEmployee } = useApp();
  const toast = useToast();
  const { gps, status: gpsStatus, error: gpsError, request } = useGps();

  const [tab, setTab] = useState<VisitType>("Partner Meet");
  const [photos, setPhotos] = useState<PhotoAsset[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [primary, setPrimary] = useState({ label: "", value: "" });
  const [commonErrors, setCommonErrors] = useState<CommonErrors>({});

  const [common, setCommon] = useState<CommonVisitFields>({
    employeeName: "",
    employeeCode: "",
    designation: "Regional Manager",
    reportingZone: "",
    baseLocation: "",
    visitDate: todayIso(),
    visitCity: "",
    visitType: "Partner Meet",
  });

  useEffect(() => {
    request();
  }, [request]);

  useEffect(() => {
    if (employee) {
      setCommon((c) => ({
        ...c,
        employeeName: employee.employeeName,
        employeeCode: employee.employeeCode,
        designation: employee.designation,
        reportingZone: employee.zone,
        baseLocation: employee.baseCity,
      }));
    }
  }, [employee]);

  useEffect(() => {
    setCommon((c) => ({ ...c, visitType: tab }));
  }, [tab]);

  // Persist the selected employee so it pre-fills on the next visit.
  useEffect(() => {
    const emp = findEmployeeByCode(common.employeeCode);
    if (emp && emp.employeeCode !== employee?.employeeCode) setEmployee(emp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [common.employeeCode]);

  function patchCommon(patch: Partial<CommonVisitFields>) {
    setCommon((c) => ({ ...c, ...patch }));
  }

  function validateCommon(): boolean {
    const res = commonSchema.safeParse(common);
    if (res.success) {
      setCommonErrors({});
      return true;
    }
    const errs: CommonErrors = {};
    for (const issue of res.error.issues) {
      const key = issue.path[0] as keyof CommonVisitFields;
      errs[key] = issue.message;
    }
    setCommonErrors(errs);
    return false;
  }

  async function run(build: () => {
    partner?: PartnerVisitFields;
    team?: TeamVisitFields;
    insurer?: InsurerVisitFields;
    primaryLabel: string;
    primaryValue: string;
  }) {
    if (!validateCommon()) {
      toast.error("Please complete the required visit details.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (gpsStatus !== "success" || !gps) {
      toast.error("GPS is mandatory. Please capture your location before submitting.");
      return;
    }
    const parts = build();
    setSubmitting(true);
    const res = await submitVisit({
      common,
      gps,
      photos,
      partner: parts.partner,
      team: parts.team,
      insurer: parts.insurer,
    });
    setSubmitting(false);

    if (res.status === "success") {
      setPrimary({ label: parts.primaryLabel, value: parts.primaryValue });
      setResult(res.data);
      toast.success("Visit submitted.");
    } else {
      toast.error(res.message);
    }
  }

  function reset() {
    setResult(null);
    setPhotos([]);
    window.scrollTo({ top: 0 });
  }

  const todaysCount = useMemo(() => 1, []); // optimistic; server dashboard is source of truth

  if (result) {
    return (
      <SuccessScreen
        result={result}
        common={common}
        primaryLabel={primary.label}
        primaryValue={primary.value}
        todaysCount={todaysCount}
        onAddAnother={reset}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="no-scrollbar flex gap-2 overflow-x-auto rounded-2xl bg-white p-1.5 shadow-soft">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "relative flex-1 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
              tab === t ? "text-white" : "text-gray-500",
            )}
          >
            {tab === t && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-xl bg-brand"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{t}</span>
          </button>
        ))}
      </div>

      <CommonDetails
        value={common}
        onChange={patchCommon}
        errors={commonErrors}
        gps={gps}
        gpsStatus={gpsStatus}
        gpsError={gpsError}
        onRetryGps={request}
      />

      <FormSection title="Photos">
        <PhotoUpload photos={photos} onChange={setPhotos} />
      </FormSection>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {tab === "Partner Meet" && (
            <PartnerForm
              submitting={submitting}
              onSubmit={(d) =>
                run(() => ({
                  partner: d,
                  primaryLabel: "Partner",
                  primaryValue: d.partnerName,
                }))
              }
            />
          )}
          {tab === "Team Connect" && (
            <TeamForm
              submitting={submitting}
              onSubmit={(d) =>
                run(() => ({
                  team: d,
                  primaryLabel: "Meeting Type",
                  primaryValue: d.meetingType,
                }))
              }
            />
          )}
          {tab === "Insurer Meet" && (
            <InsurerForm
              submitting={submitting}
              onSubmit={(d) =>
                run(() => ({
                  insurer: d,
                  primaryLabel: "Insurer",
                  primaryValue: d.insurerName,
                }))
              }
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
