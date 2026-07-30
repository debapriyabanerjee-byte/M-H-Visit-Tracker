"use client";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface Props {
  required: boolean;
  date: string | undefined;
  error?: string;
  onToggle: (v: boolean) => void;
  onDate: (v: string) => void;
}

export function FollowUpBlock({ required, date, error, onToggle, onDate }: Props) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
        <span className="text-sm font-medium text-gray-700">Follow-up required?</span>
        <Switch checked={required} onChange={onToggle} />
      </div>
      {required && (
        <Field label="Follow-up Date" required error={error}>
          <Input type="date" value={date ?? ""} onChange={(e) => onDate(e.target.value)} />
        </Field>
      )}
    </div>
  );
}
