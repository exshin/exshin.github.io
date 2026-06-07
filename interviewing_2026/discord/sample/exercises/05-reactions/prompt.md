# Exercise 05 — Message reactions

Render a list of messages, each with reaction chips. Click a chip to toggle your reaction. A quick-pick row lets you add a new reaction to a message.

## Requirements

There's no auth in this exercise. The frontend generates a stable `user_id` (`crypto.randomUUID()`) on first load and stores it in `localStorage`. It sends that id with every request so the backend can attribute reactions.

### API

A `Message` has `id`, `author`, `body`, `created_at`. A `Reaction` belongs to a message and has `emoji` and `user_id`. The pair `(message_id, emoji, user_id)` is unique — a user can react with a given emoji to a message at most once.

1. **GET `/api/messages?user_id=...`** — returns messages, oldest first. Each message includes a `reactions` array of `{ emoji, count, reacted_by_me }` aggregated from the reactions table. `reacted_by_me` is true if this `user_id` has reacted with that emoji.
2. **POST `/api/messages/:id/reactions/toggle`** — body `{ "emoji": "👍", "user_id": "..." }`. If a reaction with that emoji and user already exists, remove it; otherwise create it. Return the updated message (same shape as in `index`). `404` if the message doesn't exist.

### Frontend

- Render each message: author, body, time. Below the body, a row of reaction chips: `👍 3`, `🎉 1`. A chip the current user has reacted to is visibly highlighted.
- Clicking a chip toggles that reaction. The count and highlight update.
- At the end of the row, a small "+" button opens a tiny picker of 6 preset emoji (e.g., 👍 ❤️ 😂 🎉 😮 😢). Clicking one toggles that reaction onto the message. After picking, the picker closes.
- Reactions that hit count 0 disappear from the row.

## Stretch (only if time)

- Optimistic update: flip the chip locally before the server responds; reconcile on result.
- Show a tooltip on each chip with the raw count.

## Hints

- `Message.find(id)` + a single `.includes(:reactions)` is enough — don't over-engineer the query. Aggregate in Ruby in the JSON serializer.
- The toggle endpoint is intentionally one route (not split add/remove) — easier to wire from the frontend with a single click handler.
- For the picker, a tiny `useState` for "which message's picker is open" + click-outside detection is plenty. Don't reach for a popover library.

## What "done" looks like

You see seeded messages with seeded reactions, some already showing as "reacted by you" (because the seed assigned reactions to a fixed test user that matches a hardcoded id for the demo, or — simpler — the seed leaves them all un-reacted by you and you toggle some manually). Clicking a chip toggles your reaction. Adding a new reaction via the picker creates a fresh chip with count 1.

## How to run this solution

From the repo root:

```sh
./bin/run-exercise 05-reactions
```

That builds a sandbox at `work/05-reactions/`, runs both migrations + seed (4 messages, 9 reactions across 3 seed users), and starts both servers. Open <http://localhost:5173>.

Smoke-test the API:

```sh
curl 'http://localhost:3000/api/messages?user_id=me'
curl -X POST 'http://localhost:3000/api/messages/1/reactions/toggle' \
  -H 'Content-Type: application/json' \
  -d '{"emoji":"👍","user_id":"me"}'
# Run the same POST again to see the toggle remove the reaction.
```

If you'd rather wire it up manually: copy `frontend/`, `backend/`, and `bin/` from the repo root into a fresh dir, overlay the files in `solution/`, then `cd backend && bin/rails db:prepare db:seed && cd .. && ./bin/dev`.
