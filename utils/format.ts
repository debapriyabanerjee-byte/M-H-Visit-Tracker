import { PIPE } from "@/constants";

/** Join a multi-select array for storage: "A|B|C". */
export function joinMulti(values: string[]): string {
  return values.filter(Boolean).join(PIPE);
}

/** Split a stored multi-select string back into an array. */
export function splitMulti(value: string): string[] {
  return value ? value.split(PIPE).filter(Boolean) : [];
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function pct(value: number): string {
  return `${Math.round(value)}%`;
}
