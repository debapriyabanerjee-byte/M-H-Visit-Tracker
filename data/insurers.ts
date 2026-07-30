// ---------------------------------------------------------------------------
// Insurer Master — major insurers in InsuranceDekho's M&H ecosystem.
// General (Motor) + Health carriers. Replaceable with API later.
// ---------------------------------------------------------------------------

export const MOTOR_INSURERS = [
  "HDFC ERGO",
  "ICICI Lombard",
  "Bajaj Allianz",
  "TATA AIG",
  "Reliance General",
  "IFFCO Tokio",
  "Royal Sundaram",
  "Magma HDI",
  "Future Generali",
  "Kotak General",
  "Go Digit",
  "ACKO",
  "Liberty General",
  "Universal Sompo",
  "SBI General",
  "National Insurance",
  "New India Assurance",
  "Oriental Insurance",
  "United India Insurance",
] as const;

export const HEALTH_INSURERS = [
  "Niva Bupa",
  "Star Health",
  "Care Health",
  "Aditya Birla Health",
  "ManipalCigna",
  "HDFC ERGO Health",
  "Reliance Health",
  "Future Generali Health",
  "TATA AIG Health",
  "Kotak Health",
] as const;

export const ALL_INSURERS: string[] = [
  ...new Set<string>([...MOTOR_INSURERS, ...HEALTH_INSURERS]),
].sort((a, b) => a.localeCompare(b));
