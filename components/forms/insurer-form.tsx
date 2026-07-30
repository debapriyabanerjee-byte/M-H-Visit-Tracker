"use client";

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
import { insurerSchema, type InsurerInput } from "@/services/validation";
import { ALL_INSURERS } from "@/data/insurers";
import {
  ACTION_OWNERS,
  INSURER_DISCUSSION_TOPICS,
  MEETING_OUTCOME,
  SUPPORT_REQUIRED,
} from "@/data/dropdowns";
import type { InsurerVisitFields } from "@/types";

const defaults: InsurerInput = {
  insurerName: "",
  contactPerson: "",
  discussionTopics: [],
  outcome: "",
  supportRequired: [],
  actionPlan: "",
  actionOwner: "",
  followUpRequired: false,
  followUpDate: "",
  comments: "",
};

interface Props {
  submitting: boolean;
  onSubmit: (data: InsurerVisitFields) => void;
}

export function InsurerForm({ submitting, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InsurerInput>({ resolver: zodResolver(insurerSchema), defaultValues: defaults });

  return (
    <form onSubmit={handleSubmit((d) => onSubmit(d as InsurerVisitFields))} className="space-y-4">
      <FormSection title="Insurer Details">
        <Field label="Insurer" required error={errors.insurerName?.message}>
          <Controller
            control={control}
            name="insurerName"
            render={({ field }) => (
              <SearchableSelect
                options={ALL_INSURERS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select insurer"
                invalid={!!errors.insurerName}
              />
            )}
          />
        </Field>
        <Field label="Contact Person" required error={errors.contactPerson?.message}>
          <Input {...register("contactPerson")} placeholder="Who did you meet?" />
        </Field>
      </FormSection>

      <FormSection title="Discussion">
        <Field label="Discussion Topics" required error={errors.discussionTopics?.message}>
          <Controller
            control={control}
            name="discussionTopics"
            render={({ field }) => (
              <MultiChips
                options={INSURER_DISCUSSION_TOPICS}
                values={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </Field>
      </FormSection>

      <FormSection title="Outcome">
        <Field label="Meeting Outcome" required error={errors.outcome?.message}>
          <Controller
            control={control}
            name="outcome"
            render={({ field }) => (
              <SearchableSelect
                options={MEETING_OUTCOME}
                value={field.value}
                onChange={field.onChange}
                placeholder="Outcome"
                invalid={!!errors.outcome}
              />
            )}
          />
        </Field>
      </FormSection>

      <FormSection title="Support Required">
        <Controller
          control={control}
          name="supportRequired"
          render={({ field }) => (
            <MultiChips options={SUPPORT_REQUIRED} values={field.value} onChange={field.onChange} />
          )}
        />
      </FormSection>

      <FormSection title="Action Plan">
        <Field label="Action Plan" required error={errors.actionPlan?.message}>
          <Textarea {...register("actionPlan")} placeholder="Agreed next steps" />
        </Field>
        <Field label="Action Owner" required error={errors.actionOwner?.message}>
          <Controller
            control={control}
            name="actionOwner"
            render={({ field }) => (
              <SearchableSelect
                options={ACTION_OWNERS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Owner"
                invalid={!!errors.actionOwner}
              />
            )}
          />
        </Field>
      </FormSection>

      <FormSection title="Follow-up & Comments">
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
        <Field label="Comments" error={errors.comments?.message}>
          <Textarea {...register("comments")} placeholder="Optional" />
        </Field>
      </FormSection>

      <SubmitBar submitting={submitting} />
    </form>
  );
}
