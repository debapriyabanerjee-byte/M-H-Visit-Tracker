// ---------------------------------------------------------------------------
// App-wide constants. No magic numbers/strings scattered across the codebase.
// ---------------------------------------------------------------------------

export const APP_NAME = "M&H Visit Tracker";
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0";
export const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT ?? "production";
export const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ?? "";

export const PIPE = "|";

export const MAX_PHOTOS = 3;
export const MAX_IMAGE_DIMENSION = 1280; // px, longest edge after compression
export const IMAGE_QUALITY = 0.7; // jpeg quality

export const GPS_TIMEOUT_MS = 15000;
export const GPS_MAX_AGE_MS = 10000;
export const GPS_ACCURACY_THRESHOLD_M = 100;

export const REQUEST_TIMEOUT_MS = 20000;
export const MAX_RETRIES = 3;
export const RETRY_BASE_DELAY_MS = 800;

export const TRANSITION_MS = 300;

// LocalStorage keys
export const LS_EMPLOYEE = "mhvt.employee";
export const LS_DRAFT_PREFIX = "mhvt.draft.";
export const LS_LAST_SUBMISSION = "mhvt.lastSubmission";

// Routes
export const ROUTES = {
  dashboard: "/",
  visits: "/visits",
  calendar: "/calendar",
  profile: "/profile",
  admin: "/admin",
} as const;

// Brand
export const BRAND = {
  primary: "#B71C1C",
  background: "#FAFAFA",
} as const;
