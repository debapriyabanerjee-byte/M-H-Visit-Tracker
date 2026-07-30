"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  id?: string;
  invalid?: boolean;
}

export function SearchableSelect({ options, value, onChange, placeholder, id, invalid }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => options.filter((o) => o.toLowerCase().includes(query.toLowerCase())),
    [options, query],
  );

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function commit(option: string) {
    onChange(option);
    setOpen(false);
    setQuery("");
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[active]) commit(filtered[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-xl border bg-white px-4 text-left text-sm outline-none transition-colors focus:ring-2 focus:ring-brand/20",
          invalid ? "border-brand" : "border-gray-200 focus:border-brand",
          value ? "text-gray-900" : "text-gray-400",
        )}
      >
        <span className="truncate">{value || placeholder || "Select"}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-elevated">
          <div className="flex items-center gap-2 border-b border-gray-100 px-3">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
              placeholder="Search..."
              className="h-11 w-full bg-transparent text-sm outline-none"
            />
          </div>
          <ul role="listbox" className="max-h-60 overflow-auto py-1">
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-gray-400">No matches</li>
            )}
            {filtered.map((opt, i) => (
              <li key={opt}>
                <button
                  type="button"
                  role="option"
                  aria-selected={opt === value}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => commit(opt)}
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm",
                    i === active ? "bg-brand-50 text-brand-700" : "text-gray-700",
                  )}
                >
                  <span className="truncate">{opt}</span>
                  {opt === value && <Check className="h-4 w-4 text-brand" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
