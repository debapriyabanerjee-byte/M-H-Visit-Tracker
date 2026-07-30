// GPS service — wraps the browser Geolocation API with typed results.

import { GPS_MAX_AGE_MS, GPS_TIMEOUT_MS } from "@/constants";
import type { GpsReading } from "@/types";

export type GpsError = "UNSUPPORTED" | "PERMISSION_DENIED" | "UNAVAILABLE" | "TIMEOUT";

export function captureGps(): Promise<GpsReading> {
  return new Promise((resolve, reject: (e: GpsError) => void) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject("UNSUPPORTED");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        });
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) reject("PERMISSION_DENIED");
        else if (err.code === err.TIMEOUT) reject("TIMEOUT");
        else reject("UNAVAILABLE");
      },
      { enableHighAccuracy: true, timeout: GPS_TIMEOUT_MS, maximumAge: GPS_MAX_AGE_MS },
    );
  });
}

export const GPS_ERROR_MESSAGE: Record<GpsError, string> = {
  UNSUPPORTED: "Your device does not support location services.",
  PERMISSION_DENIED:
    "Location permission was denied. GPS is mandatory to log a visit — please enable location access and retry.",
  UNAVAILABLE: "We could not determine your location. Please move to an open area and retry.",
  TIMEOUT: "Location request timed out. Please retry.",
};
