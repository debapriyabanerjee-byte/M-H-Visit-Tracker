// Submission service — orchestrates the full flow:
// validate -> (photos already compressed) -> build payload -> POST -> result.
// Guards against duplicate submissions via an in-memory lock.

import { postAction } from "@/services/api";
import { storage } from "@/services/storage";
import type {
  ApiResponse,
  CommonVisitFields,
  GpsReading,
  InsurerVisitFields,
  PartnerVisitFields,
  PhotoAsset,
  SubmissionResult,
  TeamVisitFields,
  VisitPayload,
} from "@/types";
import { generateProvisionalId } from "@/utils/submissionId";

let inFlight = false;

export interface SubmitArgs {
  common: CommonVisitFields;
  gps: GpsReading;
  photos: PhotoAsset[];
  partner?: PartnerVisitFields;
  team?: TeamVisitFields;
  insurer?: InsurerVisitFields;
}

export async function submitVisit(args: SubmitArgs): Promise<ApiResponse<SubmissionResult>> {
  if (inFlight) {
    return { status: "error", message: "A submission is already in progress.", errorCode: "INVALID_PAYLOAD" };
  }
  if (!args.gps) {
    return { status: "error", message: "GPS is required.", errorCode: "GPS_REQUIRED" };
  }

  inFlight = true;
  try {
    const payload: VisitPayload = {
      submissionId: generateProvisionalId(),
      common: args.common,
      gps: args.gps,
      // Photos are sent as compressed data URLs; Apps Script uploads to Drive
      // and returns canonical URLs which the sheet stores.
      photoUrls: args.photos.map((p) => p.dataUrl),
      partner: args.partner,
      team: args.team,
      insurer: args.insurer,
      createdAt: new Date().toISOString(),
    };

    const res = await postAction<SubmissionResult>("appendVisit", payload);
    if (res.status === "success") {
      storage.setLastSubmission(res.data);
    }
    return res;
  } finally {
    inFlight = false;
  }
}
