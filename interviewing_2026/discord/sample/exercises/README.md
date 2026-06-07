# Practice Exercises

Five Discord-flavored exercises that mirror the kind of small build the web-app coding interview is likely to ask for. The repo root holds the bare React + Rails scaffold; each folder here is a self-contained prompt plus a worked reference solution.

## Layout per exercise

```
NN-name/
  prompt.md       # the exercise as it might be presented to you
  solution/       # only the files that diverge from the root scaffold
    frontend/src/...
    backend/app/...
    backend/db/migrate/...
    backend/config/routes.rb
```

The solution shows the *delta* from the scaffold. To run a finished solution end-to-end, use the helper script from the repo root:

```sh
./bin/run-exercise 01-message-list
```

The script builds a sandbox under `work/<name>/`, overlays the solution onto a fresh copy of the scaffold, runs migrations + seeds, and starts both servers. The `work/` dir is gitignored.

To practice an exercise from scratch instead: read only the `prompt.md`, then make your changes in your own copy of the scaffold — don't peek at the `solution/` until you're done.

## The five

| # | Exercise | What it exercises |
|---|----------|-------------------|
| [01](01-message-list/prompt.md) | Message list + composer | Fetching a list, posting from a form, optimistic-ish append |
| [02](02-channel-sidebar/prompt.md) | Channel sidebar + main pane | Two-pane layout, selection state, nested resources |
| [03](03-task-list/prompt.md) | Task list with full CRUD | PATCH/DELETE, toggle state, controlled inputs |
| [04](04-member-search/prompt.md) | Member search with debounce | Server-side filtering, debounced input, presence UI |
| [05](05-reactions/prompt.md) | Message reactions | Nested resources, aggregation, toggle add/remove |

## How to use these in prep

- **Pick one cold.** Read only `prompt.md`. Time yourself — most are 30–60 min targets.
- **When stuck**, peek at the solution for the part you're stuck on (model? route? render?) rather than reading the whole thing.
- **After**, diff your code against the solution and note where you reached for a different shape.
