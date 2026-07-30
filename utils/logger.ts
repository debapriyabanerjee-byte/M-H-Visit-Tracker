/* eslint-disable no-console */
// Thin logging wrapper so we can later route to a remote sink without churn.

type Level = "info" | "warn" | "error";

function emit(level: Level, scope: string, message: string, meta?: unknown): void {
  const line = `[MHVT:${scope}] ${message}`;
  if (level === "error") console.error(line, meta ?? "");
  else if (level === "warn") console.warn(line, meta ?? "");
  else console.info(line, meta ?? "");
}

export const logger = {
  info: (scope: string, message: string, meta?: unknown) => emit("info", scope, message, meta),
  warn: (scope: string, message: string, meta?: unknown) => emit("warn", scope, message, meta),
  error: (scope: string, message: string, meta?: unknown) => emit("error", scope, message, meta),
};
