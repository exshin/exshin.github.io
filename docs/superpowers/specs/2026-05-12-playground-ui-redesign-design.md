# Playground UI Redesign

**Date:** 2026-05-12
**File touched:** `src/client/app/components/PlaygroundComponent.jsx`, `src/client/css/index.css`

## Goal

Refresh the Playground page so the four projects feel like a curated showcase rather than a row of small text links. Keep the visual language of the rest of the site (DM Sans, accent blue, white background, restrained palette) and push it further: more whitespace, bigger typography, real thumbnails, a cleaner project hero.

## Non-goals

- Changing the interior of any playground (Somnia, Pixel Drawer, TicTacFour, PokePuzzler) — only the wrapper changes.
- Routing / deep linking to a project (`#somnia`, etc.).
- New screenshot assets beyond two small synthesized thumbnails (Pixel Drawer, TicTacFour).
- Backend / data changes.

## Aesthetic direction

Clean, minimal, editorial.

- Generous whitespace.
- Large display headings, sharp typography.
- Subtle 1px dividers in accent color; no heavy borders.
- Muted neutrals + the existing `--accent` (#4a90d9).
- Hover = slight lift + accent line. Transitions ≤150ms.

## Page structure

```
┌──────────────────────────────────────────────────┐
│  PLAYGROUND                                      │  ← header
│  ──────                                          │
│  Things I'm tinkering with at the moment.        │
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────┐ │  ← gallery
│  │ [thumb]  │ │ [thumb]  │ │ [thumb]  │ │[thumb│ │
│  │ Somnia   │ │ Pixel D. │ │ TicTac4  │ │ Poke │ │
│  │ tagline  │ │ tagline  │ │ tagline  │ │ ...  │ │
│  │ SwiftUI  │ │ React    │ │ React    │ │Swift3│ │
│  │ ─────    │ │          │ │          │ │ARCH..│ │
│  └──────────┘ └──────────┘ └──────────┘ └──────┘ │
│   (active card has accent underline)             │
│                                                  │
│  Somnia                       SwiftUI · iOS      │  ← hero
│  ───────────────────────────────────────────     │
│  Somnia is a turn-based match-3 RPG…             │
│                                                  │
│  [ existing project component renders here ]     │
└──────────────────────────────────────────────────┘
```

## Section detail

### 1. Page header

- Replace the existing intro `<p>` with a header block.
- Title: "Playground" — DM Sans, ~30px, weight 500, color `#1a1a1a`, letter-spacing slight negative (-0.01em).
- Short accent divider underneath: 40px × 2px, `background: var(--accent)`.
- Subtitle: "Things I'm tinkering with at the moment." — 14px, color `#777`, weight 400.
- Block spacing: ~32px below before the gallery starts.

### 2. Project gallery (replaces the nav-tabs row)

CSS grid, responsive:

```css
.playground-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 40px;
}
```

Each card is a `<button type="button" class="playground-card-nav">` so keyboard nav works without `href="#"` hacks.

**Card anatomy:**

- Thumbnail: 16:10 ratio, `object-fit: cover`, rounded top corners (4px), no border.
- Title row: project name (DM Sans 500, 16px, `#1a1a1a`), small gap.
- Tagline: 13px, `#666`, line-height 1.5.
- Tech tag: 11px, uppercase, letter-spacing 0.05em, color `#999`, sits at the card footer.
- Card body padding: 14px 16px 12px.
- Card background: `#fff`. Border: 1px solid `#ececec`. Border-radius: 6px.
- Box-shadow: `0 1px 3px rgba(0,0,0,0.04)`.
- Hover: `transform: translateY(-2px)` and shadow deepens to `0 4px 12px rgba(0,0,0,0.08)`. Transition 150ms ease.
- Selected: 2px solid `var(--project-color)` bottom border (extends inside card padding so it doesn't shift size) and persistent `translateY(-2px)`.
- Archived (PokePuzzler): card opacity 0.78, plus a small grey pill "ARCHIVE" in the top-right corner of the card.

**Per-card content:**

| Project       | Thumbnail              | Tagline                              | Tech tag | Project color |
|---------------|------------------------|--------------------------------------|----------|---------------|
| Somnia        | `somnia_battle.png`    | Turn-based match-3 RPG for iOS       | SwiftUI  | `#7a5cd6`     |
| Pixel Drawer  | synthesized pixel grid | Pixel art editor                     | React    | `#4a90d9`     |
| TicTacFour    | synthesized mini board | A bigger tic-tac-toe with simple AI  | React    | `#5cb85c`     |
| Poke Puzzler  | `pp_battle_start.PNG`  | Match-3 prototype (archive)          | Swift3   | `#999999`     |

**Synthesized thumbnails:**

These two are tiny SVGs rendered inline in the component (no new image files). They live behind a thin `.playground-thumb-synth` background to match the 16:10 ratio.

- **Pixel Drawer:** 8×8 grid of `<rect>`s. Most cells `#f5f5f5`, a handful colored to suggest a small drawing — e.g. a tiny smiley or a heart shape. ~4 colors total, drawn from the existing palette (accent, project-color, a warm and a neutral). Renders sharp at any size.
- **TicTacFour:** 4×4 grid lines (drawn as `<path>`s) with 2 X's and 1 O in arbitrary cells. Lines `#ddd`, X in `steelblue` (existing `.color-steelblue`), O in `indianred` (existing `.color-indianred`).

Both SVGs go inside the same `<div className="playground-thumb">` wrapper as the real images so the card layout stays uniform.

### 3. Selected project hero

Replaces the current `.playground-card` block. New class: `.playground-hero`.

- Top row: project title (DM Sans 500, 22px, `color: var(--project-color)`) on the left, tech tag(s) on the right.
- Tech tags render as small pills: 11px uppercase, letter-spacing 0.05em, padding 3px 8px, border-radius 999px, background `#f4f4f4`, color `#666`. Multiple tags separated by a 6px gap.
  - Somnia: `SwiftUI`, `iOS`
  - Pixel Drawer: `React`
  - TicTacFour: `React`
  - Poke Puzzler: `Swift3`, `Archive`
- 1px divider directly under the title row, color `var(--project-color)` at 40% alpha (use a translucent border or a thin `<hr>`). ~16px below the title row, ~20px below the divider before the description.
- Description: 14px, line-height 1.65, color `#444`. Drop the current `.content-description` 12px size — too small.
- No left border bar (the divider does the visual anchoring now).
- Background: `#fff`. Padding: 24px 28px. Border-radius: 6px. Box-shadow: same as gallery cards.
- Margin-bottom: 28px before the project component.

### 4. Project content container

Existing project components keep their fixed widths internally. The wrapper around them gets:

```css
.playground-content {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
```

This stops fixed-width boards (e.g. 666px outer-board) from forcing horizontal page scroll on narrow viewports. No changes to the boards themselves.

### 5. Removed / changed elements

- Remove: `.nav .nav-item` row that currently lists projects.
- Remove: the existing `.playground-card` block (replaced by `.playground-hero`).
- Keep: the existing `--project-color` CSS variable pattern; reuse it on both the active gallery card and the hero.
- Remove: the intro paragraph text "Welcome to my Playground…" — replaced by the new header.

## Component / file changes

### `PlaygroundComponent.jsx`

State shape is unchanged (still a single `contentView` string). Render is restructured into three top-level sections:

```jsx
<PlaygroundHeader />
<PlaygroundGallery
  projects={PROJECTS}
  selected={contentView}
  onSelect={switchContentView} />
<PlaygroundHero project={PROJECTS[contentView]} />
<div className="playground-content">{contentView component}</div>
```

The four project descriptors move out of the giant `if/else` block into a `const PROJECTS` object keyed by name, holding `title`, `tagline`, `description`, `techTags` (array), `projectColor`, `thumb` (either an image path or `'synth:pixel'` / `'synth:tictac'`), `archived` (bool), and `Component`.

Sub-components (defined in the same file, no new files unless any grows past ~60 lines):

- `PlaygroundHeader` — static, no props.
- `PlaygroundGallery` — renders the grid; maps `PROJECTS` to `PlaygroundGalleryCard`.
- `PlaygroundGalleryCard` — one card, takes `project`, `selected`, `onSelect`.
- `PlaygroundThumb` — picks image vs synthesized SVG based on `thumb` value.
- `PlaygroundHero` — title row + divider + description.

### `index.css`

Add a new "Playground" section at the bottom of the file with all the styles above. Remove the now-orphaned `.playground-card` selectors (the ones styling the old description block) along with their `h4`, `.content-description`, and `.tech-tag` sub-rules inside `.playground-card`. Keep the standalone `.content-description` / `.tech-tag` rules earlier in the file in case other components reference them — verify by grep before deleting; if no other refs, drop them too.

## Responsive behavior

- ≥900px: gallery is 4 columns.
- 600–899px: gallery is 2 columns.
- <600px: gallery is 1 column. Hero title row stacks (title above tags). Project content area scrolls horizontally if its inner board is wider than the viewport.

Driven entirely by the `auto-fit, minmax(220px, 1fr)` grid; no media queries needed for the gallery itself. The hero stacking and the hero padding reduction on small viewports use a single `@media (max-width: 600px)` block.

## Accessibility

- Gallery cards are `<button>`s with `aria-pressed={selected}`.
- Each card has a visible focus ring (2px accent outline, 2px offset).
- Thumbnails use empty `alt=""` since the title is right beneath them (decorative).
- Color is never the only signal: the selected card has both an accent underline and the lift, not just color.

## Verification

After implementation:

- Run `npm run build` (or whatever the existing build command is — check `package.json`) and confirm no errors.
- Open `index.html` in a browser, switch between all four projects, confirm:
  - Header and subtitle render.
  - Gallery shows four cards, two columns on a mid-size window, four on a wide window.
  - Selected card has accent underline; others don't.
  - Hero updates title, tech pills, description, and divider color per project.
  - Project content (Somnia, Pixel, TicTac, Poke) still renders and is interactive.
  - Resizing to ~375px width: cards stack vertically, hero stacks, page doesn't horizontally scroll.
  - PokePuzzler card shows the "ARCHIVE" pill and is visibly muted.
- Keyboard: Tab cycles through the four cards; Enter / Space activates them.

## Open questions

None — taglines, thumbnails, and aesthetic direction are all approved.
