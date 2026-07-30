"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { MultiChips } from "@/components/ui/multi-chips";
import { FormSection } from "@/components/forms/form-section";
import { FollowUpBlock } from "@/components/forms/follow-up-block";
import { SubmitBar } from "@/components/forms/submit-bar";
import { partnerSchema, type PartnerInput } from "@/services/validation";
import {
  ACTION_OWNERS,
  BUSINESS_OPPORTUNITY,
  CONVERSION_PROBABILITY,
  PARTNER_CATEGORIES,
  PARTNER_STATUSES,
  PARTNER_TYPES,
  SUPPORT_REQUIRED,
} from "@/data/dropdowns";
import type { PartnerVisitFields } from "@/types";

const ACTIVE_ISSUE_OPTIONS = [
  "Pricing",
  "Claims",
  "Payout",
  "Technology",
  "Competition",
  "Low Customer Demand",
  "Product Knowledge",
  "RM Support",
  "Product Availability",
  "Policy Issuance Delay",
  "Other",
] as const;

const INACTIVE_ISSUE_OPTIONS = [
  "Shifted to Competitor",
  "Business Closed",
  "Seasonal Business",
  "No Customer Demand",
  "Pricing",
  "Claims",
  "Technology",
  "Relationship Issue",
  "RM Support",
  "Other",
] as const;

const defaults: PartnerInput = {
  partnerName: "",
  partnerType: "Existing Partner",
  partnerGid: "",
  partnerCategory: "",
  partnerStatus: "Active",
  activeIssues: [],
  inactiveIssues: [],
  activationBlockers: "",
  activationPossibility: "",
  businessOpportunity: "",
  conversionProbability: "",
  supportRequired: [],
  actionOwner: "",
  followUpRequired: false,
  followUpDate: "",
  additionalNotes: "",
};

interface Props {
  submitting: boolean;
  onSubmit: (data: PartnerVisitFields) => void;
}

function normalizePartnerPayload(data: PartnerInput): PartnerVisitFields {
  const trimmedActiveIssues = data.activeIssues?.filter((issue) => issue.trim().length > 0);
  const trimmedInactiveIssues = data.inactiveIssues?.filter((issue) => issue.trim().length > 0);
  const activationPossibility = data.activationPossibility?.trim();

  if (data.partnerStatus === "Active") {
    return {
      partnerName: data.partnerName,
      partnerType: data.partnerType,
      partnerGid: data.partnerGid,
      partnerCategory: data.partnerCategory,
      partnerStatus: data.partnerStatus,
      activeIssues: trimmedActiveIssues && trimmedActiveIssues.length > 0 ? trimmedActiveIssues : undefined,
      inactiveIssues: undefined,
      activationBlockers: "",
      activationPossibility: undefined,
      businessOpportunity: data.businessOpportunity,
      conversionProbability: data.conversionProbability,
      supportRequired: data.supportRequired,
      actionOwner: data.actionOwner,
      followUpRequired: data.followUpRequired,
      followUpDate: data.followUpDate,
      additionalNotes: data.additionalNotes,
    };
  }

  return {
    partnerName: data.partnerName,
    partnerType: data.partnerType,
    partnerGid: data.partnerGid,
    partnerCategory: data.partnerCategory,
    partnerStatus: data.partnerStatus,
    activeIssues: undefined,
    inactiveIssues: trimmedInactiveIssues && trimmedInactiveIssues.length > 0 ? trimmedInactiveIssues : undefined,
    activationBlockers: "",
    activationPossibility: activationPossibility ? activationPossibility : undefined,
    businessOpportunity: data.businessOpportunity,
    conversionProbability: data.conversionProbability,
    supportRequired: data.supportRequired,
    actionOwner: data.actionOwner,
    followUpRequired: data.followUpRequired,
    followUpDate: data.followUpDate,
    additionalNotes: data.additionalNotes,
  };
}

export function PartnerForm({ submitting, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<PartnerInput>({ mode: "onChange", resolver: zodResolver(partnerSchema), defaultValues: defaults });

  const partnerType = watch("partnerType");
  const partnerStatus = watch("partnerStatus");
  const followUpRequired = watch("followUpRequired");

  useEffect(() => {
    if (partnerStatus === "Active") {
      setValue("inactiveIssues", [], { shouldDirty: true, shouldValidate: true });
      setValue("activationPossibility", "", { shouldDirty: true, shouldValidate: true });
      clearErrors(["inactiveIssues", "activationPossibility"]);
    } else {
      setValue("activeIssues", [], { shouldDirty: true, shouldValidate: true });
      setValue("activationBlockers", "", { shouldDirty: true, shouldValidate: true });
      clearErrors(["activeIssues", "activationBlockers"]);
    }
  }, [partnerStatus, setValue, clearErrors]);

  return (
    <form onSubmit={handleSubmit((d) => onSubmit(normalizePartnerPayload(d)))} className="space-y-4">
      <FormSection title="Partner Details">
        <Field label="Partner Name" required error={errors.partnerName?.message}>
          <Input {...register("partnerName")} placeholder="Partner / firm name" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Partner Type" required>
            <Controller
              control={control}
              name="partnerType"
              render={({ field }) => (
                <SearchableSelect options={PARTNER_TYPES} value={field.value} onChange={field.onChange} />
              )}
            />
          </Field>
          <Field label="Category" required error={errors.partnerCategory?.message}>
            <Controller
              control={control}
              name="partnerCategory"
              render={({ field }) => (
                <SearchableSelect
                  options={PARTNER_CATEGORIES}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Category"
                  invalid={!!errors.partnerCategory}
                />
              )}
            />
          </Field>
        </div>
        {partnerType === "Existing Partner" && (
          <Field label="Partner GID" required error={errors.partnerGid?.message}>
            <Input {...register("partnerGid")} placeholder="e.g. GID-123456" />
          </Field>
        )}
      </FormSection>

      <FormSection title="Business Status">
        <Field label="Partner Status" required>
          <Controller
            control={control}
            name="partnerStatus"
            render={({ field }) => (
              <SearchableSelect options={PARTNER_STATUSES} value={field.value} onChange={field.onChange} />
            )}
          />
        </Field>
        {partnerStatus === "Active" ? (
          <Field label="Active Issues" error={errors.activeIssues?.message}>
            <Controller
              control={control}
              name="activeIssues"
              rules={{ validate: (value) => (value && value.length > 0 ? true : "Select at least one active issue") }}
              render={({ field }) => (
                <MultiChips
                  options={ACTIVE_ISSUE_OPTIONS}
                  values={field.value ?? []}
                  onChange={field.onChange}
                />
              )}
            />
          </Field>
        ) : (
          <>
            <Field label="Inactive Issues" error={errors.inactiveIssues?.message}>
              <Controller
                control={control}
                name="inactiveIssues"
                rules={{ validate: (value) => (value && value.length > 0 ? true : "Select at least one inactive issue") }}
                render={({ field }) => (
                  <MultiChips
                    options={INACTIVE_ISSUE_OPTIONS}
                    values={field.value ?? []}
                    onChange={field.onChange}
                  />
                )}
              />
            </Field>
            <Field label="Activation Possibility" error={errors.activationPossibility?.message}>
              <Textarea
                {...register("activationPossibility")}
                placeholder="Any activation possibility or next-step signal?"
              />
            </Field>
          </>
        )}
      </FormSection>

      <FormSection title="Growth Opportunity">
        <div className="grid grid-cols-1 gap-3">
          <Field label="Business Opportunity" required error={errors.businessOpportunity?.message}>
            <Controller
              control={control}
              name="businessOpportunity"
              render={({ field }) => (
                <SearchableSelect
                  options={BUSINESS_OPPORTUNITY}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Assess opportunity"
                  invalid={!!errors.businessOpportunity}
                />
              )}
            />
          </Field>
          <Field label="Conversion Probability" required error={errors.conversionProbability?.message}>
            <Controller
              control={control}
              name="conversionProbability"
              render={({ field }) => (
                <SearchableSelect
                  options={CONVERSION_PROBABILITY}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Likelihood"
                  invalid={!!errors.conversionProbability}
                />
              )}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Support Required">
        <Controller
          control={control}
          name="supportRequired"
          render={({ field }) => (
            <MultiChips options={SUPPORT_REQUIRED} values={field.value} onChange={field.onChange} />
          )}
        />
        <div className="mt-4">
          <Field label="Action Owner" required error={errors.actionOwner?.message}>
            <Controller
              control={control}
              name="actionOwner"
              render={({ field }) => (
                <SearchableSelect
                  options={ACTION_OWNERS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Who owns the action?"
                  invalid={!!errors.actionOwner}
                />
              )}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Follow-up & Notes">
        <Controller
          control={control}
          name="followUpRequired"
          render={({ field }) => (
            <Controller
              control={control}
              name="followUpDate"
              render={({ field: dateField }) => (
                <FollowUpBlock
                  required={field.value}
                  date={dateField.value}
                  error={errors.followUpDate?.message}
                  onToggle={field.onChange}
                  onDate={dateField.onChange}
                />
              )}
            />
          )}
        />
        <Field label="Additional Notes" error={errors.additionalNotes?.message}>
          <Textarea {...register("additionalNotes")} placeholder="Anything else worth capturing?" />
        </Field>
      </FormSection>

      <SubmitBar submitting={submitting} followUp={followUpRequired} />
    </form>
  );
}
