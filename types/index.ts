// ---------------------------------------------------------------------------
// M&H Visit Tracker — Domain Types
// Single source of truth for all shared interfaces. No `any` anywhere.
// ---------------------------------------------------------------------------

export type Designation = "ZH" | "RH" | "SH" | "Regional Manager";

export type VisitType = "Partner Meet" | "Team Connect" | "Insurer Meet";

export type TravelStatus = "completed" | "pending" | "future" | "today";

export interface Employee {
  employeeName: string;
  employeeCode: string;
  designation: Designation;
  zone: string;
  region: string;
  baseCity: string;
}

export interface TravelPlanEntry {
  date: string; // ISO yyyy-mm-dd
  city: string;
  leader: string;
  zone: string;
  status: TravelStatus;
}

export interface GpsReading {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface PhotoAsset {
  id: string;
  name: string;
  dataUrl: string; // base64 (compressed) before upload
  sizeKb: number;
}

// ---- Common fields shared by every visit -----------------------------------

export interface CommonVisitFields {
  employeeName: string;
  employeeCode: string;
  designation: Designation;
  reportingZone: string;
  baseLocation: string;
  visitDate: string; // ISO yyyy-mm-dd
  visitCity: string;
  visitType: VisitType;
}

// ---- Partner Meet ----------------------------------------------------------

export type PartnerType = "Existing Partner" | "New Partner";
export type PartnerStatus = "Active" | "Inactive";

export interface PartnerVisitFields {
  partnerName: string;
  partnerType: PartnerType;
  partnerGid?: string; // only when Existing
  partnerCategory: string;
  partnerStatus: PartnerStatus;
  activeIssues?: string[]; // only when Active
  inactiveIssues?: string[]; // only when Inactive
  activationBlockers?: string; // kept empty for active submissions
  activationPossibility?: string; // only when Inactive
  businessOpportunity: string;
  conversionProbability: string;
  supportRequired: string[]; // multi-select
  actionOwner: string;
  followUpRequired: boolean;
  followUpDate?: string;
  additionalNotes?: string;
}

// ---- Team Connect ----------------------------------------------------------

export interface TeamVisitFields {
  meetingType: string;
  teamMemberName: string;
  healthAssessment: string;
  challenges: string[]; // multi-select
  supportRequired: string[]; // multi-select
  actionPlan: string;
  actionOwner: string;
  followUpRequired: boolean;
  followUpDate?: string;
  additionalComments?: string;
}

// ---- Insurer Meet ----------------------------------------------------------

export interface InsurerVisitFields {
  insurerName: string;
  contactPerson: string;
  discussionTopics: string[]; // multi-select
  outcome: string;
  supportRequired: string[]; // multi-select
  actionPlan: string;
  actionOwner: string;
  followUpRequired: boolean;
  followUpDate?: string;
  comments?: string;
}

// ---- Unified submission payload -------------------------------------------

export interface VisitPayload {
  submissionId: string;
  common: CommonVisitFields;
  gps: GpsReading;
  photoUrls: string[];
  partner?: PartnerVisitFields;
  team?: TeamVisitFields;
  insurer?: InsurerVisitFields;
  createdAt: string;
}

// ---- API contracts ---------------------------------------------------------

export type ApiErrorCode =
  | "GPS_REQUIRED"
  | "INVALID_PAYLOAD"
  | "PHOTO_UPLOAD_FAILED"
  | "GOOGLE_SHEET_FAILED"
  | "UNKNOWN_ERROR"
  | "TIMEOUT"
  | "NETWORK_ERROR";

export interface ApiSuccess<T> {
  status: "success";
  data: T;
  message?: string;
}

export interface ApiError {
  status: "error";
  message: string;
  errorCode: ApiErrorCode;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface SubmissionResult {
  submissionId: string;
  timestamp: string;
}

// ---- Dashboard --------------------------------------------------------------

export interface RecentVisit {
  submissionId: string;
  visitType: VisitType;
  primaryName: string; // partner / insurer / team member
  city: string;
  time: string;
  outcome: string;
}

export interface DashboardData {
  todaysVisits: number;
  thisWeekVisits: number;
  partnerMeets: number;
  teamConnects: number;
  insurerMeets: number;
  followUpsPending: number;
  gpsCompliance: number; // percentage 0-100
  travelCompliance: number; // percentage 0-100
  recentVisits: RecentVisit[];
}

export interface FollowUpItem {
  submissionId: string;
  partnerName: string;
  actionOwner: string;
  dueDate: string;
  zone: string;
  leader: string;
  state: "pending" | "due-today" | "overdue" | "completed";
}
