"use client";

import { MapPin, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGps } from "@/hooks/useGps";
import { accuracyLabel, formatCoord } from "@/utils/gps";
import { useEffect } from "react";

export function LocationCard() {
  const { gps, status, error, request } = useGps();

  useEffect(() => {
    request();
  }, [request]);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-brand-50 p-2.5">
          <MapPin className="h-5 w-5 text-brand" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">Current Location</p>
          {status === "loading" && (
            <p className="flex items-center gap-1.5 text-xs text-gray-500">
              <Loader2 className="h-3 w-3 animate-spin" /> Capturing GPS…
            </p>
          )}
          {status === "success" && gps && (
            <p className="text-xs text-gray-500">
              {formatCoord(gps.latitude)}, {formatCoord(gps.longitude)} · ±{Math.round(gps.accuracy)}m (
              {accuracyLabel(gps.accuracy)})
            </p>
          )}
          {status === "error" && (
            <p className="flex items-center gap-1.5 text-xs text-brand">
              <AlertCircle className="h-3 w-3" /> {error}
            </p>
          )}
        </div>
        {status === "error" && (
          <Button size="sm" variant="secondary" onClick={request}>
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}
