import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";

export default function ErrorInfoPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-surface px-6 text-center">
      <div className="rounded-2xl bg-amber-50 p-4">
        <AlertTriangle className="h-8 w-8 text-amber-600" />
      </div>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Application Error</h1>
      <p className="mt-1 text-sm text-gray-500">
        If this keeps happening, contact the M&amp;H analytics team.
      </p>
      <Link href={ROUTES.dashboard} className="mt-6">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}
