# static/

Standalone static pages served **verbatim** at the site root by GitHub Pages.

The deploy workflow (`.github/workflows/deploy.yml`) copies the entire contents
of this directory into the published site:

```sh
cp -r static/. _site/
```

So a file at `static/<name>/index.html` is served at `https://exshin.github.io/<name>/`.

| Path in repo                | Live URL                          |
| --------------------------- | --------------------------------- |
| `static/scribe/index.html`  | `https://exshin.github.io/scribe/` |
| `static/ripple/index.html`  | `https://exshin.github.io/ripple/` |

To add a new static page, drop it in here under its own folder — no workflow
changes needed. The React SPA is built and assembled separately in the same
workflow; this directory is only for plain HTML/CSS/JS pages.
