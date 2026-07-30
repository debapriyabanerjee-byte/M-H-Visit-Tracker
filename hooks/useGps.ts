"use client";

import { useCallback, useState } from "react";
import { GPS_ERROR_MESSAGE, captureGps, type GpsError } from "@/services/gps";
import type { GpsReading } from "@/types";

type Status = "idle" | "loading" | "success" | "error";

export function useGps() {
  const [gps, setGps] = useState<GpsReading | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const reading = await captureGps();
      setGps(reading);
      setStatus("success");
    } catch (e) {
      setStatus("error");
      setError(GPS_ERROR_MESSAGE[e as GpsError] ?? "Unable to capture location.");
    }
  }, []);

  return { gps, status, error, request };
}
