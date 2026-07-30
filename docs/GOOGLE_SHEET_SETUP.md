# Google Sheet Setup

You have two options.

## Option A — automatic (recommended)
1. Create a new Google Sheet named **M&H Visit Tracker DB**.
2. Open **Extensions → Apps Script**, delete the boilerplate, paste
   `Google_Apps_Script.gs`, and save.
3. In the Apps Script editor, run the `setupWorkbook` function once and grant
   the requested Drive/Sheets permissions. This creates all six tabs with the
   correct headers: `Responses`, `Employee_Master`, `Travel_Plan`,
   `Dropdown_Master`, `Dashboard`, `Settings`.
4. Paste your real employee and travel-plan rows into `Employee_Master` and
   `Travel_Plan`.

## Option B — manual
Create six tabs and import the matching CSV from `docs/sheet-templates/`:
`Responses_Header.csv`, `Employee_Master.csv`, `Travel_Plan.csv`,
`Dropdown_Master.csv`. Add empty `Dashboard` and `Settings` tabs.

## Deploy the Web App
Deploy → New deployment → **Web app**:
- Execute as: **Me**
- Who has access: **Anyone**

Copy the `/exec` URL into `NEXT_PUBLIC_APPS_SCRIPT_URL` on Vercel.

## Travel_Plan `Status` values
`completed` · `pending` · `future` (today is highlighted automatically).

## Power BI / Looker Studio
The `Responses` tab is one row per visit with stable headers and pipe-delimited
multi-selects (e.g. `Pricing|Claims`). Connect directly — no transformation
needed. Split pipe fields in the BI tool if you need per-value analysis.
