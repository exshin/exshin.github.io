# System Design Interview Prep — Portable Handoff

A self-contained handoff bundle for continuing system design interview prep in another Claude session (claude.ai). The example below is reusable across interviews — only the audience and emphasis change.

---

## 0. How to use this document

Paste this whole file into claude.ai at the start of a new chat, then say something like:

> I'm prepping for a system design interview at **[COMPANY]**. The role is **[ROLE]**. The example I'll present is in the document I just shared. Help me **[adapt the framing / develop section X / drill on Q&A / refine the deck / etc.]** for this audience.

Tell the new chat:
- **Who the audience is** (eng-only? eng+product+security? infra-heavy?). Different audiences probe different things.
- **The interview format** (length, presentation vs whiteboard, panel composition).
- **What's emphasized in their JD** (scale, reliability, compliance, multi-tenancy, ML/RAG, infra modernization, etc.) — this is the strongest signal for which existing trade-offs to elevate.
- **The presentation prompt** if they sent one. The example below was originally framed against the prompt in §1 — substitute the new one.

This bundle is **already anonymized** — all proprietary names from the original project have been replaced with generic labels. Keep it that way.

---

## 1. Interview format (template)

Typical shape for senior/lead system design rounds, to be replaced with the actual format for the target company.

- **Length:** ~45 minutes
- **Split:** ~20–25 min presentation + 20–25 min Q&A
- **Audience:** Engineering + Product + Security (varies)
- **Mode:** Some in-person, some video

Generic prompt this content is tuned against — the actual company prompt usually phrases it differently but asks for the same things:

> Present a system design from your experience showcasing technical depth. Cover **problem context** (what and why), **the design** (architecture + alternatives + decisions), **cross-functional considerations** (usability, performance, security trade-offs), and **execution and reflection** (what went well, what you'd do differently, org/process changes). A strong presentation focuses on a system with real complexity and meaningful trade-offs, shows your specific role and decision-making, and demonstrates communication across engineering, product, and security stakeholders.

---

## 2. The Project

**Title:** Order Processing Integration Service

**One-liner:** Async integration service connecting a CRM/CPQ system to an external subscription billing platform, with end-to-end provisioning of customer access.

**Headline numbers:**
- Sub-5-second end-to-end order creation on the happy path
- 99.9% data accuracy in steady state (measured by reconciliation between system state, the platform, and entitlements)
- Throughput target of 1,000+ orders per minute met with significant headroom

**SLO honesty:** SLOs were defined **post-launch** based on actual behavior measured in instrumentation, not aspirational targets claimed up front. The honest framing reads as more senior than the fake one.

**Role:** Tech lead + IC + de facto project manager on a 3-person team. Owned the design doc and architecture flow charts. Sought review from the lead group architect. Drove stakeholder approval.

**Timeline:** ~2–3 months from design to production rollout for the in-scope phase.

**Scoping note:** A planned next-phase fan-out via an integration gateway to additional downstream consumers was deprioritized before implementation. **Do not mention it in the presentation** — present the project as cleanly scoped to what shipped.

---

## 3. Architecture Diagram

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

  <g data-component="crm_cpq" class="component component-external">
    <rect x="80" y="30" width="320" height="56" rx="8" stroke-width="0.5"/>
    <text x="240" y="50" text-anchor="middle" dominant-baseline="central" class="title">CRM / CPQ</text>
    <text x="240" y="68" text-anchor="middle" dominant-baseline="central" class="subtitle">Sales rep submits order</text>
  </g>
  <g data-component="billing_service" class="component component-internal">
    <rect x="80" y="130" width="320" height="56" rx="8" stroke-width="0.5"/>
    <text x="240" y="150" text-anchor="middle" dominant-baseline="central" class="title">Billing service</text>
    <text x="240" y="168" text-anchor="middle" dominant-baseline="central" class="subtitle">Ruby monolith, REST API</text>
  </g>
  <g data-component="customer_orders" class="component component-datastore">
    <rect x="440" y="130" width="200" height="56" rx="8" stroke-width="0.5"/>
    <text x="540" y="150" text-anchor="middle" dominant-baseline="central" class="title">customer_orders</text>
    <text x="540" y="168" text-anchor="middle" dominant-baseline="central" class="subtitle">Idempotency · status</text>
  </g>
  <g data-component="sqs_fifo" class="component component-internal">
    <rect x="80" y="230" width="320" height="56" rx="8" stroke-width="0.5"/>
    <text x="240" y="250" text-anchor="middle" dominant-baseline="central" class="title">SQS FIFO queue</text>
    <text x="240" y="268" text-anchor="middle" dominant-baseline="central" class="subtitle">MessageGroupId = order id</text>
  </g>
  <g data-component="dlq" class="component component-warning">
    <rect x="440" y="230" width="200" height="56" rx="8" stroke-width="0.5"/>
    <text x="540" y="250" text-anchor="middle" dominant-baseline="central" class="title">Dead-letter queue</text>
    <text x="540" y="268" text-anchor="middle" dominant-baseline="central" class="subtitle">After max retries</text>
  </g>
  <g data-component="workers" class="component component-internal">
    <rect x="80" y="330" width="320" height="56" rx="8" stroke-width="0.5"/>
    <text x="240" y="350" text-anchor="middle" dominant-baseline="central" class="title">Async workers</text>
    <text x="240" y="368" text-anchor="middle" dominant-baseline="central" class="subtitle">Shoryuken consumers</text>
  </g>
  <g data-component="billing_platform" class="component component-external">
    <rect x="80" y="430" width="320" height="56" rx="8" stroke-width="0.5"/>
    <text x="240" y="450" text-anchor="middle" dominant-baseline="central" class="title">Subscription billing platform</text>
    <text x="240" y="468" text-anchor="middle" dominant-baseline="central" class="subtitle">External, synchronous HTTP</text>
  </g>
  <g data-component="account_entitlements" class="component component-external">
    <rect x="80" y="530" width="320" height="56" rx="8" stroke-width="0.5"/>
    <text x="240" y="550" text-anchor="middle" dominant-baseline="central" class="title">Account &amp; entitlements</text>
    <text x="240" y="568" text-anchor="middle" dominant-baseline="central" class="subtitle">Provisions customer access</text>
  </g>

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

### Component notes

- **CRM / CPQ.** Upstream sales-tooling system where reps configure and submit orders. Sends order intent to the billing service over HTTP with an idempotency key (the CPQ-generated subscription ID). External; API contract was negotiated up front.
- **Billing service.** Ruby monolith. Exposes the REST API for order submission, hosts the worker code, and hosts the callback handler. On submit: persists order intent to `customer_orders` (or returns the prior result if the idempotency key is a duplicate), enqueues to SQS FIFO, returns 200 to the CRM. Callback handler receives async notifications from the billing platform and updates account & entitlements.
- **customer_orders (MySQL).** Owns three things nothing else owns: **idempotency state** (unique index on the CPQ subscription ID — last line of defense beyond the worker check and the FIFO dedup window), **status visibility** (every order's current state queryable for upstream tooling and on-call), and **audit trail** (every order intent received, including ones that never reached the billing platform). Picked MySQL because the monolith already used it — adding a new datastore would have been over-engineering.
- **SQS FIFO queue.** `MessageGroupId = order id`, so concurrent events for the same order serialize while different orders run in parallel. Eliminates the double-processing race per order without explicit row-level locking. 5-minute content-based dedup is defense-in-depth alongside the DB unique constraint. Throughput ceiling (300 msg/sec base, 3,000 with high-throughput mode) was never a concern at this scale.
- **Dead-letter queue.** Standard SQS DLQ. Messages route here after max retries or immediately for terminal errors (malformed payloads, billing-platform 4xx). DLQ depth alerted in monitoring. Recovery is a manual replay tool; runbook documented for on-call. **The deliberate retryable-vs-terminal split prevents retry budget from being burned on errors that will never succeed.**
- **Async workers.** Shoryuken consumers in the same Ruby monolith. Each pulls a message, reads the order from MySQL, calls the billing platform synchronously, updates status in MySQL based on the result. Concurrency sized to keep queue depth near zero in steady state and honor latency targets.
- **Subscription billing platform.** External third party, source of truth for subscription state and payment data. Synchronous HTTP API. Latency typically a few hundred ms; degrades for reps far from the platform's region (network path, not platform). **PCI scope sits with the platform — the system never handles raw card data, only references.**
- **Account & entitlements.** Internal service other product surfaces query to determine feature access. Updated by the billing service's callback handler when the platform fires an async callback after a successful subscription change. This closes the loop: rep clicks submit, within the SLO budget the customer's access is provisioned.

---

## 4. Problem context (deck-ready)

**What was being solved:** Sales reps submitted customer orders in a CRM/CPQ system. Each order had to provision the customer in an external subscription billing platform and unlock product access in an internal entitlements service. End-to-end, a click in sales tooling needed to result in a billed, provisioned customer — reliably.

**Why it mattered:** Direct revenue path. Lost or stuck orders meant lost revenue, manual recovery work, and customer trust damage. Sales, finance, support, and customers all depended on this loop closing predictably.

**What was painful before:**
- Prior integration coupled sales-side submit directly to the external billing platform.
- When the platform had hiccups (and it did), reps saw timeouts and ambiguous errors at submit time.
- Some orders were lost; others were duplicated by retries.
- No durable record of order intent independent of the platform — recovery was guesswork.

**Shape of the work:** Tech lead + IC on a 3-person team. ~2–3 months from design to production rollout.

---

## 5. Constraints and goals (deck-ready)

**Hard constraints:**
- External billing platform is the source of truth for subscription state — we cannot replace it, only integrate.
- It is a flaky synchronous dependency — outages and elevated latencies are expected.
- PCI scope must stay entirely with the external platform. We never handle raw card data.
- Order intent must be durable from the moment of submit — never lost to a downstream outage.

**Idempotency requirement:**
- CRM-side retries are common and unavoidable.
- The same logical order must not be processed twice — duplicate provisioning is a real customer-impact failure.

**Targets:**
- Throughput: 1,000+ orders per minute.
- End-to-end latency: sub-5 seconds on the happy path.
- Data accuracy: 99.9% — divergence between our state, the platform, and entitlements should be vanishingly rare.

**Compliance and audit:**
- Every order intent received must be durably recorded — including ones that never reached the platform.
- Status of every order must be queryable for support, finance, and on-call.

---

## 6. Design decisions (deck-ready)

Each follows: alternatives → picked → why → what it cost.

### Decision 1: Sync vs Async

**Considered:** Pure synchronous (CRM → API → billing platform → response in one hop). Pure async with state machine. Hybrid (sync happy path, async fallback).

**Picked:** Pure async with state machine.

**Why it won:**
- External billing platform was a flaky synchronous dependency. Sync would propagate every outage to reps at submit time as timeouts and ambiguous errors.
- Order intent had to be durable from the moment of submit. Sync would lose orders if the platform was down.
- Retries become a system property (worker retries from queue) rather than a session property (rep retries in browser). Cleaner mental model, fewer edge cases.

**What it cost:** Reps don't see immediate provisioning confirmation — they click submit, get a 200, and trust the system. Failure visibility moves to dashboards and downstream signals. **Traded immediacy for resilience.**

**Why not hybrid:** Two code paths, two failure modes, and the async path needs to exist anyway for retries. YAGNI on the hybrid until evidence the simpler design is failing.

### Decision 2: Queue selection (SQS vs Kafka vs others)

**Considered:** AWS SQS. Kafka. Kinesis. EventBridge. DB-backed queue (Sidekiq/Redis or polling table).

**Picked:** AWS SQS.

**Why it won:**
- Scale didn't justify Kafka. Throughput target was modest; Kafka's ceiling advantages would be wasted while the operational cost would be paid regardless.
- FIFO and dedup are native to SQS. Kafka would have required building per-key serialization in application code.
- The internal infrastructure org had stronger SQS support and tooling than Kafka — meaningfully more efficient given team and platform context.
- Smaller blast radius — SQS is fully managed by AWS. Kafka adds dependency on internal platform team's cluster, partitioning, and rebalancing decisions.

**What it cost:** No replay capability. If a bug surfaces later, reprocessing requires a separate code path reading from the MySQL audit log. A Kafka shop would have replay for free.

### Decision 3: FIFO vs Standard SQS

**Considered:** SQS FIFO and SQS Standard.

**Picked:** FIFO.

**Why it won:**
- Per-order serialization via `MessageGroupId = order_id` prevents concurrent processing of two events for the same order. The double-processing race is solved at the queue layer, not in application code.
- 5-minute content-based dedup catches rapid upstream retries before they hit the worker. Defense-in-depth alongside the MySQL unique constraint.
- Throughput ceiling (300 msg/sec base, 3,000 with high-throughput mode) was vastly above actual scale.

**What it cost:** Harder operationally if the system ever needed to fan out to multiple consumers or replay. Throughput ceiling, while not hit, is real — at 10x scale the choice would warrant revisiting.

**Precision note for Q&A:** FIFO provides **exactly-once delivery within the dedup window**, not exactly-once processing. The worker still has to be idempotent (it is, via the MySQL unique constraint and the upstream-supplied idempotency key). Don't overclaim.

### Decision 4: State database

**Considered:** Existing MySQL in the billing monolith. Dedicated separate MySQL. DynamoDB. Redis. No state DB at all.

**Picked:** Existing MySQL in the billing monolith.

**Why it won:**
- The monolith already used MySQL. No new datastore to operate, secure, back up, or monitor.
- Workload fits comfortably — point lookups by idempotency key plus small range queries by customer. ~500K rows/year worst case at target throughput. MySQL is overprovisioned for this.
- Transactional integration with related billing data when needed.
- Team familiarity. Nobody had to learn anything new.

**What it cost:** Coupled to the monolith's database lifecycle. Schema migrations coordinate with billing's release process. If the billing DB has an outage, this service has an outage. At higher scale or with stronger isolation requirements, separation would be warranted.

**Why not DynamoDB:** Looks attractive on paper for the idempotency-key access pattern. But it adds a datastore to operate, no SQL for ad-hoc queries, no transactions with billing data, no real benefit at this scale. Pragmatism over novelty.

**Why not no DB:** A durable record of every order intent is required, including ones that never reached the billing platform. SQS is transient. The platform doesn't know about orders that failed before reaching it. Idempotency, status, and audit have no good alternative home.

---

## 7. Idempotency end-to-end (deep dive)

This is the section interviewers probe hardest. Have all of this ready.

**The key:** A UUID generated by the CRM (the CPQ subscription ID). Supplied on every submit. **Contract with the CRM team: retries reuse the original UUID.** Documented and tested.

**Where it's checked — three layers:**
1. Worker reads the order from MySQL by the key. If status is already terminal (succeeded or failed), the worker returns the prior result without re-processing.
2. Database unique index on the key is the last line of defense — even under a race, the second insert fails.
3. The same key is passed through to the external billing platform as its idempotency key, so retries on that side also collapse to the same operation.

**Same key, different payload:** Treated as the same logical operation. The system returns the original result for subsequent calls and logs the divergence as a data integrity signal. Matches standard idempotency semantics (Stripe and others handle it the same way).

**Amendments:** A legitimate amendment to an existing subscription is a *different* operation with a *different* key. The CRM generates a new amendment record referencing the original subscription. **Keys are never reused.**

**Why upstream-supplied:** If the worker generated the key on receipt, every retry from the CRM would look like a new order. The key has to be stable across the entire end-to-end retry path.

---

## 8. Failure modes (deep dive)

**Worker crashes mid-processing:** SQS visibility timeout returns the message to the queue. Another worker picks it up. The dangerous case is "billing platform succeeded, worker died before writing back to MySQL." On retry: the idempotency key passed to the platform prevents double-creation; the worker re-reads platform state to learn what happened and reconcile MySQL. **Dwell on this in the deck — it signals you've actually run a system in production.**

**Billing platform returns 5xx:** Retryable. Message stays in queue, visibility timeout will redeliver. Worker increments attempt count.

**Billing platform returns 4xx:** Terminal (it won't succeed on retry). Message goes directly to DLQ; manual triage. This separation matters — without it, the retry budget gets burned on errors that will never succeed.

**Billing platform timeout:** Treated as retryable, but the worker has to re-read platform state on the next attempt to handle the case where the timeout masked a successful operation.

**Billing platform down for an hour:** Backpressure on SQS. Visibility timeouts cause redelivery. Orders pile up in queue. 1,000/min × 60 min = 60K messages, trivial for SQS. Monitoring alerts on sustained queue depth and DLQ depth. Distinguishing "platform is down" from "we have a bug" is the alerting nuance — usually the former is detected by external health checks plus the dominant error code in worker logs.

**MySQL down:** The billing service itself is down. System fails closed — API returns 503. CRM sees errors at submit time. Acceptable — database availability is part of the platform's overall SLA.

**SQS region outage:** Out of scope. AWS managed service.

---

## 9. Cross-functional considerations

### Performance
- End-to-end P95 measured post-launch. SLOs defined against actual measurements, not aspirational targets.
- Latency budget: queue hop is single-digit ms, worker-to-platform sync call a few hundred ms, callback path another few hundred ms — well under the 5s target on the happy path.
- At 1,000/min with 5s end-to-end, ~83 orders in flight at any time. Worker concurrency floor sized accordingly with headroom.

### Security
- Service-to-service auth (CRM → billing API, billing service → billing platform) via service tokens or mTLS.
- Secrets management for billing platform credentials via secrets manager — not hardcoded, not in environment variables.
- Encryption at rest (MySQL) and in transit (HTTPS everywhere).
- PII handling: customer identifiers logged; raw order payload fields scrubbed at the log boundary.
- DLQ contents reviewed by humans during recovery — access controlled to on-call engineers.
- PCI scope sits entirely with the external billing platform. The system never handles raw card data, only references.
- Standard SOC 2 controls applied; nothing project-specific beyond hygiene.

### Usability (rep-facing)
- Reps submit and get a 200 immediately. No immediate provisioning confirmation — the async trade-off.
- Failed orders surfaced via dashboards and DLQ depth alerts to support and customer success.
- Rollout via feature flag with gradual customer enablement. Previous code path stayed in place as fallback during initial rollout.

### The headline trade-off
**Immediacy vs. resilience.** Sync would give reps instant confirmation but propagate every billing-platform hiccup. Async absorbs hiccups but defers confirmation. The system optimizes for correctness; latency is an SLO that holds in steady state, not a hard contract.

---

## 10. Execution and reflection

### What went well
- Architectural review with the lead group architect before implementation — caught issues early and built buy-in.
- Idempotency designed in from day one rather than retrofitted. The cost of adding it later would have been high.
- Instrumentation added at every hop, enabling real SLO definition post-launch rather than claiming aspirational targets.
- Clean scope shipped in 2–3 months with a 3-person team.

### What I'd do differently
- **Active reconciliation** between system DB and the external billing platform. Currently divergences are caught manually; a periodic reconciliation job would catch drift earlier.
- **Archival and retention policy** for the `customer_orders` table — accumulates indefinitely in the current design.
- **More explicit error classification** at the boundary: structured error codes from the billing platform mapped to internal retryable/terminal categories in one place, not scattered across workers.

> The "what I'd do differently" answer is the **single highest-leverage seniority signal**. Don't skip it. Make it specific.

### Process / org changes
- Contract with the CRM team for stable idempotency keys had to be negotiated and documented — an API contract between teams, not just a code change.
- On-call ownership: runbook for DLQ recovery, escalation paths for billing-platform outages, alert tuning to distinguish system bugs from platform outages.
- Deployment coordination with the billing monolith's release process — schema migrations required coordination with the broader billing team.

### My role
- Tech lead + IC + de facto project manager on a 3-person team.
- Owned the design doc and architecture flow charts.
- Sought review from the lead group architect. Drove stakeholder approval across engineering, product, and security.

---

## 11. Outcomes

- Sub-5-second end-to-end order creation on the happy path.
- 99.9% data accuracy in steady state — measured by reconciliation between our state, the platform, and entitlements.
- Throughput target of 1,000+ orders per minute met with significant headroom.
- Idempotency end-to-end working under real retry traffic, with the MySQL unique constraint as the last line of defense.
- Documented runbook for DLQ recovery and platform-outage triage; on-call ownership in place.
- External platform outages are absorbed by the queue, not propagated to reps at submit time.
- Recovery is mechanical — replay from MySQL audit log, manual triage from DLQ — not investigative archaeology.

---

## 12. Things to avoid in delivery

- **Do not name the original company or any vendor product** (the CRM/CPQ tool, the external billing platform, the entitlements service, the worker library). Use the anonymized labels throughout. The presentation prompt explicitly asks not to share proprietary info.
- **Do not mention the deprioritized next phase.** Cleanly scope to what shipped.
- **Do not call this "fire and forget."** It's asynchronous processing with an end-to-end SLO. Fire-and-forget implies you don't care about the outcome.
- **Do not overclaim exactly-once.** FIFO = exactly-once delivery within the dedup window, not exactly-once processing. Worker idempotency does the actual work.
- **Do not claim SLOs were hit from day one.** They were defined post-launch from real measurements. The honest framing is more senior.
- **Do not skip "what I'd do differently."** It's the highest-leverage seniority signal in the talk.

---

## 13. Open questions / memory gaps

Reconstructable from first principles if probed; flag honestly if pressed.

- **Exact `MessageGroupId` value.** Defensible reconstruction: the order/CPQ subscription identifier. Per-order grouping is the only design choice that makes sense given the constraints. State confidently as derived from design intent.
- **Exact retention policy on `customer_orders`.** Likely accumulating indefinitely; already mentioned as a "what I'd do differently" candidate.
- **Exact rollout strategy at launch.** Best current reconstruction: feature flag with gradual customer enablement, prior code path retained as fallback during initial rollout.
- **What reps saw on the submit screen** when an order was in-flight or failed downstream. Worth reconstructing for usability questions.

---

## 14. Deck structure (already proven)

The structure below shipped as a clickable slide deck on a portfolio page and held together well end-to-end. Reusable as-is, or adapt:

1. **Title**
2. **Problem Context** — §4 above
3. **Constraints & Goals** — §5 above
4. **Architecture Overview** — diagram (§3) + click-to-reveal component notes
5. **Decision 1: Sync vs Async** — §6
6. **Decision 2: Queue Selection** — §6
7. **Decision 3: FIFO vs Standard** — §6
8. **Decision 4: State Database** — §6
9. **Idempotency End-to-End** — §7
10. **Failure Modes** — §8
11. **Cross-Functional Considerations** — §9
12. **Execution & Reflection** — §10
13. **Outcomes** — §11
14. **Thank You / Q&A**

Slides 5–8 (decision deep-dives) all follow the same template: **Considered / Picked / Why / What it cost**. Repeating the template helps the audience follow the rhythm and frees attention for the content.

Time budget: ~20–25 minutes. Plant explicit decision points ("we had to choose between X and Y — I'll tell you what we picked, but happy to dig in") to invite interaction at predictable moments. Have a 20-minute version ready in case Q&A starts early — know which slides are skippable.

---

## 15. Common Q&A topics (with prepared answers)

- **"Why not Kafka?"** — §6 Decision 2.
- **"Walk through idempotency end-to-end."** — §7.
- **"What happens when the worker crashes mid-processing?"** — §8.
- **"How would you scale this 10x?"** — FIFO throughput ceiling (3,000 msg/sec high-throughput) approaches relevance; might split queues by tenant or move to Kafka. Worker concurrency scales horizontally. MySQL would need partitioning or a dedicated instance well before the queue does. Reconciliation becomes mandatory at scale.
- **"Multi-tenancy?"** — Current design is single-tenant within a single platform deployment. Tenant-per-row in MySQL would be the smallest extension; tenant-per-queue or tenant-per-MessageGroupId-prefix gives stronger isolation.
- **"Audit/compliance traceability?"** — Every order intent durably recorded in `customer_orders` with status transitions logged. DLQ retains failed messages with reason. End-to-end trace via the upstream-supplied idempotency key.

---

## 16. What to ask the new chat to do

Suggested first prompts in claude.ai after pasting this document:

- *"Read the audience and emphasis I'm giving you below. Tell me which sections of this design would resonate most and which should be downplayed. Audience: [...]. Emphasis from JD: [...]."*
- *"Help me build out the appendix Q&A list specifically for [COMPANY]'s domain (e.g., scale, compliance, multi-tenancy, ML/RAG, infra modernization)."*
- *"Drill me with hard follow-ups on [section] as a Staff/Principal engineer would."*
- *"Suggest where in the deck I should plant explicit invitations to interact, given [audience]."*
- *"Write me a 5-minute version and a 20-minute version of this talk, with the same slide structure."*
- *"What's the single weakest claim in this document that an unfriendly interviewer would attack first?"*

---

End of portable handoff.
