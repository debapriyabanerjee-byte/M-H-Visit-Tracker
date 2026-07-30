import type { GpsReading } from "@/types";

export function isAccurate(gps: GpsReading | null, thresholdMeters = 100): boolean {
  return !!gps && gps.accuracy <= thresholdMeters;
}

export function formatCoord(value: number): string {
  return value.toFixed(6);
}

export function accuracyLabel(accuracy: number): string {
  if (accuracy <= 20) return "Excellent";
  if (accuracy <= 50) return "Good";
  if (accuracy <= 100) return "Fair";
  return "Poor";
}
