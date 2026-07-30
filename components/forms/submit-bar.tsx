"use client";

import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  submitting: boolean;
  followUp?: boolean;
}

export function SubmitBar({ submitting }: Props) {
  return (
    <div className="sticky bottom-16 z-10 -mx-5 border-t border-gray-100 bg-surface/90 px-5 py-3 backdrop-blur">
      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Submitting…
          </>
        ) : (
          <>
            <Send className="h-5 w-5" /> Submit Visit
          </>
        )}
      </Button>
    </div>
  );
}
