"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logger } from "@/utils/logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("app", "Unhandled error boundary", error.message);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-surface px-6 text-center">
      <div className="rounded-2xl bg-amber-50 p-4">
        <AlertTriangle className="h-8 w-8 text-amber-600" />
      </div>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Something went wrong</h1>
      <p className="mt-1 max-w-sm text-sm text-gray-500">
        An unexpected error occurred. Your entered data is preserved where possible. Please retry.
      </p>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
