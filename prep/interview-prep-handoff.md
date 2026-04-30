# System Design Interview Prep — Handoff

This document is a handoff from a chat session preparing for a 45-minute interactive system design presentation. It contains:

1. Context about the interview and what's been worked through
2. The architecture diagram (as an SVG-based React component spec)
3. Prep notes covering all the design decisions and their defenses
4. Remaining work to close before the interview

---

## 1. Interview Context

**Role:** Senior or Lead software engineer
**Company:** Authorium (govtech startup, ~100 people, Series A, $22M raised, FedRAMP High authorized, customers include CalPERS)
**What they do:** Document-centric platform for government agencies — procurement, contracts, grants, budgeting, legislative analysis. Their domain rewards: unstructured-to-structured data extraction, workflow automation, multi-tenancy, compliance-driven design, integration with legacy systems, RBAC, and increasingly LLM/RAG.

**Format:** 45 minutes total. Roughly 20–25 min presentation + 20–25 min Q&A. Audience is Engineering, Product, and Security — questions from all three perspectives. Some in-person, some over video.

**The presentation prompt (verbatim):**

> Please come prepared to present a system design from your experience that showcases your technical depth. Do not share any proprietary or confidential information — focus on the architecture, decisions, and trade-offs rather than specifics tied to a particular company or product.
>
> We'd like you to cover:
> - **Problem context** — What problem were you solving, and why did it matter? What were the constraints or pressures that shaped the work?
> - **Your design** — Walk us through the architecture. What alternatives did you consider, and what drove your final decision?
> - **Cross-functional considerations** — How did you approach usability, performance, and security? Were there meaningful trade-offs between them?
> - **Execution and reflection** — What went well? What would you do differently? Were there process or organizational changes that needed to happen alongside the technical work?
>
> A strong presentation typically:
> - Focuses on a system with real complexity and meaningful trade-offs (not a greenfield or trivial project)
> - Shows your specific role and decision-making, not just what the team did
> - Demonstrates how you communicated across engineering, product, and security stakeholders

**Anonymization note:** The original project was at Zendesk, integrating Salesforce CPQ → an internal Ruby Billing monolith → SQS FIFO → Shoryuken workers → Zuora (subscription billing) → Pravda (account/entitlements service). All proprietary names must be anonymized. Use the generic labels in the diagram below.

---

## 2. The Project

**Title:** Order Processing Integration Service

**One-liner:** Async integration service connecting a CRM/CPQ system to an external subscription billing platform, with end-to-end provisioning of customer access.

**Headline numbers:** sub-5-second end-to-end order creation, 99.9% data accuracy, throughput target of 1,000+ orders per minute. SLOs were defined post-launch based on actual behavior measured in Datadog (an honest framing — more senior than claiming SLOs were hit from day one).

**Role:** Tech lead + IC + de facto project manager on a 3-person team. Owned the design doc in Confluence and the architecture flow charts in Lucidchart. Got input from teammates, sought review from the lead group architect, drove stakeholder approval.

**Timeline:** ~2–3 months from design to rollout for Phase 1.

**Important:** Phase 2 (a planned fan-out via an integration gateway and Workato to additional downstream consumers) was deprioritized for company reasons before implementation. **Do not mention Phase 2 in the presentation** — present the project as cleanly scoped to Phase 1 in production.

---

## 3. Architecture Diagram

The diagram below should be implemented as a React component on the personal portfolio website. The site is React-based and hosted on GitHub Pages.

**Behavior requested:** Click components to reveal notes (interactive disclosure). Each box should be clickable and reveal the corresponding component note (see Section 4 — Component Notes). Use a side panel, modal, or expanded inline section — whichever fits the site's existing design patterns best.

### SVG source (anonymized labels)

```svg
<svg width="100%" viewBox="0 0 680 620" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>Order processing integration service architecture</title>
  <desc>Order requests from a CRM/CPQ system flow through a Ruby billing service into a FIFO queue, are consumed by async workers, and processed against an external subscription billing platform. State is persisted in a MySQL store; failed messages divert to a dead-letter queue; and an asynchronous callback updates the account and entitlements service.</desc>

  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>

  <!-- Component: crm_cpq -->
  <g data-component="crm_cpq" class="component component-external">
    <rect x="80" y="30" width="320" height="56" rx="8" stroke-width="0.5"/>
    <text x="240" y="50" text-anchor="middle" dominant-baseline="central" class="title">CRM / CPQ</text>
    <text x="240" y="68" text-anchor="middle" dominant-baseline="central" class="subtitle">Sales rep submits order</text>
  </g>

  <!-- Component: billing_service -->
  <g data-component="billing_service" class="component component-internal">
    <rect x="80" y="130" width="320" height="56" rx="8" stroke-width="0.5"/>
    <text x="240" y="150" text-anchor="middle" dominant-baseline="central" class="title">Billing service</text>
    <text x="240" y="168" text-anchor="middle" dominant-baseline="central" class="subtitle">Ruby monolith, REST API</text>
  </g>

  <!-- Component: customer_orders -->
  <g data-component="customer_orders" class="component component-datastore">
    <rect x="440" y="130" width="200" height="56" rx="8" stroke-width="0.5"/>
    <text x="540" y="150" text-anchor="middle" dominant-baseline="central" class="title">customer_orders</text>
    <text x="540" y="168" text-anchor="middle" dominant-baseline="central" class="subtitle">Idempotency · status</text>
  </g>

  <!-- Component: sqs_fifo -->
  <g data-component="sqs_fifo" class="component component-internal">
    <rect x="80" y="230" width="320" height="56" rx="8" stroke-width="0.5"/>
    <text x="240" y="250" text-anchor="middle" dominant-baseline="central" class="title">SQS FIFO queue</text>
    <text x="240" y="268" text-anchor="middle" dominant-baseline="central" class="subtitle">MessageGroupId = order id</text>
  </g>

  <!-- Component: dlq -->
  <g data-component="dlq" class="component component-warning">
    <rect x="440" y="230" width="200" height="56" rx="8" stroke-width="0.5"/>
    <text x="540" y="250" text-anchor="middle" dominant-baseline="central" class="title">Dead-letter queue</text>
    <text x="540" y="268" text-anchor="middle" dominant-baseline="central" class="subtitle">After max retries</text>
  </g>

  <!-- Component: workers -->
  <g data-component="workers" class="component component-internal">
    <rect x="80" y="330" width="320" height="56" rx="8" stroke-width="0.5"/>
    <text x="240" y="350" text-anchor="middle" dominant-baseline="central" class="title">Async workers</text>
    <text x="240" y="368" text-anchor="middle" dominant-baseline="central" class="subtitle">Shoryuken consumers</text>
  </g>

  <!-- Component: billing_platform -->
  <g data-component="billing_platform" class="component component-external">
    <rect x="80" y="430" width="320" height="56" rx="8" stroke-width="0.5"/>
    <text x="240" y="450" text-anchor="middle" dominant-baseline="central" class="title">Subscription billing platform</text>
    <text x="240" y="468" text-anchor="middle" dominant-baseline="central" class="subtitle">External, synchronous HTTP</text>
  </g>

  <!-- Component: account_entitlements -->
  <g data-component="account_entitlements" class="component component-external">
    <rect x="80" y="530" width="320" height="56" rx="8" stroke-width="0.5"/>
    <text x="240" y="550" text-anchor="middle" dominant-baseline="central" class="title">Account &amp; entitlements</text>
    <text x="240" y="568" text-anchor="middle" dominant-baseline="central" class="subtitle">Provisions customer access</text>
  </g>

  <!-- Arrows -->
  <line x1="240" y1="86" x2="240" y2="130" class="arrow" marker-end="url(#arrow)"/>
  <line x1="400" y1="158" x2="440" y2="158" class="arrow" marker-end="url(#arrow)"/>
  <line x1="240" y1="186" x2="240" y2="230" class="arrow" marker-end="url(#arrow)"/>
  <line x1="400" y1="258" x2="440" y2="258" class="arrow" marker-end="url(#arrow)"/>
  <line x1="240" y1="286" x2="240" y2="330" class="arrow" marker-end="url(#arrow)"/>
  <path d="M400 358 L420 358 L420 208 L540 208 L540 186" fill="none" class="arrow" marker-end="url(#arrow)"/>
  <line x1="240" y1="386" x2="240" y2="430" class="arrow" marker-end="url(#arrow)"/>
  <line x1="240" y1="486" x2="240" y2="530" class="arrow arrow-dashed" marker-end="url(#arrow)"/>
  <text x="270" y="510" text-anchor="start" dominant-baseline="central" class="annotation">async callback</text>
</svg>
```

### Color and styling intent

The original rendering used a 4-color palette to encode meaning:

| Class | Role | Components | Suggested colors (light mode) |
|---|---|---|---|
| `component-external` | External systems we don't own | CRM/CPQ, Billing platform, Account & entitlements | Gray fill (#F1EFE8), gray stroke (#5F5E5A), darker gray text (#2C2C2A) |
| `component-internal` | Our system, active processing | Billing service, SQS FIFO, Workers | Light purple fill (#EEEDFE), purple stroke (#534AB7), dark purple text (#26215C) |
| `component-datastore` | State store | customer_orders | Light teal fill (#E1F5EE), teal stroke (#0F6E56), dark teal text (#04342C) |
| `component-warning` | Error/fallback path | DLQ | Light amber fill (#FAEEDA), amber stroke (#854F0B), dark amber text (#412402) |

**Typography:** Sans-serif. Titles 14px, weight 500. Subtitles 12px, weight 400. Sentence case throughout.

**Arrows:** 0.5px stroke, neutral gray. The `.arrow-dashed` class on the callback arrow should render `stroke-dasharray: 4 3`.

**Dark mode:** Invert. Use the equivalent darker fill (e.g., purple-800 #3C3489 for background) with lighter text (e.g., purple-100 #CECBF6).

### Implementation guidance for Claude Code

1. **Component structure.** Create a single React component, e.g., `OrderProcessingArchitecture.tsx` (or `.jsx` to match the site's convention). The component should manage state for which component (if any) is currently selected and show its notes.

2. **Click handling.** Each `<g data-component="...">` should have an `onClick` handler that sets state to the component's id. The notes panel reads from a constant map of component id → note content (use the content from Section 4 below).

3. **Note display pattern.** The original chat suggested a side panel, modal, or expanded inline section. Pick whichever best matches the rest of the site. If unsure, default to: notes appear in a panel below the diagram on mobile, beside it on desktop.

4. **Visual feedback on hover.** Add a subtle hover state (cursor: pointer, slight opacity change or stroke darkening) so users discover the boxes are clickable.

5. **Accessibility.** The SVG already has `role="img"`, `<title>`, and `<desc>`. Each clickable group should have `tabIndex={0}`, an `onKeyDown` handler for Enter/Space, and an `aria-label` describing the component. The note panel should have a region role and should announce changes via `aria-live="polite"`.

6. **CSS class naming.** Adapt the class names to match the site's existing convention (CSS modules, Tailwind, styled-components, etc.). The class names in the SVG above are illustrative.

7. **Don't over-design.** This is a portfolio piece. Keep it clean and readable. The content does the work, not the visual flourish.

---

## 4. Component Notes (for click-to-reveal)

These notes live in a map keyed by `data-component` value. Each note explains what the component is, why it's there, and the key design decision attached to it.

### crm_cpq — CRM / CPQ

The upstream sales-tooling system where reps configure and submit customer orders. Sends order intent to the billing service over HTTP with an idempotency key (the CPQ-generated subscription ID). External to the system being designed; the API contract with this team was negotiated up front.

### billing_service — Billing service

A Ruby monolith that exposes the REST API endpoint for order submission and also hosts the worker code and the callback handler. On submit, it persists the order intent to the customer_orders table (or returns the prior result if the idempotency key is a duplicate), enqueues a job to SQS FIFO, and returns a 200 to the CRM. The callback handler — also part of this monolith — receives async notifications from the billing platform on subscription changes and updates the account and entitlements service.

### customer_orders — customer_orders MySQL

A MySQL table in the existing billing monolith database. Owns three things that nothing else in the system owns:

- **Idempotency state** — a unique index on the CPQ subscription ID prevents duplicate processing. Last line of defense beyond the worker-level check and the FIFO 5-minute dedup window.
- **Status visibility** — every order's current state (pending, processing, succeeded, failed) is queryable here for upstream tooling and on-call.
- **Audit trail** — every order intent the system received, including ones that never made it to the billing platform.

Picked MySQL because the billing monolith already used it. Adding a new datastore would have been over-engineering at this scale.

### sqs_fifo — SQS FIFO queue

AWS SQS in FIFO mode. `MessageGroupId` is the order id, so concurrent events for the same order serialize while different orders run in parallel. This eliminates the double-processing race per order without requiring explicit row-level locking. FIFO's content-based dedup (5-minute window) provides defense-in-depth alongside the database unique constraint.

Throughput ceiling (300 msg/sec base, 3,000 with high-throughput mode) was never a concern at the scale of this workload.

### dlq — Dead-letter queue

Standard SQS DLQ pattern. Messages route here after the max retry count is exceeded, or immediately for terminal errors (malformed payloads, billing-platform 4xx). DLQ depth is alerted via Datadog. Recovery is a manual replay tool; runbook documented for on-call.

The deliberate distinction between retryable and terminal failures matters: it prevents retry budget from being burned on errors that will never succeed.

### workers — Async workers

Shoryuken consumers running in the same Ruby monolith. Each worker pulls a message, reads the order from MySQL, calls the external billing platform synchronously, and updates the order's status in MySQL based on the result. Worker concurrency is sized to keep queue depth near zero in steady state and to honor end-to-end latency targets.

### billing_platform — Subscription billing platform

External third-party platform that is the source of truth for subscription state and payment data. Synchronous HTTP API. Latency typically a few hundred milliseconds in our region; degrades for sales reps far from the platform's data center, but the geographic latency is in the network path, not the platform itself.

PCI scope sits with the platform — the system being designed never handles raw card data, only references.

### account_entitlements — Account & entitlements

Internal service that other product surfaces query to determine whether a customer has access to a given feature. Updated by the billing service's callback handler when the subscription billing platform fires an async callback after a successful subscription change. This is what closes the loop: the rep clicks submit, and within the SLO budget, the customer's product access is provisioned.

---

## 5. Design Decisions and Defenses

These are the four major design decisions covered in detail, framed for the deck. Each follows the structure: alternatives considered → what was picked → why it won → what it cost.

### Decision 1: Sync vs Async

**Considered:** Pure synchronous (CRM → API → billing platform → response in one hop), pure async with state machine, hybrid (sync happy path, async fallback).

**Picked:** Pure async with state machine.

**Why it won:**
- The external billing platform was a flaky synchronous dependency. Synchronous design would have propagated its outages to reps at submit time as timeouts and ambiguous errors.
- Order intent had to be durable from the moment of submit. Sync would have lost orders if the platform was down.
- Retries become a system property (worker retries from queue) rather than a session property (rep retries in browser). Cleaner mental model, fewer edge cases.

**What it cost:** Reps don't see immediate provisioning confirmation. They click submit, get a 200, and trust the system. Failure visibility moves to dashboards and downstream signals. Traded immediacy for resilience.

**Why not hybrid:** Two code paths, two failure modes, and the async path needs to exist anyway for retries. YAGNI on the hybrid until evidence the simpler design is failing.

### Decision 2: SQS vs Kafka vs other queues

**Considered:** AWS SQS, Kafka, Kinesis, EventBridge, an inline DB-backed queue (Sidekiq with Redis or a polling-based table).

**Picked:** AWS SQS.

**Why it won:**
- Scale didn't justify Kafka. Throughput target was modest; Kafka's ceiling advantages would be wasted while the operational cost would be paid regardless.
- FIFO and dedup are native to SQS. Kafka would have required building per-key serialization in application code.
- The internal infrastructure organization had stronger SQS support and tooling than Kafka. Building with SQS was meaningfully more efficient given the team and platform context.
- Smaller blast radius — SQS is fully managed by AWS. Kafka adds a dependency on the internal platform team's cluster, partitioning, and rebalancing decisions.

**What it cost:** No replay capability. If a bug surfaces later and reprocessing is needed, SQS can't help — replay would have to come from the MySQL audit log, which is fine but is a separate code path. A Kafka shop would have replay for free.

### Decision 3: FIFO vs Standard SQS

**Considered:** SQS FIFO and SQS Standard.

**Picked:** FIFO.

**Why it won:**
- Per-order serialization via `MessageGroupId = order_id` prevents two events for the same order from being processed concurrently. The double-processing race is solved at the queue layer rather than in application code.
- 5-minute content-based dedup catches CPQ-side rapid retries before they hit the worker. Defense in depth alongside the MySQL unique constraint.
- Throughput ceiling (300 msg/sec base, 3,000 with high-throughput mode) was vastly above actual scale.

**What it cost:** Harder operationally if the system ever needed to fan out to multiple consumers or replay. Throughput ceiling, while not hit, is real — at 10x scale the choice would warrant revisiting.

**Note on "exactly once":** FIFO provides exactly-once delivery within the dedup window, not exactly-once processing. The worker itself still has to be idempotent, which it is via the MySQL unique constraint and the upstream-supplied idempotency key. Be precise on this distinction in Q&A.

### Decision 4: MySQL state DB vs alternatives

**Considered:** Existing MySQL in the billing monolith, dedicated separate MySQL instance, DynamoDB, Redis, no state DB at all.

**Picked:** Existing MySQL in the billing monolith.

**Why it won:**
- The monolith already used MySQL. No new datastore to operate, secure, back up, monitor.
- Workload fits comfortably — point lookups by idempotency key plus small range queries by customer. ~500K rows/year worst case at target throughput. MySQL is laughably overprovisioned for this.
- Transactional integration with related billing data when needed.
- Team familiarity. Nobody had to learn anything new.

**What it cost:** Coupled to the monolith's database lifecycle. Schema migrations coordinate with billing's release process. If the billing DB has an outage, this service has an outage. At higher scale or with stronger isolation requirements, separation would be warranted.

**Why not DynamoDB:** Looks attractive on paper for the idempotency-key access pattern. But it adds a datastore to operate, no SQL for ad-hoc queries, no transactions with billing data, no real benefit at this scale. Pragmatism over novelty.

**Why not no DB at all:** A durable record of every order intent is required, including ones that never reached the billing platform. SQS is transient. The platform doesn't know about orders that failed before reaching it. Idempotency, status, and audit have no good alternative home.

---

## 6. Idempotency End-to-End (deep dive)

The interviewer will likely probe this hard. Here is the full picture:

**Key:** A UUID generated by the CRM (the CPQ subscription ID). Supplied on every submit. The contract with the CRM team is that retries reuse the original UUID — that's documented and tested.

**Where it's checked:**
1. Worker reads the order from MySQL by the key. If status is already terminal (succeeded or failed), the worker returns the prior result without re-processing.
2. Database unique index on the key is the last line of defense — even under a race, the second insert fails.
3. The same key is passed through to the external billing platform as its idempotency key, so retries on that side also collapse to the same operation.

**Same key, different payload:** Treated as the same logical operation. The system returns the original result for subsequent calls and logs the divergence as a data integrity signal. This matches standard idempotency semantics (Stripe and others handle it the same way).

**Amendments:** A legitimate amendment to an existing subscription is a *different* operation with a *different* key. The CRM generates a new amendment record referencing the original subscription. Keys are never reused.

**Why upstream-supplied:** If the worker generated the key on receipt, every retry from the CRM would look like a new order. The key has to be stable across the entire end-to-end retry path.

---

## 7. Failure Modes (deep dive)

**Worker crashes mid-processing:** SQS visibility timeout returns the message to the queue. Another worker picks it up. The dangerous case is "billing platform succeeded, worker died before writing back to MySQL." On retry: the idempotency key passed to the platform prevents double-creation; the worker re-reads platform state to learn what happened and reconcile MySQL. This failure mode is worth dwelling on in the deck — it's the kind of detail that signals "this person has actually run a system in production."

**Billing platform returns 5xx:** Retryable. Message stays in queue, visibility timeout will redeliver. Worker increments attempt count.

**Billing platform returns 4xx:** Terminal (it won't succeed on retry). Message goes directly to DLQ; manual triage. This separation matters — without it, the retry budget gets burned on errors that will never succeed.

**Billing platform timeout:** Treated as retryable, but the worker has to re-read the platform state on retry to handle the case where the timeout masked a successful operation.

**Billing platform down for an hour:** Backpressure on SQS. Visibility timeouts cause redelivery. Orders pile up in queue. SQS scales fine; an hour of buffering at 1000/min = 60K messages, trivial. Datadog alerts on sustained queue depth and DLQ depth. Distinguishing "platform is down" from "we have a bug" is the alerting nuance — usually the former is detected by external health checks plus the dominant error code in worker logs.

**MySQL down:** The billing service itself is down. The system fails closed — the API returns 503. CRM sees errors at submit time. Not great but acceptable; database availability is part of the platform's overall SLA.

**SQS region outage:** Out of scope. AWS managed service.

---

## 8. Cross-Functional Considerations

The presentation prompt explicitly calls for usability, performance, and security trade-offs. These were lightly covered in the chat session and are areas to develop further before the interview.

### Performance

- End-to-end P95 measured in Datadog post-launch. SLOs defined against actual measurements rather than aspirational targets.
- Latency budget: queue hop is negligible (single-digit ms), worker-to-platform sync call is a few hundred ms in steady state, callback path adds another few hundred ms. Well under the 5s end-to-end target on the happy path.
- At 1000/min with 5s end-to-end, ~83 orders are in flight at any time. Worker concurrency floor sized accordingly with headroom.

### Security

To be developed further. Areas to cover:
- Authentication between services (CRM → API, API → billing platform). Likely service-to-service tokens or mTLS.
- Secrets management for billing platform credentials (likely AWS Secrets Manager or similar).
- Encryption at rest (MySQL) and in transit (HTTPS everywhere).
- PII handling in payloads and logs. What's logged vs. redacted.
- DLQ contents — humans read these during recovery. What's in them and how is access controlled.
- PCI scope — confirmed to sit entirely with the external billing platform. The system never handles raw card data, only references.
- Standard SOC 2 controls applied; nothing project-specific beyond hygiene.

### Usability (rep-facing)

To be developed further. Areas to cover:
- The rep doesn't see immediate provisioning confirmation (async). What did they see at submit time? How did they know if something failed?
- Support and customer success visibility into failed orders — what tooling, what dashboards.
- Rollout strategy — feature flag, shadow mode, phased customer rollout?

### Trade-offs

The headline trade-off is **immediacy vs. resilience**. Sync would give reps instant confirmation but propagate every billing-platform hiccup. Async absorbs hiccups but defers confirmation. The system optimizes for correctness; latency is an SLO that holds in steady state, not a hard contract.

---

## 9. Execution and Reflection

The presentation prompt explicitly asks: what went well, what would you do differently, and what process or organizational changes were needed alongside the technical work.

These need to be filled in honestly before the interview. Some prompts to reflect on:

**What went well:**
- Architectural review with the lead group architect before implementation — caught issues early
- Idempotency designed in from day one rather than retrofitted
- Datadog instrumentation added at every hop, enabling real SLO definition post-launch
- Clean scope (Phase 1 only) shipped in 2–3 months with a 3-person team

**What would you do differently:**
- Active reconciliation between the system DB and the external billing platform — for now, divergences are caught manually; a periodic reconciliation job would catch drift earlier
- Archival/retention policy for the customer_orders table — accumulates indefinitely in the current design
- More explicit error classification (retryable vs terminal) at the boundary, with structured error codes from the billing platform mapped to internal categories

**Process / org changes:**
- The contract with the CRM team for stable idempotency keys — this had to be negotiated and documented; it's not just a code change
- On-call ownership for the new service. Runbook for DLQ recovery. Escalation paths for billing-platform outages.
- Deployment strategy that coordinated with the existing billing monolith's release process

The "what I'd do differently" reflection is the single highest-leverage seniority signal in the presentation. Don't skip it.

---

## 10. Remaining Work Before the Interview

**High priority:**

1. **Develop the Security section in depth.** Auth between services, secrets management, encryption, PII handling, DLQ access controls, log scrubbing. The audience includes Security stakeholders — this will be probed.

2. **Develop the Product/Usability section in depth.** What reps saw at submit time, how Support/CS got visibility into failures, rollout strategy (feature flags, shadow mode, phased customer rollout), what metrics PMs cared about.

3. **Refine Execution and Reflection.** The "what I'd do differently" answer is the single highest-leverage seniority signal. Make it specific and honest, not generic.

4. **Build the deck.** Slide structure suggestion:
   - Title (1 slide)
   - Problem context — what was being solved, why it mattered, business shape (2 slides)
   - Constraints and goals — what was non-negotiable, what was off-limits, what targets were defined and how (1–2 slides)
   - Architecture overview — the diagram from this document, with the high-level data flow (1 slide)
   - Decision deep-dives — 1 slide per major decision (4 slides). Format: Considered / Picked / Why / What it cost.
   - Idempotency end-to-end (1 slide, supplementary diagram)
   - Failure modes (1 slide, scenario walkthrough)
   - Cross-functional — security, product, performance trade-offs (1–2 slides)
   - Execution and reflection — what went well, what I'd do differently, org/process changes (1–2 slides)
   - Outcomes (1 slide)
   - Appendix — predicted Q&A topics with deeper detail, ready to switch to if asked

5. **Build supplementary diagrams.** The main architecture diagram won't carry the whole deck. Plan for at least:
   - An idempotency flow diagram (where the key is generated, checked, enforced — three points across the system)
   - A failure-handling diagram (retryable vs terminal paths, DLQ flow)

6. **Practice the talk to time.** 20–25 min for the presentation portion. If the deck runs over on first practice, cut content rather than speed up.

**Medium priority:**

7. **Plant explicit decision points** in the deck — phrases like "we had to choose between X and Y, I'll tell you what we picked, but happy to dig in" — to invite interaction at predictable moments.

8. **Prepare a 20-minute version** in case Q&A starts early. Know which slides are skippable.

9. **Anticipate Q&A topics and prepare appendix slides:**
   - "Why not Kafka?" (already covered)
   - "Walk through idempotency end-to-end" (already covered)
   - "What happens when the worker crashes mid-processing?" (already covered)
   - "How would you scale this 10x?" (FIFO ceiling becomes a concern; might split queues by tenant or move to Kafka)
   - "How would you redesign for multi-tenancy?" (relevant to Authorium's domain — they serve many agencies)
   - "Audit trail / compliance traceability" (also relevant to govtech)

**Low priority but worth thinking about:**

10. **Authorium-specific framing.** The audience is at a govtech company that values compliance, multi-tenancy, document-centric workflows, and integration with legacy systems. When discussing this project, frame it in language that resonates: "integration with an external system of record," "audit trail," "idempotency under retry," "compliance-friendly state management." Don't force the connection, but don't bury it either.

11. **The "specific role and decision-making" angle.** The prompt explicitly asks for this. Be precise: tech lead + IC + project manager on a 3-person team. Owned the design doc. Sought architectural review from the lead group architect. Drove stakeholder approval. This isn't bragging — it's answering the question.

---

## 11. Things to Avoid

- **Do not mention Phase 2.** It was deprioritized for company reasons before implementation. Cleanly scope the project to Phase 1 in production.
- **Do not name Zendesk, Talk, Zuora, Salesforce CPQ, Pravda, or Shoryuken-as-an-internal-thing.** Use the anonymized labels throughout.
- **Do not call the system "fire and forget."** It's asynchronous processing with an end-to-end SLO. Fire-and-forget implies you don't care about the outcome — the system very much does.
- **Do not overclaim "exactly once" semantics on FIFO.** It's exactly-once *delivery* within the dedup window, not exactly-once *processing*. The worker still has to be idempotent.
- **Do not claim SLOs were hit from day one.** They were defined post-launch based on actual Datadog measurements. The honest framing is more senior than the fake one.
- **Do not skip "what I'd do differently."** It's the highest-leverage seniority signal.

---

## 12. Open Questions / Memory Gaps

These are details that couldn't be confirmed from memory in the chat session. They're either reconstructable from first principles (and presented that way in the interview) or honestly flagged as gaps.

- **`MessageGroupId` exact value.** The defensible reconstruction is `cpq_subscription_id` or the equivalent order identifier — per-order grouping is the only design choice that makes sense given the constraints. State this confidently in the interview as derived from the design intent rather than recalled by name.
- **Exact retention policy on customer_orders.** Likely accumulating indefinitely; mention as a "what I'd do differently" candidate.
- **Exact rollout strategy at launch.** Worth reconstructing before the interview — feature flag? shadow mode? phased customer rollout?
- **What reps saw on the submit screen** when an order was in-flight or failed downstream. Worth reconstructing.

---

End of handoff document.
