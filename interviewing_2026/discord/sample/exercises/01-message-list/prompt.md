# Exercise 01 — Message list + composer

Build a single-page chat-style view backed by the Rails API.

## Requirements

1. **GET `/api/messages`** returns a list of messages, oldest first. Each message has:
   - `id`
   - `author` (string)
   - `body` (string)
   - `created_at` (ISO 8601 timestamp)
2. **POST `/api/messages`** accepts JSON `{ "message": { "author": "...", "body": "..." } }` and creates a new message. Return the created record on success, or `422` with errors on validation failure.
3. **Validation:** `author` and `body` are both required; `body` ≤ 2000 chars.
4. **Frontend:**
   - On mount, fetch and render the message list — author, body, and a friendly time (e.g., `4:32 PM` or `just now`).
   - A composer at the bottom of the view has an `author` input and a `body` input (textarea), plus a Send button.
   - Submitting POSTs to the API and appends the new message to the list. Clear the body input on success. Disable Send while the request is in flight.
   - Show validation errors inline near the composer.

## Stretch (only if time)

- Press Enter (without Shift) in the body to send.
- Persist `author` to `localStorage` so it survives refresh.

## Hints

- Seed 5–10 messages so the empty state isn't blank on first load.
- For the timestamp, `new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })` is enough — don't reach for a date library.
- CSRF is off in API-only Rails, but you still need to send `Content-Type: application/json`.

## What "done" looks like

You can refresh the page, see seeded messages, type into the composer, send, and watch the new row appear. A blank body submission shows an error and does not clear the input.

## How to run this solution

From the repo root:

```sh
./bin/run-exercise 01-message-list
```

That copies the scaffold + the files in `solution/` into `work/01-message-list/`, runs the migration and seeds, then starts Rails (`:3000`) and Vite (`:5173`). Open <http://localhost:5173>.

Smoke-test the API directly:

```sh
curl http://localhost:3000/api/messages
curl -X POST http://localhost:3000/api/messages \
  -H 'Content-Type: application/json' \
  -d '{"message":{"author":"me","body":"hello"}}'
```

If you'd rather wire it up manually: copy `frontend/`, `backend/`, and `bin/` from the repo root into a fresh dir, overlay the files in `solution/` (paths under `solution/` mirror the scaffold), then `cd backend && bin/rails db:prepare db:seed && cd .. && ./bin/dev`.
