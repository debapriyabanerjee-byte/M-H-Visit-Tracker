// Client-side provisional ID. The server (Apps Script) is authoritative and
// may re-issue a sequential ID; treat this as an optimistic default.

import { toIso } from "@/utils/date";

export function generateProvisionalId(date = new Date()): string {
  const stamp = toIso(date).replace(/-/g, "");
  const seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0");
  return `MH-${stamp}-${seq}`;
}
