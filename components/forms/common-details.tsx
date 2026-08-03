"use client";

import { useEffect } from "react";
import { CheckCircle2, Loader2, MapPinOff } from "lucide-react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Button } from "@/components/ui/button";
import { FormSection } from "@/components/forms/form-section";
import { DESIGNATIONS, ZONES } from "@/data/dropdowns";
import { EMPLOYEE_MASTER, findEmployeeByCode } from "@/data/employeeMaster";
import { accuracyLabel } from "@/utils/gps";
import type { CommonVisitFields, GpsReading } from "@/types";

type Errors = Partial<Record<keyof CommonVisitFields, string>>;

interface Props {
  value: CommonVisitFields;
  onChange: (patch: Partial<CommonVisitFields>) => void;
  errors: Errors;
  gps: GpsReading | null;
  gpsStatus: "idle" | "loading" | "success" | "error";
  gpsError: string | null;
  onRetryGps: () => void;
}

export function CommonDetails({
  value,
  onChange,
  errors,
  gps,
  gpsStatus,
  gpsError,
  onRetryGps,
}: Props) {
  // Auto-fill employee attributes when an employee is chosen from the master.
  useEffect(() => {
    const emp = findEmployeeByCode(value.employeeCode);
    if (emp && emp.employeeName !== value.employeeName) {
      onChange({
        employeeName: emp.employeeName,
        designation: emp.designation,
        reportingZone: emp.zone,
        baseLocation: emp.baseCity,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.employeeCode]);

  const employeeOptions = EMPLOYEE_MASTER.map((e) => `${e.employeeCode} — ${e.employeeName}`);

  return (
    <FormSection title="Visit Details" description="Your details are saved for next time.">
      <Field label="Employee" required error={errors.employeeCode}>
        <SearchableSelect
          options={employeeOptions}
          value={
            value.employeeCode
              ? `${value.employeeCode} — ${value.employeeName}`
              : ""
          }
          onChange={(v) => onChange({ employeeCode: v.split(" — ")[0] })}
          placeholder="Select employee"
          invalid={!!errors.employeeCode}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Designation" required error={errors.designation}>
          <SearchableSelect
            options={DESIGNATIONS}
            value={value.designation}
            onChange={(v) => onChange({ designation: v as CommonVisitFields["designation"] })}
            placeholder="Designation"
            invalid={!!errors.designation}
          />
        </Field>
        <Field label="Reporting Zone" required error={errors.reportingZone}>
          <SearchableSelect
            options={ZONES}
            value={value.reportingZone}
            onChange={(v) => onChange({ reportingZone: v })}
            placeholder="Zone"
            invalid={!!errors.reportingZone}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Visit Date" required error={errors.visitDate}>
          <Input
            type="date"
            value={value.visitDate}
            onChange={(e) => onChange({ visitDate: e.target.value })}
          />
        </Field>
        <Field label="Base Location" error={errors.baseLocation}>
          <Input value={value.baseLocation} readOnly className="bg-gray-50 text-gray-500" />
        </Field>
      </div>

      <Field label="Visit City" required error={errors.visitCity}>
        <Input
          value={value.visitCity}
          onChange={(e) => onChange({ visitCity: e.target.value })}
          placeholder="Enter city"
        />
      </Field>

      <GpsStatus gps={gps} status={gpsStatus} error={gpsError} onRetry={onRetryGps} />
    </FormSection>
  );
}

function GpsStatus({
  gps,
  status,
  error,
  onRetry,
}: {
  gps: GpsReading | null;
  status: Props["gpsStatus"];
  error: string | null;
  onRetry: () => void;
}) {
  return (
    <div className="mt-1 rounded-xl border border-gray-100 bg-gray-50 p-3">
      {status === "loading" && (
        <p className="flex items-center gap-2 text-xs text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Capturing GPS location…
        </p>
      )}
      {status === "success" && gps && (
        <p className="flex items-center gap-2 text-xs text-emerald-700">
          <CheckCircle2 className="h-4 w-4" /> GPS captured · ±{Math.round(gps.accuracy)}m (
          {accuracyLabel(gps.accuracy)})
        </p>
      )}
      {status === "error" && (
        <div className="flex items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-xs text-brand">
            <MapPinOff className="h-4 w-4 shrink-0" /> {error}
          </p>
          <Button size="sm" variant="secondary" onClick={onRetry}>
            Retry
          </Button>
        </div>
      )}
    </div>
  );
}
