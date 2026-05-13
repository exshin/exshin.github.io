# Resume UI Redesign

**Date:** 2026-05-12
**Files touched:** `src/client/app/components/ResumeComponent.jsx`, all `src/client/app/components/Resume/*.jsx` (consolidated into data), `src/client/css/index.css`

## Goal

Replace the current two-pane resume (left sidebar of role links + right pane of bullets) with a single-column accordion of role cards, grouped by company. Keep the site's visual language (DM Sans, accent blue, white background, restrained palette) and push it the same way the Playground page was pushed: generous whitespace, large display headings, sharp typography, subtle 1px dividers in accent color, hover lifts ≤150ms.

## Non-goals

- Routing / deep linking to a specific role (`#zen-sr-billing`, etc.).
- New image assets — reuse the existing `zendesk_logo2.png` and `RivieraLogo.png`.
- Education / certifications section (not on the current page; out of scope).
- A "download PDF" button.
- Backend / data changes.

## Aesthetic direction

Same as the Playground redesign:

- Clean, minimal, editorial.
- Generous whitespace.
- Large display headings, sharp typography.
- Subtle 1px dividers and borders; no heavy strokes.
- Muted neutrals + the existing `--accent` (#4a90d9).
- Hover = slight lift; expanded card gets a 3px accent left border. Transitions ≤150ms.

## Page structure

```
┌──────────────────────────────────────────────────┐
│  Experience                                      │  ← page header
│  ──────                                          │
│  A decade of building things, mostly behind …    │
│                                                  │
│  🟢 Zendesk                                      │  ← company group header
│     August 2017 – Present · 3 roles              │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │▎Senior SWE — Product Led Growth   Sep '21–…│  │  ← expanded card
│  │ [RoR] [AWS SQS] [Postgres] [Claude]        │  │
│  │ • Architected order processing service …   │  │
│  │ • Built a new domain service (RoR, SQS) …  │  │
│  │ • Led multi-feature platform integration … │  │
│  └────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────┐  │
│  │ + SWE — Billing, Growth & Monetization 2019│  │  ← collapsed card
│  └────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────┐  │
│  │ + SWE — Core Services Tools           2017 │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  🟣 Riviera Partners                             │  ← second company group
│     June 2010 – July 2017 · 3 roles              │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │ + Software Engineer                   2015 │  │
│  └────────────────────────────────────────────┘  │
│  …                                               │
└──────────────────────────────────────────────────┘
```

## Section detail

### 0. Page wrapper

New CSS class `.resume-page`, mirrors `.playground-page`:

```css
.resume-page {
  max-width: 960px;
  margin: 0 auto;
  padding-bottom: 60px;
}
```

### 1. Page header

Identical pattern to `.playground-header`. New CSS class `.resume-header`.

- Title: "Experience" — DM Sans, 30px, weight 500, color `#1a1a1a`, letter-spacing -0.01em.
- Short accent divider: 40px × 2px, `background: var(--accent)`, margin-bottom 12px.
- Subtitle: "A decade of building things, mostly behind the scenes." — 14px, color `#777`, weight 400.
- Block spacing: 32px below before the first company group.

### 2. Company group header

A repeating block, one per company.

Markup:

```jsx
<div className="resume-company-group">
  <div className="resume-company-header">
    <img className="resume-company-logo" src="..." alt="" />
    <div>
      <div className="resume-company-name">Zendesk</div>
      <div className="resume-company-meta">August 2017 – Present · 3 roles</div>
    </div>
  </div>
  {roles.map(role => <ResumeRoleCard ... />)}
</div>
```

Styles:

- `.resume-company-group` — margin-bottom 36px between groups; no margin-bottom on the last group.
- `.resume-company-header` — flex row, align-items center, gap 12px, margin-bottom 16px.
- `.resume-company-logo` — 36px × 36px, `border-radius: 50%`, `object-fit: cover`.
- `.resume-company-name` — 20px, weight 500, color `#1a1a1a`.
- `.resume-company-meta` — 12px, color `#999`, weight 400.

The "X roles" count is generated from the role array length, not hardcoded.

### 3. Role card (collapsed and expanded states)

Single component renders both states. Class `.resume-role-card` always present; modifier `.resume-role-card--expanded` when open.

**Shared anatomy:**

- `<button type="button" className="resume-role-card …">` — full-width clickable surface. Using `<button>` (not `<a href="#">`) so keyboard nav works and the URL doesn't change.
- `aria-expanded={isExpanded}` so screen readers announce state.
- Background `#fff`, border `1px solid #ececec`, border-radius 6px.
- Margin-bottom 8px between cards within a group.
- Padding-left starts at 22px in CSS; the expanded variant reduces it to 19px to make room for the 3px accent border without shifting content.

**Collapsed state:**

- Row layout: `+` icon (color `#bbb`, size 14px) on the left, title in the middle, date on the right.
- Padding: 14px 22px.
- Title: 14px, weight 500, color `#1a1a1a`.
- Date: 12px, color `#999`, italic, white-space nowrap.
- Hover: `border-color: #d4d4d4`, `transform: translateY(-1px)`, box-shadow `0 2px 6px rgba(0,0,0,0.04)`, transition 150ms ease. Cursor pointer.

**Expanded state (modifier `.resume-role-card--expanded`):**

- 3px solid `var(--accent)` left border. The right/top/bottom borders stay at 1px solid `#ececec`.
- Box-shadow: `0 2px 6px rgba(0,0,0,0.05)` (subtle persistent lift).
- Padding: 18px 22px 18px 19px.
- Header row: title on the left (16px, weight 500, color `#1a1a1a`, line-height 1.3), date on the right (12px, color `#888`, italic).
- Tech tag row below header, margin-bottom 12px. Empty array → row omitted entirely.
- Bullets: `<ul className="resume-bullets">` with `font-size: 13px`, `line-height: 1.7`, color `#444`, padding-left 20px, list-style disc, margin 0. Each `<li>` has margin-bottom 6px except the last. Define this as a new class `.resume-bullets`; do not reuse the existing `.resume-line` (which sets `font-size: 14px` and `margin-bottom: 8px` per li — close but not identical, and `.resume-line` is also used as a row layout class on the old `<ul className="row resume-line">`, which we're dropping). Delete `.resume-line` from CSS once the old sub-components are removed.
- No `+` icon when expanded. (The accent border and indented title already signal openness.)

**Tech tags:**

- Same visual treatment as the Playground hero pills, but inside the card.
- Class: `.resume-tag`. Font 11px, uppercase NOT applied (these are mixed-case product names), weight 500, padding 3px 9px, border-radius 999px, background `var(--accent-light)` (#e8f2fb), color `var(--accent)`, letter-spacing 0.02em. Gap 5px between tags via flex gap.
- Container: `.resume-tag-row`, `display:flex; flex-wrap:wrap; gap:5px;`.

### 4. Expansion behavior

- One card open at a time. Clicking a collapsed card expands it and collapses whichever card was open.
- Clicking an already-expanded card does nothing (no toggle-to-collapse). This avoids a "nothing is open" empty state.
- On initial render, the most recent role is open: "Senior Software Engineer — Product Led Growth" (Zendesk).
- State lives in `ResumeComponent` as a single `expandedRoleId` string.

### 5. Data model

The six existing sub-components (`ZenSrBillingDeveloperComponent`, `ZenBillingDeveloperComponent`, `ZenDeveloperComponent`, `RiviDeveloperComponent`, `AnalystComponent`, `RecruiterComponent`) all hold the same shape: title, dates, list of bullet strings. They get consolidated into a single data structure inside `ResumeComponent.jsx`:

```jsx
const COMPANIES = [
  {
    id: 'zendesk',
    name: 'Zendesk',
    logo: './img/zendesk_logo2.png',
    rangeLabel: 'August 2017 – Present',
    roles: [
      {
        id: 'zen-sr-plg',
        title: 'Senior Software Engineer — Product Led Growth',
        dateLabel: 'Sep 2021 – Present',
        tags: ['Ruby on Rails', 'AWS SQS', 'Postgres', 'Claude'],
        bullets: [ /* the 5 existing bullets */ ],
      },
      { id: 'zen-billing', title: 'Software Engineer — Billing, Growth & Monetization',
        dateLabel: 'Jul 2019 – Sep 2021', tags: ['Ruby on Rails', 'Zuora', 'Rspec'], bullets: [...] },
      { id: 'zen-core', title: 'Software Engineer — Core Services Tools',
        dateLabel: 'Aug 2017 – Jul 2019', tags: ['Ruby on Rails', 'AWS SQS', 'React', 'Rspec'], bullets: [...] },
    ],
  },
  {
    id: 'riviera',
    name: 'Riviera Partners',
    logo: './img/RivieraLogo.png',
    rangeLabel: 'June 2010 – July 2017',
    roles: [
      { id: 'riv-swe', title: 'Software Engineer',
        dateLabel: 'Dec 2015 – Jul 2017',
        tags: ['Ruby on Rails', 'React', 'Postgres', 'Sidekiq', 'Redis', 'NewRelic'],
        bullets: [...] },
      { id: 'riv-analyst', title: 'Senior Data Analyst',
        dateLabel: 'Feb 2012 – Dec 2015', tags: ['SQL', 'VBA'], bullets: [...] },
      { id: 'riv-recruiter', title: 'Technical Recruiter',
        dateLabel: 'Jun 2010 – Feb 2012', tags: [], bullets: [...] },
    ],
  },
];
```

Bullets are copied verbatim from each existing sub-component. Tags are the proposed set above — they're derived from explicit mentions in the existing bullet copy plus reasonable adjacent tools (e.g. Postgres for "domain service"). The user can tune them after implementation; treat the above as the starting set.

The recruiter role has no tags — its tag row is omitted, not rendered as an empty row.

### 6. Removed / changed elements

- Remove the entire `col-4` / `col-8` two-column block in `ResumeComponent.jsx`. The new layout is single-column.
- Remove all six `Resume/*Component.jsx` files. Their content moves into the `COMPANIES` array. Delete the files entirely (no callers outside `ResumeComponent`).
- Verify by grep before deleting the old `.work-title`, `.work-title-row`, `.date-ranges`, `.company-brand`, `.company-logo`, `.resume-nav-active`, `.education-container`, and `.resume-line` rules — they're only used inside the resume components being deleted, but confirm with a grep across `src/`.

## Component / file changes

### `ResumeComponent.jsx`

Single file holds the data and three sub-components:

- `ResumeHeader` — static, no props.
- `ResumeCompanyGroup` — renders the company header + maps roles to `ResumeRoleCard`.
- `ResumeRoleCard` — one card, takes `role`, `isExpanded`, `onClick`.

Top-level component owns state `expandedRoleId` (default: `'zen-sr-plg'`) and an `onSelectRole(id)` handler that sets it. Click on an already-expanded card is a no-op (return early in the handler).

Structure:

```jsx
<div className="resume-page">
  <ResumeHeader />
  {COMPANIES.map(company => (
    <ResumeCompanyGroup
      key={company.id}
      company={company}
      expandedRoleId={expandedRoleId}
      onSelectRole={this.onSelectRole}
    />
  ))}
</div>
```

If `ResumeComponent.jsx` grows past ~200 lines after the data array is inlined, split the `COMPANIES` constant into a sibling file `src/client/app/data/ResumeData.jsx` (matches the `PictoGraphStory.jsx` pattern that already exists in `data/`).

### `index.css`

Add a new "Resume" section at the bottom of the file, after the Playground section, with all the styles above. Order them: page wrapper → header → company group → role card (shared, collapsed, expanded) → tag row → mobile overrides.

Remove the old `.work-title`, `.work-title-row`, `.date-ranges`, `.company-brand`, `.company-logo`, `.resume-nav-active`, `.education-container` rules. Verify each with grep across `src/` before deleting.

Drop `.resume-line` entirely after the old sub-components are removed — it's a row layout class that no longer has a caller. The new bullet styling lives in `.resume-bullets` (see section 3).

## Responsive behavior

- ≥600px: layout as shown above.
- <600px: the header row of each card stacks. Specifically, in collapsed cards the date drops below the title (right-aligned becomes left-aligned). In expanded cards the date moves directly under the title with a 4px gap, before the tag row.
- Tech tags wrap naturally via `flex-wrap: wrap`; no special mobile rule needed.
- Page padding reduces from 0 (desktop, the container handles it) to 16px on viewports under 600px.

Driven by a single `@media (max-width: 600px)` block at the bottom of the Resume CSS section.

## Accessibility

- Each role card is a `<button type="button">` with `aria-expanded={isExpanded}` and an `aria-controls` pointing to the bullet list's id (when expanded).
- Focus ring: 2px outline `var(--accent)`, 2px offset, applied via `.resume-role-card:focus-visible`.
- Logo images use `alt=""` (decorative; the company name appears next to them).
- The `+` icon on collapsed cards is purely decorative — wrap it in `<span aria-hidden="true">`.
- Color is never the only signal: the expanded card has both the accent left border and the shadow lift, not just color.
- Keyboard: Tab cycles through the cards in DOM order; Enter / Space activates them.

## Verification

After implementation:

- Run the existing build command (check `package.json` for `npm run build` or `npm start`) and confirm no errors.
- Open `index.html` in a browser, navigate to the Resume section, confirm:
  - Header "Experience" + accent divider + subtitle render.
  - Two company groups render with logos, names, and date ranges.
  - The "Senior Software Engineer — Product Led Growth" card is expanded by default; the other five are collapsed.
  - Clicking any collapsed card expands it and collapses whichever was open.
  - Clicking the already-expanded card does nothing.
  - Tech tags render inside the expanded card; the recruiter card shows no tag row when expanded.
  - Bullets render correctly with line-height 1.7.
  - Hover on a collapsed card shows a subtle lift and border darken.
- Resize to ~375px width: cards stay full-width, header rows stack, no horizontal scroll.
- Keyboard: Tab through all six cards; Enter / Space expands them.
- Screen reader spot-check: each card announces its expanded/collapsed state.

## Open questions

None — layout, density, grouping, expansion behavior, page header copy all approved during brainstorming. Tech tag content is a starting proposal that can be tuned after.
