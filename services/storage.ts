// LocalStorage service — the ONLY module that touches window.localStorage.

import { LS_DRAFT_PREFIX, LS_EMPLOYEE, LS_LAST_SUBMISSION } from "@/constants";
import type { Employee, SubmissionResult } from "@/types";
import { logger } from "@/utils/logger";

function safeGet<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (e) {
    logger.warn("storage", `read failed for ${key}`, e);
    return null;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    logger.warn("storage", `write failed for ${key}`, e);
  }
}

export const storage = {
  getEmployee: () => safeGet<Employee>(LS_EMPLOYEE),
  setEmployee: (e: Employee) => safeSet(LS_EMPLOYEE, e),
  clearEmployee: () => window?.localStorage?.removeItem(LS_EMPLOYEE),

  getDraft: <T>(formKey: string) => safeGet<T>(LS_DRAFT_PREFIX + formKey),
  setDraft: <T>(formKey: string, value: T) => safeSet(LS_DRAFT_PREFIX + formKey, value),
  clearDraft: (formKey: string) => window?.localStorage?.removeItem(LS_DRAFT_PREFIX + formKey),

  getLastSubmission: () => safeGet<SubmissionResult>(LS_LAST_SUBMISSION),
  setLastSubmission: (r: SubmissionResult) => safeSet(LS_LAST_SUBMISSION, r),
};
