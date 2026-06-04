# Application Tracker

A single-page tracker for the 2026 job search. Data lives in `data.json` on disk; a tiny Python
server (`serve.py`) serves the page and writes your edits back to that file.

## Quick start

```sh
cd interviewing_2026/tracker
python3 serve.py
```

Then open **http://localhost:8000** in your browser.

> Open the **localhost URL**, not the `index.html` file directly. A page opened over `file://`
> can't write to disk, so it will just show a "start the server" message.

To stop the server: press **Ctrl-C** in its terminal (or `pkill -f serve.py`).

### Custom port

```sh
python3 serve.py 9000        # http://localhost:9000
```

## How saving works

- On load, the page does `GET data.json`.
- Every edit (status/stage dropdowns, the row editor, add/delete) sends `POST /save`, which
  writes `data.json` (debounced, so rapid edits collapse into one write).
- The header shows the save state: `saving… → ✓ saved to data.json`, or
  `⚠ save failed — is serve.py running?` if the server isn't up.
- Writes are atomic (temp file + rename), so an interrupted save can't corrupt `data.json`.

`data.json` is the single source of truth — commit it to keep history.

## Files

| File | Purpose |
|------|---------|
| `index.html` | The whole app (HTML + CSS + JS, no build step). |
| `data.json`  | All application records. Edited by the app; safe to hand-edit too. |
| `serve.py`   | Static server + `POST /save` endpoint. Python 3.7+, standard library only. |

## Header buttons

- **+ Add company** — new entry.
- **Export JSON** — copies the full dataset to your clipboard (manual backup).
- **Import** — paste a JSON array to replace all data (then it's saved to `data.json`).
- **Reload** — re-reads `data.json` from disk (discards nothing — everything is already saved).

## Features

- **Statuses:** To apply, Applied, In progress, Likely rejected, Rejected, Offer, Withdrawn,
  Won't apply (a lead you've decided to skip).
- **Auto-aging:** an `Applied` row started more than 20 days ago is automatically moved to
  **Likely rejected** on load (and persisted). Tune `LIKELY_REJECT_DAYS` in `index.html`.
- **Smart sort (default):** live applications on top, rejected/likely-rejected/withdrawn at the
  bottom, sorted by start date within each group. Click any column header to override.
- **Pipeline funnel** and **stat cards** summarize the live pipeline.
- **Filters:** search box + status / stage / industry dropdowns + "hide rejected".
- **Company size** column (LinkedIn-sourced employee counts), color-coded by tier.

## Editing the data by hand

`data.json` is a normal JSON array; each entry looks like:

```json
{
 "company": "Gusto",
 "dateStarted": "6/4",
 "role": "Senior SWE, Data Platform",
 "industry": "Payroll / HR Fintech",
 "remote": "SF",
 "tech": "Ruby on Rails",
 "size": "Mid · 4.4k",
 "notes": "...",
 "stage": "Website",
 "nextStage": "",
 "link": "https://...",
 "status": "Applied"
}
```

Dates are `M/D` and assumed to be the current year. After hand-editing the file, click **Reload**
in the app (or just refresh).

## Requirements

Python 3.7+ (standard library only — no `pip install`). No Node, no build step.
