"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  options: readonly string[];
  values: string[];
  onChange: (v: string[]) => void;
}

export function MultiChips({ options, values, onChange }: Props) {
  function toggle(option: string) {
    if (values.includes(option)) onChange(values.filter((v) => v !== option));
    else onChange([...values, option]);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = values.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={selected}
            onClick={() => toggle(opt)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-300 active:scale-95",
              selected
                ? "border-brand bg-brand-50 text-brand-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
            )}
          >
            {selected && <Check className="h-3.5 w-3.5" />}
            {opt}
          </button>
        );
      })}
    </div>
  );
}
