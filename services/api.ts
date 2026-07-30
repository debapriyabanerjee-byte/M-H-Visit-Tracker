// API service — the ONLY module that talks to Google Apps Script.
// Every network call routes through here with retry + timeout handling.

import {
  APPS_SCRIPT_URL,
  MAX_RETRIES,
  REQUEST_TIMEOUT_MS,
  RETRY_BASE_DELAY_MS,
} from "@/constants";
import type { ApiResponse } from "@/types";
import { logger } from "@/utils/logger";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function timedFetch(action: string, body: unknown): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      // text/plain avoids a CORS preflight against Apps Script.
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, payload: body }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function postAction<T>(action: string, body: unknown): Promise<ApiResponse<T>> {
  if (!APPS_SCRIPT_URL) {
    return {
      status: "error",
      message: "Apps Script URL is not configured. Set NEXT_PUBLIC_APPS_SCRIPT_URL.",
      errorCode: "NETWORK_ERROR",
    };
  }

  let lastError = "Unknown error";
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await timedFetch(action, body);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as ApiResponse<T>;
      return json;
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
      const isAbort = lastError.includes("abort");
      logger.warn("api", `attempt ${attempt}/${MAX_RETRIES} failed (${action})`, lastError);
      if (attempt < MAX_RETRIES) await sleep(RETRY_BASE_DELAY_MS * 2 ** (attempt - 1));
      else
        return {
          status: "error",
          message: isAbort
            ? "The request timed out. Please check your connection and retry."
            : "Network request failed. Please retry.",
          errorCode: isAbort ? "TIMEOUT" : "NETWORK_ERROR",
        };
    }
  }
  return { status: "error", message: lastError, errorCode: "UNKNOWN_ERROR" };
}
