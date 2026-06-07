# Exercise 02 — Channel sidebar + main pane

Build a two-pane layout: a sidebar listing channels on the left, and the selected channel's messages on the right.

## Requirements

### API

1. **GET `/api/channels`** returns all channels, each with `id`, `name`, and `topic`. Order by `name` ascending.
2. **GET `/api/channels/:id/messages`** returns the messages in that channel, oldest first. Each message has `id`, `author`, `body`, `created_at`. Return `404` if the channel doesn't exist.

### Models

- `Channel` has many `messages`. `name` is required and unique. `topic` is optional.
- `Message` belongs to a `channel`. `author` and `body` required.

### Frontend

- Two-column layout. Left column: list of channels with `#` prefix. Right column: the selected channel's name + topic in a header, then its messages.
- On mount, fetch channels. Auto-select the first one and load its messages.
- Clicking a channel in the sidebar highlights it and loads its messages. Show a loading state in the right pane while fetching.
- If the user clicks fast between channels, don't let a stale response overwrite a newer one.

## Stretch (only if time)

- Reflect the current channel in the URL via `window.history` or a tiny custom hook, so reload preserves selection.
- Seed enough variety that the topics actually distinguish channels.

## Hints

- For the "stale response" issue: capture a token (the channel id, or an `AbortController`) before the fetch, and ignore the result if it doesn't match the latest selection when it returns.
- The nested route is the natural shape — Rails: `resources :channels, only: [:index] do; resources :messages, only: [:index]; end`.

## What "done" looks like

The page renders with channels in the sidebar, the first channel auto-selected, and its messages on the right. Clicking another channel swaps the right pane to that channel's messages. Mashing the sidebar doesn't flicker old data into the wrong channel.

## How to run this solution

From the repo root:

```sh
./bin/run-exercise 02-channel-sidebar
```

That builds a sandbox at `work/02-channel-sidebar/`, runs the two migrations + seed (5 channels, ~15 messages), and starts both servers. Open <http://localhost:5173>.

Smoke-test the API:

```sh
curl http://localhost:3000/api/channels
curl http://localhost:3000/api/channels/1/messages
curl -i http://localhost:3000/api/channels/9999/messages   # expect 404
```

If you'd rather wire it up manually: copy `frontend/`, `backend/`, and `bin/` from the repo root into a fresh dir, overlay the files in `solution/`, then `cd backend && bin/rails db:prepare db:seed && cd .. && ./bin/dev`.
