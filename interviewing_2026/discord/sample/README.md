# web_app

React + Ruby on Rails scaffold for a coding-interview exercise.

- **`frontend/`** — Vite + React (port `5173`)
- **`backend/`** — Rails 8 API-only (port `3000`)

The Vite dev server proxies `/api/*` requests to Rails, so the React app can call the backend at relative paths.

## Stack

| Layer    | Tooling                                                 |
| -------- | ------------------------------------------------------- |
| Frontend | React 19, Vite 8, JavaScript                            |
| Backend  | Rails 8.1, Ruby 3.3.11, SQLite, Puma                    |
| CORS     | `rack-cors`, allows `http://localhost:5173`             |

## Run both servers

```sh
./bin/dev
```

That starts Rails on `:3000` and Vite on `:5173`. Open <http://localhost:5173> in a browser — the page fetches `/api/hello` and renders the JSON response.

`Ctrl-C` stops both.

## Run them separately

```sh
# Terminal 1 — Rails API
cd backend
bundle exec rails server -p 3000

# Terminal 2 — React frontend
cd frontend
npm run dev
```

> **Note:** Ruby 3.3.11 lives at `~/.rbenv/versions/3.3.11`. If `rbenv init` isn't in your shell config, prefix backend commands with:
>
> ```sh
> export PATH="$HOME/.rbenv/versions/3.3.11/bin:$PATH"
> ```
>
> Or use `./bin/dev`, which sets the path automatically.

## How the pieces connect

```
Browser → http://localhost:5173/        (Vite dev server serves React)
       → http://localhost:5173/api/*    (Vite proxies to Rails)
                                ↓
                       http://localhost:3000/api/*  (Rails)
```

- React fetch in `frontend/src/App.jsx`: `fetch('/api/hello')`
- Vite proxy config: `frontend/vite.config.js`
- Rails route: `backend/config/routes.rb` → `Api::HelloController#show`
- CORS: `backend/config/initializers/cors.rb` (whitelists `localhost:5173`)

## Quick checks

```sh
curl http://localhost:3000/up           # Rails health
curl http://localhost:3000/api/hello    # Rails API directly
curl http://localhost:5173/api/hello    # via Vite proxy
```

## Practice exercises

The root `frontend/` and `backend/` are the bare scaffold. See [`exercises/`](exercises/README.md) for five Discord-flavored practice prompts with worked reference solutions — each shows only the files that diverge from the scaffold.
