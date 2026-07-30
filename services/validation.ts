// Validation service — Zod schemas shared by forms and (conceptually) the
// server contract. Single source of truth for validation rules.

import { z } from "zod";

const nonEmpty = (label: string) => z.string().trim().min(1, `${label} is required`);

export const commonSchema = z.object({
  employeeName: nonEmpty("Employee name"),
  employeeCode: nonEmpty("Employee code"),
  designation: z.enum(["ZH", "RH", "SH", "Regional Manager"]),
  reportingZone: nonEmpty("Reporting zone"),
  baseLocation: nonEmpty("Base location"),
  visitDate: nonEmpty("Visit date"),
  visitCity: nonEmpty("Visit city"),
  visitType: z.enum(["Partner Meet", "Team Connect", "Insurer Meet"]),
});

export const partnerSchema = z
  .object({
    partnerName: nonEmpty("Partner name"),
    partnerType: z.enum(["Existing Partner", "New Partner"]),
    partnerGid: z.string().trim().optional(),
    partnerCategory: nonEmpty("Partner category"),
    partnerStatus: z.enum(["Active", "Inactive"]),
    activeIssues: z.array(z.string()).optional(),
    inactiveIssues: z.array(z.string()).optional(),
    activationBlockers: z.string().trim().optional(),
    activationPossibility: z.string().trim().optional(),
    businessOpportunity: nonEmpty("Business opportunity"),
    conversionProbability: nonEmpty("Conversion probability"),
    supportRequired: z.array(z.string()),
    actionOwner: nonEmpty("Action owner"),
    followUpRequired: z.boolean(),
    followUpDate: z.string().trim().optional(),
    additionalNotes: z.string().trim().optional(),
  })
  .superRefine((v, ctx) => {
    if (v.partnerType === "Existing Partner" && !v.partnerGid) {
      ctx.addIssue({ code: "custom", path: ["partnerGid"], message: "Partner GID is required for existing partners" });
    }
    if (v.partnerStatus === "Active") {
      if (!v.activeIssues || v.activeIssues.length === 0) {
        ctx.addIssue({ code: "custom", path: ["activeIssues"], message: "Select at least one active issue" });
      }
    }
    if (v.partnerStatus === "Inactive") {
      if (!v.inactiveIssues || v.inactiveIssues.length === 0) {
        ctx.addIssue({ code: "custom", path: ["inactiveIssues"], message: "Select at least one inactive issue" });
      }
    }
    if (v.followUpRequired && !v.followUpDate) {
      ctx.addIssue({ code: "custom", path: ["followUpDate"], message: "Follow-up date is required" });
    }
  });

export const teamSchema = z
  .object({
    meetingType: nonEmpty("Meeting type"),
    teamMemberName: nonEmpty("Team member name"),
    healthAssessment: nonEmpty("Health assessment"),
    challenges: z.array(z.string()),
    supportRequired: z.array(z.string()),
    actionPlan: nonEmpty("Action plan"),
    actionOwner: nonEmpty("Action owner"),
    followUpRequired: z.boolean(),
    followUpDate: z.string().trim().optional(),
    additionalComments: z.string().trim().optional(),
  })
  .superRefine((v, ctx) => {
    if (v.followUpRequired && !v.followUpDate) {
      ctx.addIssue({ code: "custom", path: ["followUpDate"], message: "Follow-up date is required" });
    }
  });

export const insurerSchema = z
  .object({
    insurerName: nonEmpty("Insurer name"),
    contactPerson: nonEmpty("Contact person"),
    discussionTopics: z.array(z.string()).min(1, "Select at least one discussion topic"),
    outcome: nonEmpty("Outcome"),
    supportRequired: z.array(z.string()),
    actionPlan: nonEmpty("Action plan"),
    actionOwner: nonEmpty("Action owner"),
    followUpRequired: z.boolean(),
    followUpDate: z.string().trim().optional(),
    comments: z.string().trim().optional(),
  })
  .superRefine((v, ctx) => {
    if (v.followUpRequired && !v.followUpDate) {
      ctx.addIssue({ code: "custom", path: ["followUpDate"], message: "Follow-up date is required" });
    }
  });

export type CommonInput = z.infer<typeof commonSchema>;
export type PartnerInput = z.infer<typeof partnerSchema>;
export type TeamInput = z.infer<typeof teamSchema>;
export type InsurerInput = z.infer<typeof insurerSchema>;
