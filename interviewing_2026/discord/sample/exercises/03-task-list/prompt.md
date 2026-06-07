# Exercise 03 — Task list with full CRUD

Build a personal task list. The user can add a task, toggle whether it's done, and delete it.

## Requirements

### API

A `Task` has `id`, `title` (string, required, ≤ 200 chars), `done` (boolean, default false), `created_at`.

| Method | Path | Body | Returns |
|--------|------|------|---------|
| GET    | `/api/tasks`       | —                                | array of tasks, newest first |
| POST   | `/api/tasks`       | `{ "task": { "title": "..." } }` | created task (201) or errors (422) |
| PATCH  | `/api/tasks/:id`   | `{ "task": { "done": true } }`   | updated task or 404 / 422 |
| DELETE | `/api/tasks/:id`   | —                                | 204 No Content, or 404 |

### Frontend

- Input at the top to add a new task; pressing Enter or clicking Add submits.
- A list of tasks below. Each row has:
  - a checkbox bound to `done` — clicking it PATCHes the task and reflects the new state
  - the title (struck-through when done)
  - a delete button (× or "delete") that DELETEs the task and removes the row
- The Add input clears on success and stays focused.
- Show a count footer: `"3 of 7 done"`.

## Stretch (only if time)

- Filter buttons: All / Active / Done.
- Optimistic update on toggle: flip the checkbox immediately, revert on failure.

## Hints

- Don't reach for state management — `useState` per concern is plenty.
- For optimistic toggle: keep the previous value, write the new one to state, run the PATCH, on failure write the old value back and surface a small error.

## What "done" looks like

Loading the page shows seeded tasks. Typing a title and pressing Enter adds it. Checking a box strikes the row through and persists across refresh. The counter updates live. The delete button removes the row.

## How to run this solution

From the repo root:

```sh
./bin/run-exercise 03-task-list
```

That builds a sandbox at `work/03-task-list/`, runs the migration + seed (5 tasks, 2 done), and starts both servers. Open <http://localhost:5173>.

Smoke-test the API:

```sh
curl http://localhost:3000/api/tasks
curl -X POST http://localhost:3000/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{"task":{"title":"buy milk"}}'
curl -X PATCH http://localhost:3000/api/tasks/1 \
  -H 'Content-Type: application/json' \
  -d '{"task":{"done":true}}'
curl -i -X DELETE http://localhost:3000/api/tasks/1     # expect 204
```

If you'd rather wire it up manually: copy `frontend/`, `backend/`, and `bin/` from the repo root into a fresh dir, overlay the files in `solution/`, then `cd backend && bin/rails db:prepare db:seed && cd .. && ./bin/dev`.
