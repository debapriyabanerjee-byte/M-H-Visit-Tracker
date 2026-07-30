"use client";

import { useEffect, useState } from "react";

/** Live clock that updates every 30s. Returns a stable Date object. */
export function useClock(intervalMs = 30000): Date {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
