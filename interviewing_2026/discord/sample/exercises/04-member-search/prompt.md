# Exercise 04 — Member search with debounce

Build a server member list with a search box that filters server-side.

## Requirements

### API

A `Member` has `id`, `name` (string, required), `handle` (string, e.g. `wumpus`, required, unique), `status` (one of `"online" | "idle" | "dnd" | "offline"`), `avatar_color` (a hex string for the avatar background).

**GET `/api/members?q=...`** returns members whose `name` or `handle` contains `q` (case-insensitive). When `q` is blank, return all. Order by `name` ascending. Limit to 50.

### Frontend

- A search input at the top. On every keystroke, after a 250ms debounce, fetch `/api/members?q=...` and re-render the list.
- Each row shows: a coloured avatar circle with the member's initial, the display name, the `@handle` (muted), and a status dot (green / yellow / red / grey).
- While a fetch is in flight from a search, show a subtle loading affordance (e.g., a "Searching…" badge near the input). Don't fade out the old list — leave it in place until the new result arrives so the UI doesn't jitter.
- An in-flight request must not overwrite a newer one's result.

## Stretch (only if time)

- Add a "Status" filter dropdown (All / Online / Idle / DND / Offline) that combines with the query.
- Show a count: "12 members" or "3 of 47 match".

## Hints

- Debounce: in a `useEffect` keyed on the query, `setTimeout` then `clear` in the cleanup.
- Stale-response guard: use an `AbortController` and `abort()` in the same cleanup, or track a request token and ignore older ones.
- For server-side LIKE in Rails: `Member.where("name ILIKE :q OR handle ILIKE :q", q: "%#{q}%")` — but SQLite uses `LIKE` (case-insensitive for ASCII by default). The solution uses `LIKE` so this works on the scaffold's SQLite.

## What "done" looks like

Type "wu" — after a brief pause the list narrows to members matching "wu". Clear the box — full list returns. Type fast — only the final query's results appear; intermediate fetches don't flash through.

## How to run this solution

From the repo root:

```sh
./bin/run-exercise 04-member-search
```

That builds a sandbox at `work/04-member-search/`, runs the migration + seed (18 members across the 4 statuses), and starts both servers. Open <http://localhost:5173>.

Smoke-test the API:

```sh
curl 'http://localhost:3000/api/members'
curl 'http://localhost:3000/api/members?q=wu'
curl 'http://localhost:3000/api/members?q=@nel'
```

If you'd rather wire it up manually: copy `frontend/`, `backend/`, and `bin/` from the repo root into a fresh dir, overlay the files in `solution/`, then `cd backend && bin/rails db:prepare db:seed && cd .. && ./bin/dev`.
