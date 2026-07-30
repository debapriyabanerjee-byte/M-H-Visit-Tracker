import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-surface px-6 text-center">
      <div className="rounded-2xl bg-brand-50 p-4">
        <Compass className="h-8 w-8 text-brand" />
      </div>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Page not found</h1>
      <p className="mt-1 text-sm text-gray-500">The page you are looking for does not exist.</p>
      <Link href={ROUTES.dashboard} className="mt-6">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}
