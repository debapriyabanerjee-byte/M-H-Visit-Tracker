import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface Props {
  label: string;
  required?: boolean;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
}

/** Consistent label + control + inline error wrapper for every form field. */
export function Field({ label, required, error, htmlFor, children }: Props) {
  return (
    <div className="mb-4">
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {children}
      {error && <p className="mt-1.5 text-xs font-medium text-brand">{error}</p>}
    </div>
  );
}
