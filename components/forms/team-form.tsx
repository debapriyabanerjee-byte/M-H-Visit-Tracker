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
import { teamSchema, type TeamInput } from "@/services/validation";
import {
  ACTION_OWNERS,
  HEALTH_ASSESSMENT,
  SUPPORT_REQUIRED,
  TEAM_CHALLENGES,
  TEAM_MEETING_TYPES,
} from "@/data/dropdowns";
import type { TeamVisitFields } from "@/types";

const defaults: TeamInput = {
  meetingType: "",
  teamMemberName: "",
  healthAssessment: "",
  challenges: [],
  supportRequired: [],
  actionPlan: "",
  actionOwner: "",
  followUpRequired: false,
  followUpDate: "",
  additionalComments: "",
};

interface Props {
  submitting: boolean;
  onSubmit: (data: TeamVisitFields) => void;
}

export function TeamForm({ submitting, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TeamInput>({ resolver: zodResolver(teamSchema), defaultValues: defaults });

  return (
    <form onSubmit={handleSubmit((d) => onSubmit(d as TeamVisitFields))} className="space-y-4">
      <FormSection title="Meeting Details">
        <div className="grid grid-cols-1 gap-3">
          <Field label="Meeting Type" required error={errors.meetingType?.message}>
            <Controller
              control={control}
              name="meetingType"
              render={({ field }) => (
                <SearchableSelect
                  options={TEAM_MEETING_TYPES}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Type of meeting"
                  invalid={!!errors.meetingType}
                />
              )}
            />
          </Field>
          <Field label="Team Member" required error={errors.teamMemberName?.message}>
            <Input {...register("teamMemberName")} placeholder="Name / role" />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Health Assessment">
        <Field label="Assessment" required error={errors.healthAssessment?.message}>
          <Controller
            control={control}
            name="healthAssessment"
            render={({ field }) => (
              <SearchableSelect
                options={HEALTH_ASSESSMENT}
                value={field.value}
                onChange={field.onChange}
                placeholder="RAG status"
                invalid={!!errors.healthAssessment}
              />
            )}
          />
        </Field>
      </FormSection>

      <FormSection title="Challenges">
        <Controller
          control={control}
          name="challenges"
          render={({ field }) => (
            <MultiChips options={TEAM_CHALLENGES} values={field.value} onChange={field.onChange} />
          )}
        />
      </FormSection>

      <FormSection title="Support">
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
        <Field label="Additional Comments" error={errors.additionalComments?.message}>
          <Textarea {...register("additionalComments")} placeholder="Optional" />
        </Field>
      </FormSection>

      <SubmitBar submitting={submitting} />
    </form>
  );
}
