# Resume UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the two-pane sidebar-driven resume with a single-column, company-grouped accordion of role cards, matching the visual language of the Playground page redesign.

**Architecture:** All resume data (companies, roles, dates, tech tags, bullets) consolidates into a `COMPANIES` constant inside `ResumeComponent.jsx`. The component renders three functional sub-components (`ResumeHeader`, `ResumeCompanyGroup`, `ResumeRoleCard`) and owns a single `expandedRoleId` state. The six existing `Resume/*Component.jsx` sub-component files are deleted; their content is preserved verbatim inside the new data structure.

**Tech Stack:** React 15 (class component for state + functional sub-components — same pattern as `PlaygroundComponent.jsx`), Webpack 3, vanilla CSS (`src/client/css/index.css`).

**Spec:** `docs/superpowers/specs/2026-05-12-resume-ui-redesign-design.md`

**Testing approach:** No automated test infrastructure exists in this project (no jest/mocha — see `package.json`). Each task ends with `npm run build` to catch JSX/syntax errors, plus a manual browser smoke-test using `npm start` (which opens webpack-dev-server). Visual verification steps are spelled out per task.

---

## File Structure

**Created:**
- (none — all changes live in existing files)

**Modified:**
- `src/client/app/components/ResumeComponent.jsx` — complete rewrite
- `src/client/css/index.css` — add Resume section at bottom, remove orphaned old classes

**Deleted:**
- `src/client/app/components/Resume/ZenSrBillingDeveloperComponent.jsx`
- `src/client/app/components/Resume/ZenBillingDeveloperComponent.jsx`
- `src/client/app/components/Resume/ZenDeveloperComponent.jsx`
- `src/client/app/components/Resume/RiviDeveloperComponent.jsx`
- `src/client/app/components/Resume/AnalystComponent.jsx`
- `src/client/app/components/Resume/RecruiterComponent.jsx`
- The `src/client/app/components/Resume/` directory itself (empty after the above)

---

## Task 1: Add new Resume CSS section

Add all new styles at the bottom of `index.css`, after the Playground section. Old classes are removed in Task 4 once the new component is verified working.

**Files:**
- Modify: `src/client/css/index.css` (append to end of file, after line 823)

- [ ] **Step 1: Append the Resume CSS block to the end of `src/client/css/index.css`**

Open `src/client/css/index.css` and append this block at the very end (after the existing `@media (max-width: 600px)` block that ends at line 822):

```css

/* Resume page */
.resume-page {
  max-width: 960px;
  margin: 0 auto;
  padding-bottom: 60px;
}

.resume-header {
  margin-bottom: 32px;
}
.resume-title {
  font-size: 30px;
  font-weight: 500;
  color: #1a1a1a;
  letter-spacing: -0.01em;
  margin: 0 0 10px;
}
.resume-title-divider {
  width: 40px;
  height: 2px;
  background: var(--accent);
  margin-bottom: 12px;
}
.resume-subtitle {
  font-size: 14px;
  color: #777;
  margin: 0;
}

.resume-company-group {
  margin-bottom: 36px;
}
.resume-company-group:last-of-type {
  margin-bottom: 0;
}
.resume-company-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.resume-company-logo {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}
.resume-company-name {
  font-size: 20px;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 1.2;
}
.resume-company-meta {
  font-size: 12px;
  color: #999;
  font-weight: 400;
  margin-top: 2px;
}

.resume-role-card {
  width: 100%;
  text-align: left;
  display: block;
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 6px;
  padding: 14px 22px;
  margin-bottom: 8px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
}
.resume-role-card:hover {
  border-color: #d4d4d4;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
}
.resume-role-card:focus {
  outline: none;
}
.resume-role-card:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.resume-role-card:last-child {
  margin-bottom: 0;
}

.resume-role-card-collapsed {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.resume-role-card-collapsed-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.resume-role-icon {
  color: #bbb;
  font-size: 14px;
  flex-shrink: 0;
}
.resume-role-title-collapsed {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 1.3;
}
.resume-role-date-collapsed {
  font-size: 12px;
  color: #999;
  font-style: italic;
  white-space: nowrap;
  flex-shrink: 0;
}

.resume-role-card--expanded {
  border-left: 3px solid var(--accent);
  padding: 18px 22px 18px 19px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  cursor: default;
}
.resume-role-card--expanded:hover {
  border-color: #ececec;
  border-left-color: var(--accent);
  transform: none;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}
.resume-role-header-expanded {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 10px;
}
.resume-role-title-expanded {
  font-size: 16px;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 1.3;
  margin: 0;
}
.resume-role-date-expanded {
  font-size: 12px;
  color: #888;
  font-style: italic;
  white-space: nowrap;
}

.resume-tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 12px;
}
.resume-tag {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.02em;
  padding: 3px 9px;
  border-radius: 999px;
  background: var(--accent-light);
  color: var(--accent);
}

.resume-bullets {
  font-size: 13px;
  line-height: 1.7;
  color: #444;
  padding-left: 20px;
  margin: 0;
  list-style: disc;
}
.resume-bullets li {
  margin-bottom: 6px;
}
.resume-bullets li:last-child {
  margin-bottom: 0;
}

@media (max-width: 600px) {
  .resume-page {
    padding-left: 16px;
    padding-right: 16px;
  }
  .resume-role-card-collapsed {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  .resume-role-card-collapsed-left {
    width: 100%;
  }
  .resume-role-header-expanded {
    flex-direction: column;
    gap: 4px;
  }
  .resume-title {
    font-size: 26px;
  }
}
```

- [ ] **Step 2: Build to confirm CSS parses**

Run: `npm run build`

Expected: build succeeds with no errors (warnings about minification are fine).

- [ ] **Step 3: Commit**

```bash
git add src/client/css/index.css
git commit -m "$(cat <<'EOF'
Add Resume page CSS

Adds .resume-page, .resume-header, .resume-company-group, .resume-role-card
(collapsed + expanded variants), .resume-tag-row / .resume-tag, .resume-bullets,
plus mobile overrides. Existing resume styles remain in place until the new
component is wired up in Task 2 and the old sub-components removed in Task 3.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Rewrite `ResumeComponent.jsx` with consolidated data and accordion structure

Replace the entire file with a single React module that:

1. Defines a `COMPANIES` constant with all role data (bullets copied verbatim from the six existing sub-components).
2. Defines three functional sub-components: `ResumeHeader`, `ResumeCompanyGroup`, `ResumeRoleCard`.
3. Owns a single `expandedRoleId` state on the class component, defaulting to `'zen-sr-plg'`.
4. Renders a single-column page using `.resume-page` wrapper.

After this task the old sub-component files still exist on disk but are no longer imported. They get deleted in Task 3.

**Files:**
- Modify: `src/client/app/components/ResumeComponent.jsx` (full rewrite)

- [ ] **Step 1: Replace the entire contents of `src/client/app/components/ResumeComponent.jsx` with the following**

```jsx
import React from 'react'

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
        bullets: [
          'Architected and developed an order processing integration service targeting sub-5-second order creation, 99.9% data accuracy, and throughput of 1,000+ orders per minute',
          'Built a new domain service (RoR, AWS SQS) pulling core usage payments functionality from the existing billing monolith, which improved stability, reduced latency, and reduced code complexity',
          'Led several multi-feature platform integration projects across coordinated work streams (3 separate orgs, as well as product and design) maintaining momentum across interdependencies and time zones',
          'Authored and organized test plans and execution documentation, enabling consistent test execution and smoother contributor handoffs',
          'Developed and shared AI tooling across the team (Claude skills) to greatly lift engineering productivity',
        ],
      },
      {
        id: 'zen-billing',
        title: 'Software Engineer — Billing, Growth & Monetization',
        dateLabel: 'Jul 2019 – Sep 2021',
        tags: ['Ruby on Rails', 'Zuora', 'Rspec'],
        bullets: [
          'Built an async API Service to integrate charge transactions between Sell Voice and Zuora',
          'Implemented new features and enhancements to the Core Billing app servicing all Zendesk products',
          'Regularly presented in tech demos to share new technologies and learnings to improve team knowledge base',
          'Participated in regular on-call rotation, code reviews, bug triaging, and writing unit tests in Rspec',
        ],
      },
      {
        id: 'zen-core',
        title: 'Software Engineer — Core Services Tools',
        dateLabel: 'Aug 2017 – Jul 2019',
        tags: ['Ruby on Rails', 'AWS SQS', 'React', 'Rspec'],
        bullets: [
          'Successfully led a large, complex project to GA involving multiple codebases and stakeholders within the first 6 months',
          'Built a micro-service to destroy user data in compliance with GDPR standards (RoR, Sqs)',
          'Implemented new features and enhancements to a public facing status app for all Zendesk products (React with Ruby/Rails)',
          'Participated in regular on-call rotation, code reviews, bug triaging, and writing unit tests in Rspec',
        ],
      },
    ],
  },
  {
    id: 'riviera',
    name: 'Riviera Partners',
    logo: './img/RivieraLogo.png',
    rangeLabel: 'June 2010 – July 2017',
    roles: [
      {
        id: 'riv-swe',
        title: 'Software Engineer',
        dateLabel: 'Dec 2015 – Jul 2017',
        tags: ['Ruby on Rails', 'React', 'Postgres', 'Sidekiq', 'Redis', 'NewRelic'],
        bullets: [
          'Collaborated with Product, Data Science, and DevOps to build and release an entity resolution service from the ground up',
          'Integrated resolution services with asynchronous workers via Sidekiq to manage job resolution status',
          'Built ETL data pipeline, integrating information from third party data providers using Redis ElastiCache',
          'Architected chrome extension using ReactJS, NuclearJS, Ruby to automatically detect and scrape key data from online sources into relational database',
          'Profiled API performance using RubyProfiler and NewRelic, improving application response times 10x from ~800ms to ~80ms',
          'Migrated ETL API out of monolithic architecture towards service oriented architecture',
          'Mentored multiple interns in coding best practices & API design, leading to release of metrics dashboard',
          'Designed and optimized new database schemas and indices in Postgres for merge activity dashboard',
          'Prototyped, iterated and shipped a hackathon project that displayed a relationship map between employees at similar companies',
          'Participated in regular on-call rotation, code reviews, bug triaging, and writing unit tests in Rspec',
        ],
      },
      {
        id: 'riv-analyst',
        title: 'Senior Data Analyst',
        dateLabel: 'Feb 2012 – Dec 2015',
        tags: ['SQL', 'VBA'],
        bullets: [
          'Wrote SQL queries and VBA scripts to pull custom datasets from a complex relational database',
          'Analyzed and produced reports on supply and demand on candidate flow, individual recruiter revenue forecasts, and optimal activity levels based on activity to candidate saturation',
        ],
      },
      {
        id: 'riv-recruiter',
        title: 'Technical Recruiter',
        dateLabel: 'Jun 2010 – Feb 2012',
        tags: [],
        bullets: [
          'One of two top sourcers, establishing best practices for the role and training every new recruiter',
          'Managed and supported up to 10 clients at any given time',
        ],
      },
    ],
  },
]

function ResumeHeader() {
  return (
    <div className="resume-header">
      <h2 className="resume-title">Experience</h2>
      <div className="resume-title-divider"></div>
      <p className="resume-subtitle">A decade of building things, mostly behind the scenes.</p>
    </div>
  )
}

function ResumeRoleCard({ role, isExpanded, onSelect }) {
  if (isExpanded) {
    // Expanded card is non-interactive (clicking does nothing per spec), so it's a
    // <div>. This keeps the markup HTML-valid — <button> can't contain <h3> or <ul>.
    return (
      <div className="resume-role-card resume-role-card--expanded">
        <div className="resume-role-header-expanded">
          <h3 className="resume-role-title-expanded">{role.title}</h3>
          <span className="resume-role-date-expanded">{role.dateLabel}</span>
        </div>
        {role.tags.length > 0 && (
          <div className="resume-tag-row">
            {role.tags.map(tag => (
              <span key={tag} className="resume-tag">{tag}</span>
            ))}
          </div>
        )}
        <ul className="resume-bullets">
          {role.bullets.map((bullet, idx) => (
            <li key={idx}>{bullet}</li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <button
      type="button"
      className="resume-role-card"
      aria-expanded={false}
      onClick={() => onSelect(role.id)}
    >
      <div className="resume-role-card-collapsed">
        <div className="resume-role-card-collapsed-left">
          <span className="resume-role-icon" aria-hidden="true">+</span>
          <span className="resume-role-title-collapsed">{role.title}</span>
        </div>
        <span className="resume-role-date-collapsed">{role.dateLabel}</span>
      </div>
    </button>
  )
}

function ResumeCompanyGroup({ company, expandedRoleId, onSelectRole }) {
  return (
    <div className="resume-company-group">
      <div className="resume-company-header">
        <img className="resume-company-logo" src={company.logo} alt="" />
        <div>
          <div className="resume-company-name">{company.name}</div>
          <div className="resume-company-meta">
            {company.rangeLabel} · {company.roles.length} role{company.roles.length === 1 ? '' : 's'}
          </div>
        </div>
      </div>
      {company.roles.map(role => (
        <ResumeRoleCard
          key={role.id}
          role={role}
          isExpanded={expandedRoleId === role.id}
          onSelect={onSelectRole}
        />
      ))}
    </div>
  )
}

class ResumeComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = { expandedRoleId: 'zen-sr-plg' }
    this.onSelectRole = this.onSelectRole.bind(this)
  }

  onSelectRole(id) {
    if (id === this.state.expandedRoleId) return
    this.setState({ expandedRoleId: id })
  }

  render() {
    return (
      <div className="resume-page">
        <ResumeHeader />
        {COMPANIES.map(company => (
          <ResumeCompanyGroup
            key={company.id}
            company={company}
            expandedRoleId={this.state.expandedRoleId}
            onSelectRole={this.onSelectRole}
          />
        ))}
      </div>
    )
  }

}

export default ResumeComponent
```

- [ ] **Step 2: Build to confirm JSX compiles and imports resolve**

Run: `npm run build`

Expected: build succeeds. The old `Resume/*Component.jsx` files still exist but are no longer imported — webpack should ignore them (they're not referenced from any entry point).

- [ ] **Step 3: Browser smoke test**

Run: `npm start`

Expected: webpack-dev-server opens the site in a browser. Click the "Experience" nav item. Verify:

- Header reads "Experience" with a short accent-blue divider and the subtitle "A decade of building things, mostly behind the scenes."
- Two company groups render: "Zendesk" (with `zendesk_logo2.png` and "August 2017 – Present · 3 roles") and "Riviera Partners" (with `RivieraLogo.png` and "June 2010 – July 2017 · 3 roles").
- The "Senior Software Engineer — Product Led Growth" card is expanded by default, showing tech tag pills and 5 bullets.
- The other 5 cards are collapsed, each showing `+`, the role title, and the date on the right.
- Clicking any collapsed card expands it and collapses the previously expanded one.
- Clicking the already-expanded card does nothing.
- The Recruiter card, when expanded, shows no tag row (no empty gap).
- Hover on a collapsed card shows a subtle lift and border darken.
- Resize the browser to ~375px wide: cards stay full width, the date drops below the title in collapsed cards, no horizontal scroll.

Stop the dev server (Ctrl-C) before continuing.

- [ ] **Step 4: Commit**

```bash
git add src/client/app/components/ResumeComponent.jsx
git commit -m "$(cat <<'EOF'
Rewrite Resume page as single-column accordion

Consolidates the six Resume/* sub-components into a single COMPANIES data
array inside ResumeComponent.jsx, with three functional sub-components
(ResumeHeader, ResumeCompanyGroup, ResumeRoleCard). One card open at a time;
"Senior SWE — Product Led Growth" is the default. Old sub-component files
are not yet deleted — that happens in the next commit.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Delete the six old sub-component files

These are no longer imported anywhere. Verify with grep first, then delete.

**Files:**
- Delete: `src/client/app/components/Resume/ZenSrBillingDeveloperComponent.jsx`
- Delete: `src/client/app/components/Resume/ZenBillingDeveloperComponent.jsx`
- Delete: `src/client/app/components/Resume/ZenDeveloperComponent.jsx`
- Delete: `src/client/app/components/Resume/RiviDeveloperComponent.jsx`
- Delete: `src/client/app/components/Resume/AnalystComponent.jsx`
- Delete: `src/client/app/components/Resume/RecruiterComponent.jsx`
- Delete: `src/client/app/components/Resume/` (directory, once empty)

- [ ] **Step 1: Verify nothing else imports the six files**

Run, from the repo root:

```bash
grep -r "from.*Resume/" src/ --include="*.jsx" --include="*.js"
```

Expected: zero matches. The previous task rewrote `ResumeComponent.jsx` to not import any of them.

If you see matches, stop and investigate before deleting anything.

- [ ] **Step 2: Delete the files**

```bash
rm src/client/app/components/Resume/ZenSrBillingDeveloperComponent.jsx
rm src/client/app/components/Resume/ZenBillingDeveloperComponent.jsx
rm src/client/app/components/Resume/ZenDeveloperComponent.jsx
rm src/client/app/components/Resume/RiviDeveloperComponent.jsx
rm src/client/app/components/Resume/AnalystComponent.jsx
rm src/client/app/components/Resume/RecruiterComponent.jsx
rmdir src/client/app/components/Resume
```

Note: `rmdir` will fail if there's a stray `.DS_Store` file in the directory. If that happens, run `rm src/client/app/components/Resume/.DS_Store` first, then `rmdir` again.

- [ ] **Step 3: Build to confirm nothing breaks**

Run: `npm run build`

Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add -A src/client/app/components/Resume/ src/client/app/components/
git commit -m "$(cat <<'EOF'
Remove old Resume sub-component files

Their content moved verbatim into the COMPANIES data array in
ResumeComponent.jsx. No remaining callers.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Remove orphaned CSS classes

The old resume markup used `.work-title`, `.work-title-row`, `.date-ranges`, `.company-brand`, `.company-logo`, `.resume-nav-active`, `.education-container`, and `.resume-line`. With the rewrite, these aren't used anywhere. Verify with grep, then delete.

**Files:**
- Modify: `src/client/css/index.css` (remove specific rule blocks)

- [ ] **Step 1: Verify each class is unused outside `index.css`**

Run, from the repo root:

```bash
for cls in work-title work-title-row date-ranges company-brand company-logo resume-nav-active education-container resume-line; do
  echo "=== .$cls ==="
  grep -rn "$cls" src/ --include="*.jsx" --include="*.js" --include="*.html"
done
```

Expected: each `=== .<class> ===` heading is followed by zero matches. (Matches inside `src/client/css/index.css` are excluded because of the `--include` filters.)

If any class shows up in a `.jsx` / `.js` / `.html` file, **stop**. Do not delete that class. Either the previous task missed something or the class is used by another component — investigate before continuing.

- [ ] **Step 2: Delete the orphaned class rules from `src/client/css/index.css`**

Remove these specific rule blocks from `src/client/css/index.css`. Each is the entire selector + braces.

Block at the top of the file (lines ~1–7, before the rewrite they were 1–7):

```css
.resume-line {
  font-size: 14px;
  line-height: 1.7;
}
.resume-line li {
  margin-bottom: 8px;
}
```

Delete these blocks (search for the selector to locate them):

```css
.work-title {
  font-size: 18px;
}
```

```css
.date-ranges {
  font-size: 13px;
}
```

```css
.education-container {
  margin-top: 20px;
}
```

```css
.company-brand {
  font-size: 24px;
}
```

```css
.company-logo {
  width: 30px;
  margin-right: 8px;
}
```

```css
.resume-nav-active {
  color: var(--accent) !important;
  border-left: 3px solid var(--accent);
  padding-left: 8px;
  font-weight: 500;
}
```

And the second `.company-brand` declaration (it appears twice in the file — the second one near line 272):

```css
.company-brand {
  font-size: 24px;
  color: #333;
}
```

`.work-title-row` — search for it. If the file doesn't define a rule with that selector (it's referenced in old JSX but may not have its own CSS rule), nothing to delete.

- [ ] **Step 3: Build to confirm CSS still parses**

Run: `npm run build`

Expected: build succeeds.

- [ ] **Step 4: Browser smoke test — confirm no visual regressions on other pages**

Run: `npm start`. Click through About, Experience, and Playground tabs in the browser. Verify:

- About page looks unchanged.
- Experience page looks identical to the end of Task 2 (no styling lost).
- Playground page looks unchanged — none of the deleted classes were used there.

Stop the dev server (Ctrl-C).

- [ ] **Step 5: Commit**

```bash
git add src/client/css/index.css
git commit -m "$(cat <<'EOF'
Remove orphaned old Resume CSS classes

Drops .work-title, .date-ranges, .company-brand, .company-logo,
.resume-nav-active, .education-container, .resume-line — all only used
by the deleted Resume/*Component.jsx files.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Final verification pass

A single end-to-end check before declaring the work done.

- [ ] **Step 1: Build for production**

Run: `npm run build`

Expected: build succeeds with no errors.

- [ ] **Step 2: Run dev server and walk the spec's verification checklist**

Run: `npm start`. In the browser, navigate to the Experience tab and confirm each item from the spec's "Verification" section:

- "Experience" header + accent divider + subtitle render.
- Two company groups render with logos, names, and date ranges.
- "Senior Software Engineer — Product Led Growth" card is expanded by default; the other five are collapsed.
- Clicking any collapsed card expands it and collapses whichever was open.
- Clicking the already-expanded card does nothing.
- Tech tags render inside the expanded card; the Recruiter card shows no tag row when expanded.
- Bullets render correctly with line-height 1.7.
- Hover on a collapsed card shows a subtle lift and border darken.

Then for responsiveness — drag the browser window to ~375px wide:

- Cards stay full width, no horizontal scroll.
- Collapsed card header stacks (date drops below title).
- Expanded card header stacks (date drops below title, then tags, then bullets).

Then for keyboard:

- Click outside any card to deselect, then press Tab repeatedly. Focus should land on each card in order, with a visible 2px accent outline.
- Press Enter / Space on a focused collapsed card; it should expand.

Stop the dev server.

- [ ] **Step 3: Final commit (if any uncommitted changes remain)**

```bash
git status
```

Expected: working tree clean. If anything is uncommitted, address it (likely a stray `.DS_Store` — leave that alone, it's gitignored).

---

## Out of scope (for follow-up if desired)

- Tech tag content tuning — the initial set in `COMPANIES` is a starting proposal; the user can refine after seeing it rendered.
- Deep-linking each role (`#zen-sr-plg`) — possible future enhancement, not in this plan.
- Adding an Education / Certifications section.
- A "Download PDF" button.
