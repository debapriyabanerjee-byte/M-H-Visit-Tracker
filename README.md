# M&H Visit Tracker

Internal enterprise app for InsuranceDekho M&H leadership (ZH / RH / SH /
Regional Managers) to capture market visits — partner meets, team connects, and
insurer meets — with GPS, photos, and follow-up actions. Replaces Google Forms
with a premium mobile-CRM experience. Data lands in Google Sheets; photos in
Google Drive.

---

## ⚠️ Read this first (honest status)

- **Employee & travel-plan data is REAL.** `data/employeeMaster.ts` (28
  leaders — ZH/RH/SH/Regional Manager) and `data/travelPlan.ts` (355 planned
  visits) are generated from the supplied August 2026 Travel Plan workbook.
  Travel `status` is derived live from the current date (past → completed,
  today → today, else future), so the calendar and compliance widgets stay
  accurate through the month with no backend. To keep the roster current after
  go-live, wire the Apps Script `getEmployeeMaster()` / `getTravelPlan()`
  endpoints (see below); types are stable, so nothing else changes. Note: the
  zone taxonomy from the workbook is North / RON (Rest of North) / E&C (East &
  Central) / South / West — `data/dropdowns.ts` was aligned to match.
- **Admin analytics use sample data.** `data/adminMock.ts` powers the admin
  charts so the MIS view is meaningful on a fresh deploy. Once real submissions
  exist, point the admin charts at a live analytics endpoint and delete the
  mock. The spec's full 20-chart set is represented here by a curated,
  production-quality subset (zone, type split, daily trend, top support) plus
  compliance bars and an exportable table; add more chart components in
  `components/admin/` following the same pattern.
- Everything else — the four visit flows, GPS capture, photo compression,
  offline/retry handling, dashboard, calendar, profile, and the complete Apps
  Script backend — is fully implemented and the project builds clean
  (`next build` passes with no type or lint errors).

---

## Features

- Three visit types with conditional wizard-style forms and inline Zod validation
- Mandatory GPS capture (latitude, longitude, accuracy, timestamp) with retry
- Client-side image compression, up to 3 photos, thumbnail preview + delete
- Employee details persisted to LocalStorage and pre-filled on the next visit
- Draft-safe, duplicate-submission-locked submission flow with 3× retry + backoff
- Dashboard: KPIs, live GPS card, August 2026 travel calendar, recent visits
- Travel calendar with per-day detail and travel-compliance meter
- Admin MIS: KPI cards, Recharts analytics, compliance bars, searchable table
  with CSV export
- Success screen with visit ID, GPS confirmation, and today's count
- Graceful 404 / error boundaries, toast notifications, offline awareness

## Technology stack

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS ·
Framer Motion · React Hook Form + Zod · Recharts · Lucide · Google Apps Script ·
Google Sheets · Google Drive · Vercel.

State: React Context (no Redux/Zustand). Storage: LocalStorage (no external DB).

## Folder structure

```
app/          Routes: / (dashboard), /visits, /calendar, /profile, /admin,
              not-found, error
components/    ui/ · layout/ · dashboard/ · forms/ · calendar/ · admin/
services/      api · gps · image · storage · submission · validation ·
              dashboard · calendar   (all business logic lives here)
hooks/         useClock · useGps · useOnline · useDashboard
lib/           cn() util · app-context
utils/         date · gps · format · submissionId · export · logger
constants/     app-wide constants and routes
data/          employeeMaster · travelPlan · dropdowns · insurers · cities ·
              adminMock   (swap these for API calls with zero UI change)
types/         all shared interfaces (no `any`)
docs/          sheet templates + setup guides
Google_Apps_Script.gs
```

## Local development

```bash
npm install
cp .env.example .env.local   # fill in NEXT_PUBLIC_APPS_SCRIPT_URL
npm run dev                  # http://localhost:3000
npm run build                # production build
npm run lint                 # eslint
npm run typecheck            # tsc --noEmit
```

> Note: `npm install` pins **Next 15.5.22** (a patched 15.x line). The generator
> originally selected 15.1.6 but bumped it to avoid a known CVE in that version.

## Google Apps Script setup

See `docs/GOOGLE_SHEET_SETUP.md` for the full walkthrough. In short:

1. Create a Google Sheet, open **Extensions → Apps Script**, paste
   `Google_Apps_Script.gs`.
2. Run `setupWorkbook()` once and grant permissions — this creates the six tabs.
3. **Deploy → New deployment → Web app**, *Execute as: Me*, *Who has access:
   Anyone*.
4. Copy the `/exec` URL into `NEXT_PUBLIC_APPS_SCRIPT_URL`.

The frontend sends requests as `text/plain` so the browser skips the CORS
preflight (Apps Script cannot answer `OPTIONS`). This is intentional and
correct.

## Google Drive permissions

On first run, Apps Script requests Drive access to create the folder tree
`MH Visit Photos / <Year> / <Month> / <Submission ID>` and to store compressed
images. Photo links are set to *anyone with the link can view* so they render in
the sheet and BI tools; tighten this in `uploadPhotos()` if your policy requires
domain-restricted access.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_APPS_SCRIPT_URL` | Deployed Apps Script Web App `/exec` URL |
| `NEXT_PUBLIC_APP_VERSION` | Version shown on Profile |
| `NEXT_PUBLIC_ENVIRONMENT` | `development` / `staging` / `production` |

## Vercel deployment

1. Push this repo to GitHub.
2. Import into Vercel (framework auto-detected as Next.js).
3. Add the three environment variables above.
4. Deploy. `bom1` (Mumbai) region is preset in `vercel.json`.

## Data contract

`Responses` is one row per visit, stable headers, pipe-delimited multi-selects
(`Pricing|Claims`). Directly consumable by Power BI / Looker Studio.

## Troubleshooting

- **Submissions fail / "Apps Script URL is not configured".** Set
  `NEXT_PUBLIC_APPS_SCRIPT_URL` and redeploy.
- **CORS error in console.** Ensure the Web App access is *Anyone*, and that you
  redeployed after code changes (Apps Script versions each deployment).
- **GPS blocked.** The site must be HTTPS (Vercel is). The user must grant
  location permission; the form disables submit until GPS is captured.
- **Photos not appearing.** Confirm Drive permission was granted on first run
  and that images are under the 3-photo limit.
- **Calendar empty.** It reads `data/travelPlan.ts`; populate it or wire the
  `travel-plan` endpoint.

## Future improvements

Authentication + role-based access, dynamic employee/dropdown/travel masters via
API, PWA + offline sync, WhatsApp/email notifications, Power BI embedding, AI
visit summaries, OCR business-card scan, voice notes. The data layer is isolated
in `data/` and `services/` so these can be added without UI refactors.

## FAQ

**Can a leader submit without GPS?** No — GPS is mandatory and submit stays
disabled until capture succeeds.

**Is employee data sent anywhere?** It's stored locally for convenience; visit
data + GPS go only to the internal Google Sheet.

**Why Next 15.5 instead of 15.1?** Security patch. See the note above.
