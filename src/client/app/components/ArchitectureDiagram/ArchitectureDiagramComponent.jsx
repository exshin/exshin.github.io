import React from 'react'

const NOTES = {
  crm_cpq: {
    title: 'CRM / CPQ',
    body: "The upstream sales-tooling system where reps configure and submit customer orders. Sends order intent to the billing service over HTTP with an idempotency key (the CPQ-generated subscription ID). External to the system being designed; the API contract with this team was negotiated up front."
  },
  billing_service: {
    title: 'Billing service',
    body: "A Ruby monolith that exposes the REST API endpoint for order submission and also hosts the worker code and the callback handler. On submit, it persists the order intent to the customer_orders table (or returns the prior result if the idempotency key is a duplicate), enqueues a job to SQS FIFO, and returns a 200 to the CRM. The callback handler receives async notifications from the billing platform on subscription changes and updates the account and entitlements service."
  },
  customer_orders: {
    title: 'customer_orders MySQL',
    body: "A MySQL table in the existing billing monolith database. Owns three things: idempotency state (unique index on the CPQ subscription ID — last line of defense beyond the worker-level check and the FIFO 5-minute dedup window), status visibility (every order's current state queryable for upstream tooling and on-call), and audit trail (every order intent received, including ones that never made it to the billing platform). Picked MySQL because the billing monolith already used it — adding a new datastore would have been over-engineering at this scale."
  },
  sqs_fifo: {
    title: 'SQS FIFO queue',
    body: "AWS SQS in FIFO mode. MessageGroupId is the order id, so concurrent events for the same order serialize while different orders run in parallel. This eliminates the double-processing race per order without requiring explicit row-level locking. FIFO's content-based dedup (5-minute window) provides defense-in-depth alongside the database unique constraint. Throughput ceiling (300 msg/sec base, 3,000 with high-throughput mode) was never a concern at the scale of this workload."
  },
  dlq: {
    title: 'Dead-letter queue',
    body: "Standard SQS DLQ pattern. Messages route here after the max retry count is exceeded, or immediately for terminal errors (malformed payloads, billing-platform 4xx). DLQ depth is alerted in monitoring. Recovery is a manual replay tool; runbook documented for on-call. The deliberate distinction between retryable and terminal failures matters: it prevents retry budget from being burned on errors that will never succeed."
  },
  workers: {
    title: 'Async workers',
    body: "Background job consumers running in the same Ruby monolith. Each worker pulls a message, reads the order from MySQL, calls the external billing platform synchronously, and updates the order's status in MySQL based on the result. Worker concurrency is sized to keep queue depth near zero in steady state and to honor end-to-end latency targets."
  },
  billing_platform: {
    title: 'Subscription billing platform',
    body: "External third-party platform that is the source of truth for subscription state and payment data. Synchronous HTTP API. Latency typically a few hundred milliseconds in our region; degrades for sales reps far from the platform's data center, but the geographic latency is in the network path, not the platform itself. PCI scope sits with the platform — the system never handles raw card data, only references."
  },
  account_entitlements: {
    title: 'Account & entitlements',
    body: "Internal service that other product surfaces query to determine whether a customer has access to a given feature. Updated by the billing service's callback handler when the subscription billing platform fires an async callback after a successful subscription change. This closes the loop: the rep clicks submit, and within the SLO budget, the customer's product access is provisioned."
  }
}

const SLIDES = [
  {
    id: 'architecture',
    title: 'Architecture Overview',
    type: 'diagram'
  },
  {
    id: 'sync-async',
    title: 'Decision 1 — Sync vs Async',
    type: 'decision',
    considered: [
      'Pure synchronous — CRM → API → billing platform → response in one hop',
      'Pure async with state machine',
      'Hybrid — sync happy path, async fallback'
    ],
    picked: 'Pure async with state machine',
    why: [
      'External billing platform was a flaky synchronous dependency. Propagating its outages to reps at submit time as timeouts and ambiguous errors was not acceptable.',
      'Order intent had to be durable from the moment of submit. Sync would lose orders if the platform was down.',
      'Retries become a system property (worker retries from queue), not a session property (rep retries in browser). Cleaner mental model, fewer edge cases.'
    ],
    cost: [
      "Reps don't see immediate provisioning confirmation — they click submit, get a 200, and trust the system.",
      'Failure visibility moves to dashboards and downstream signals. Traded immediacy for resilience.'
    ],
    note: "Why not hybrid: two code paths, two failure modes, and the async path needs to exist anyway for retries. YAGNI on the hybrid until there's evidence the simpler design is failing."
  },
  {
    id: 'sqs-kafka',
    title: 'Decision 2 — Queue Selection',
    type: 'decision',
    considered: [
      'AWS SQS',
      'Kafka',
      'Kinesis',
      'EventBridge',
      'DB-backed queue (Sidekiq/Redis or polling table)'
    ],
    picked: 'AWS SQS',
    why: [
      "Scale didn't justify Kafka. Throughput target was modest; Kafka's ceiling advantages would be wasted while the operational cost would be paid regardless.",
      'FIFO and dedup are native to SQS. Kafka would have required building per-key serialization in application code.',
      "Internal infrastructure org had stronger SQS support and tooling. Building with SQS was meaningfully more efficient given the team and platform context.",
      "Smaller blast radius — SQS is fully managed. Kafka adds dependency on the internal platform team's cluster, partitioning, and rebalancing decisions."
    ],
    cost: [
      "No replay capability. If a bug surfaces later, reprocessing would require a separate code path reading from the MySQL audit log. A Kafka shop would have replay for free."
    ],
    note: null
  },
  {
    id: 'fifo-standard',
    title: 'Decision 3 — FIFO vs Standard SQS',
    type: 'decision',
    considered: [
      'SQS FIFO',
      'SQS Standard'
    ],
    picked: 'SQS FIFO',
    why: [
      'Per-order serialization via MessageGroupId = order_id prevents concurrent processing of two events for the same order. The double-processing race is solved at the queue layer, not in application code.',
      '5-minute content-based dedup catches rapid upstream retries before they hit the worker. Defense-in-depth alongside the MySQL unique constraint.',
      'Throughput ceiling (300 msg/sec base, 3,000 with high-throughput mode) was vastly above actual scale.'
    ],
    cost: [
      'Harder operationally if the system ever needed to fan out to multiple consumers or replay.',
      'Throughput ceiling, while not hit, is real — at 10x scale the choice would warrant revisiting.'
    ],
    note: 'Important distinction: FIFO provides exactly-once delivery within the dedup window, not exactly-once processing. The worker itself still has to be idempotent via the MySQL unique constraint and the upstream-supplied idempotency key.'
  },
  {
    id: 'mysql',
    title: 'Decision 4 — State Database',
    type: 'decision',
    considered: [
      'Existing MySQL in the billing monolith',
      'Dedicated separate MySQL instance',
      'DynamoDB',
      'Redis',
      'No state DB at all'
    ],
    picked: 'Existing MySQL in the billing monolith',
    why: [
      'No new datastore to operate, secure, back up, or monitor. The monolith already used MySQL.',
      'Workload fits comfortably — point lookups by idempotency key plus small range queries by customer. ~500K rows/year worst case. MySQL is overprovisioned for this.',
      'Transactional integration with related billing data when needed.',
      'Team familiarity. Nobody had to learn anything new.'
    ],
    cost: [
      "Coupled to the monolith's database lifecycle. Schema migrations coordinate with billing's release process.",
      'A billing DB outage is a service outage. At higher scale or stronger isolation requirements, separation would be warranted.'
    ],
    note: "Why not DynamoDB: adds a datastore to operate, no SQL for ad-hoc queries, no transactions with billing data, no real benefit at this scale. Why not no DB: a durable record of every order intent is required — SQS is transient and idempotency, status, and audit have no good alternative home."
  },
  {
    id: 'idempotency',
    title: 'Idempotency End-to-End',
    type: 'sections',
    sections: [
      {
        label: 'The key',
        items: [
          'A UUID generated by the CRM (the CPQ subscription ID), supplied on every submit.',
          'Contract with the CRM team: retries reuse the original UUID. Documented and tested.'
        ]
      },
      {
        label: 'Where it\'s checked — 3 layers',
        items: [
          'Worker reads the order from MySQL by the key. If status is already terminal (succeeded or failed), returns the prior result without re-processing.',
          'Database unique index on the key is the last line of defense — even under a race, the second insert fails.',
          'The same key is passed through to the external billing platform as its idempotency key, so retries on that side also collapse to the same operation.'
        ]
      },
      {
        label: 'Same key, different payload',
        items: [
          'Treated as the same logical operation — returns the original result and logs the divergence as a data integrity signal.',
          'Matches standard idempotency semantics (Stripe and others handle it the same way).'
        ]
      },
      {
        label: 'Amendments',
        items: [
          'A legitimate amendment to an existing subscription is a different operation with a different key.',
          'The CRM generates a new amendment record referencing the original subscription. Keys are never reused.'
        ]
      },
      {
        label: 'Why upstream-supplied',
        items: [
          'If the worker generated the key on receipt, every retry from the CRM would look like a new order.',
          'The key has to be stable across the entire end-to-end retry path.'
        ]
      }
    ]
  },
  {
    id: 'failures',
    title: 'Failure Modes',
    type: 'sections',
    sections: [
      {
        label: 'Worker crashes mid-processing',
        items: [
          'SQS visibility timeout returns the message to the queue — another worker picks it up.',
          'The dangerous case: billing platform succeeded, worker died before writing back to MySQL.',
          'On retry: idempotency key prevents double-creation; worker re-reads platform state to reconcile MySQL. Worth dwelling on — signals the system has been run in production.'
        ]
      },
      {
        label: 'Billing platform 5xx',
        items: [
          'Retryable — message stays in queue, visibility timeout redelivers, worker increments attempt count.'
        ]
      },
      {
        label: 'Billing platform 4xx',
        items: [
          'Terminal — it will not succeed on retry.',
          'Message goes directly to DLQ for manual triage.',
          'This separation matters: without it, retry budget gets burned on errors that will never succeed.'
        ]
      },
      {
        label: 'Billing platform timeout',
        items: [
          'Treated as retryable, but the worker must re-read platform state on the next attempt to handle the case where the timeout masked a successful operation.'
        ]
      },
      {
        label: 'Billing platform down for an hour',
        items: [
          'Backpressure on SQS — visibility timeouts cause redelivery, orders pile up.',
          'SQS scales fine: 1,000/min for an hour = 60K messages, trivial.',
          'Monitoring alerts on sustained queue depth and DLQ depth.',
          'Distinguishing "platform is down" vs. "we have a bug" via external health checks and dominant error code in worker logs.'
        ]
      },
      {
        label: 'MySQL down',
        items: [
          'The billing service itself is down — the API returns 503.',
          "Fails closed: CRM sees errors at submit time. Acceptable — database availability is part of the platform's overall SLA."
        ]
      }
    ]
  },
  {
    id: 'cross-functional',
    title: 'Cross-Functional Considerations',
    type: 'sections',
    sections: [
      {
        label: 'Performance',
        items: [
          'End-to-end P95 measured post-launch. SLOs defined against actual measurements, not aspirational targets.',
          'Latency budget: queue hop single-digit ms, worker-to-platform sync call a few hundred ms, callback path another few hundred ms — well under the 5s target on the happy path.',
          'At 1,000/min with 5s end-to-end, ~83 orders in flight at any time. Worker concurrency floor sized accordingly with headroom.'
        ]
      },
      {
        label: 'Security',
        items: [
          'Service-to-service authentication (CRM → billing API, billing service → billing platform) via service tokens or mTLS.',
          'Secrets management for billing platform credentials via secrets manager — not hardcoded or in environment variables.',
          'Encryption at rest (MySQL) and in transit (HTTPS everywhere).',
          'PII handling: customer identifiers logged; raw order payload fields scrubbed at the log boundary.',
          'DLQ contents reviewed by humans during recovery — access controlled to on-call engineers.',
          'PCI scope sits entirely with the external billing platform. The system never handles raw card data, only references.'
        ]
      },
      {
        label: 'Usability — rep-facing',
        items: [
          "Reps submit and get a 200 immediately. No immediate provisioning confirmation — that's the async trade-off.",
          'Failed orders surfaced via dashboards and DLQ depth alerts to support and customer success.',
          'Rollout via feature flag with phased customer rollout. Previous code path stayed in place as fallback during initial rollout.'
        ]
      },
      {
        label: 'The headline trade-off',
        items: [
          'Immediacy vs. resilience. Sync gives reps instant confirmation but propagates every billing-platform hiccup.',
          'Async absorbs hiccups but defers confirmation. The system optimizes for correctness; latency is an SLO that holds in steady state, not a hard contract.'
        ]
      }
    ]
  },
  {
    id: 'reflection',
    title: 'Execution & Reflection',
    type: 'sections',
    sections: [
      {
        label: 'What went well',
        items: [
          'Architectural review with the lead group architect before implementation — caught issues early and built buy-in.',
          'Idempotency designed in from day one rather than retrofitted — the cost of adding it later would have been high.',
          'Instrumentation added at every hop, enabling real SLO definition post-launch rather than claiming aspirational targets.',
          'Clean scope shipped in 2–3 months with a 3-person team.'
        ]
      },
      {
        label: "What I'd do differently",
        items: [
          'Active reconciliation between the system DB and the external billing platform — currently divergences are caught manually. A periodic reconciliation job would catch drift earlier.',
          'Archival and retention policy for the customer_orders table — accumulates indefinitely in the current design.',
          'More explicit error classification at the boundary: structured error codes from the billing platform mapped to internal retryable/terminal categories at one place, not scattered across workers.'
        ]
      },
      {
        label: 'Process and org changes',
        items: [
          "Contract with the CRM team for stable idempotency keys had to be negotiated and documented — not just a code change, but an API contract between teams.",
          "On-call ownership: runbook for DLQ recovery, escalation paths for billing-platform outages, alert tuning to distinguish system bugs from platform outages.",
          "Deployment coordination with the billing monolith's release process — schema migrations required coordination with the broader billing team."
        ]
      },
      {
        label: 'My role',
        items: [
          'Tech lead, IC, and de facto project manager on a 3-person team.',
          'Owned the design doc and architecture flow charts.',
          'Sought review from the lead group architect. Drove stakeholder approval across engineering, product, and security.'
        ]
      }
    ]
  },
  {
    id: 'thanks',
    title: 'Thank You',
    type: 'thanks'
  }
]

class ArchitectureDiagramComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      authenticated: false,
      passwordInput: '',
      passwordError: false,
      selectedComponent: null,
      currentSlide: 0
    }
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this)
    this.handleComponentClick = this.handleComponentClick.bind(this)
    this.handleComponentKeyDown = this.handleComponentKeyDown.bind(this)
    this.handlePrevSlide = this.handlePrevSlide.bind(this)
    this.handleNextSlide = this.handleNextSlide.bind(this)
    this.handleGotoSlide = this.handleGotoSlide.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown(e) {
    if (!this.state.authenticated) return
    if (e.target.tagName === 'INPUT') return
    if (e.key === 'ArrowLeft') { e.preventDefault(); this.handlePrevSlide() }
    else if (e.key === 'ArrowRight') { e.preventDefault(); this.handleNextSlide() }
  }

  handlePrevSlide() {
    this.setState(s => ({ currentSlide: (s.currentSlide - 1 + SLIDES.length) % SLIDES.length }))
  }

  handleNextSlide() {
    this.setState(s => ({ currentSlide: (s.currentSlide + 1) % SLIDES.length }))
  }

  handleGotoSlide(index) {
    this.setState({ currentSlide: index })
  }

  handlePasswordChange(e) {
    this.setState({ passwordInput: e.target.value, passwordError: false })
  }

  handlePasswordSubmit(e) {
    e.preventDefault()
    if (this.state.passwordInput === '9999') {
      this.setState({ authenticated: true })
    } else {
      this.setState({ passwordError: true, passwordInput: '' })
    }
  }

  handleComponentClick(id) {
    this.setState({ selectedComponent: id })
  }

  handleComponentKeyDown(id, e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      this.setState({ selectedComponent: id })
    }
  }

  renderPasswordGate() {
    const { passwordInput, passwordError } = this.state
    return (
      <div className="arch-password-gate">
        <h3 className="arch-password-heading">System Design</h3>
        <p className="arch-password-prompt">Enter password to continue.</p>
        <form onSubmit={this.handlePasswordSubmit} className="arch-password-form">
          <input
            type="password"
            value={passwordInput}
            onChange={this.handlePasswordChange}
            placeholder="Password"
            className="form-control arch-password-input"
            autoFocus
          />
          <button type="submit" className="btn btn-primary">View</button>
        </form>
        {passwordError && <p className="arch-password-error">Incorrect password.</p>}
      </div>
    )
  }

  renderSlideNav() {
    const { currentSlide } = this.state
    return (
      <div className="arch-slide-nav" role="tablist" aria-label="Slide navigation">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            role="tab"
            aria-selected={currentSlide === i}
            aria-label={`Slide ${i + 1}: ${slide.title}`}
            title={slide.title}
            className={`arch-slide-pill${currentSlide === i ? ' arch-slide-pill--active' : ''}`}
            onClick={() => this.handleGotoSlide(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    )
  }

  renderDiagramSlide() {
    const { selectedComponent } = this.state
    const note = selectedComponent ? NOTES[selectedComponent] : null

    const gProps = (id, variant) => ({
      onClick: () => this.handleComponentClick(id),
      onKeyDown: (e) => this.handleComponentKeyDown(id, e),
      tabIndex: 0,
      role: 'button',
      'aria-pressed': selectedComponent === id,
      'aria-label': NOTES[id].title,
      className: `arch-g arch-${variant}${selectedComponent === id ? ' arch-g--selected' : ''}`
    })

    return (
      <div className="row arch-layout">
        <div className="col-md-7">
          <p className="arch-diagram-hint">Click any component to see design notes.</p>
          <svg width="100%" viewBox="0 0 680 620" xmlns="http://www.w3.org/2000/svg" className="arch-svg">
            <title>Order processing integration service architecture</title>
            <desc>Order requests from a CRM/CPQ system flow through a Ruby billing service into a FIFO queue, are consumed by async workers, and processed against an external subscription billing platform. State is persisted in a MySQL store; failed messages divert to a dead-letter queue; and an asynchronous callback updates the account and entitlements service.</desc>
            <defs>
              <marker id="arch-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M2 1L8 5L2 9" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </marker>
            </defs>

            <g {...gProps('crm_cpq', 'component-external')}>
              <rect x="80" y="30" width="320" height="56" rx="8"/>
              <text x="240" y="50" textAnchor="middle" dominantBaseline="central" className="arch-text-title">CRM / CPQ</text>
              <text x="240" y="68" textAnchor="middle" dominantBaseline="central" className="arch-text-sub">Sales rep submits order</text>
            </g>

            <g {...gProps('billing_service', 'component-internal')}>
              <rect x="80" y="130" width="320" height="56" rx="8"/>
              <text x="240" y="150" textAnchor="middle" dominantBaseline="central" className="arch-text-title">Billing service</text>
              <text x="240" y="168" textAnchor="middle" dominantBaseline="central" className="arch-text-sub">Ruby monolith, REST API</text>
            </g>

            <g {...gProps('customer_orders', 'component-datastore')}>
              <rect x="440" y="130" width="200" height="56" rx="8"/>
              <text x="540" y="150" textAnchor="middle" dominantBaseline="central" className="arch-text-title">customer_orders</text>
              <text x="540" y="168" textAnchor="middle" dominantBaseline="central" className="arch-text-sub">Idempotency · status</text>
            </g>

            <g {...gProps('sqs_fifo', 'component-internal')}>
              <rect x="80" y="230" width="320" height="56" rx="8"/>
              <text x="240" y="250" textAnchor="middle" dominantBaseline="central" className="arch-text-title">SQS FIFO queue</text>
              <text x="240" y="268" textAnchor="middle" dominantBaseline="central" className="arch-text-sub">MessageGroupId = order id</text>
            </g>

            <g {...gProps('dlq', 'component-warning')}>
              <rect x="440" y="230" width="200" height="56" rx="8"/>
              <text x="540" y="250" textAnchor="middle" dominantBaseline="central" className="arch-text-title">Dead-letter queue</text>
              <text x="540" y="268" textAnchor="middle" dominantBaseline="central" className="arch-text-sub">After max retries</text>
            </g>

            <g {...gProps('workers', 'component-internal')}>
              <rect x="80" y="330" width="320" height="56" rx="8"/>
              <text x="240" y="350" textAnchor="middle" dominantBaseline="central" className="arch-text-title">Async workers</text>
              <text x="240" y="368" textAnchor="middle" dominantBaseline="central" className="arch-text-sub">Background job consumers</text>
            </g>

            <g {...gProps('billing_platform', 'component-external')}>
              <rect x="80" y="430" width="320" height="56" rx="8"/>
              <text x="240" y="450" textAnchor="middle" dominantBaseline="central" className="arch-text-title">Subscription billing platform</text>
              <text x="240" y="468" textAnchor="middle" dominantBaseline="central" className="arch-text-sub">External, synchronous HTTP</text>
            </g>

            <g {...gProps('account_entitlements', 'component-external')}>
              <rect x="80" y="530" width="320" height="56" rx="8"/>
              <text x="240" y="550" textAnchor="middle" dominantBaseline="central" className="arch-text-title">Account &amp; entitlements</text>
              <text x="240" y="568" textAnchor="middle" dominantBaseline="central" className="arch-text-sub">Provisions customer access</text>
            </g>

            <line x1="240" y1="86" x2="240" y2="130" className="arch-arrow" markerEnd="url(#arch-arrow)"/>
            <line x1="400" y1="158" x2="440" y2="158" className="arch-arrow" markerEnd="url(#arch-arrow)"/>
            <line x1="240" y1="186" x2="240" y2="230" className="arch-arrow" markerEnd="url(#arch-arrow)"/>
            <line x1="400" y1="258" x2="440" y2="258" className="arch-arrow" markerEnd="url(#arch-arrow)"/>
            <line x1="240" y1="286" x2="240" y2="330" className="arch-arrow" markerEnd="url(#arch-arrow)"/>
            <path d="M400 358 L420 358 L420 208 L540 208 L540 186" fill="none" className="arch-arrow" markerEnd="url(#arch-arrow)"/>
            <line x1="240" y1="386" x2="240" y2="430" className="arch-arrow" markerEnd="url(#arch-arrow)"/>
            <line x1="240" y1="486" x2="240" y2="530" className="arch-arrow arch-arrow--dashed" markerEnd="url(#arch-arrow)"/>
            <text x="270" y="510" textAnchor="start" dominantBaseline="central" className="arch-annotation">async callback</text>
          </svg>
        </div>
        <div className="col-md-5">
          <div className={`arch-note-panel${note ? ' arch-note-panel--active' : ''}`} role="region" aria-live="polite" aria-label="Component notes">
            {note ? (
              <div>
                <h5 className="arch-note-title">{note.title}</h5>
                <p className="arch-note-body">{note.body}</p>
              </div>
            ) : (
              <p className="arch-note-empty">Click any component to see design notes.</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  renderDecisionSlide(slide) {
    return (
      <div className="arch-decision">
        <div className="row">
          <div className="col-md-7">
            <div className="arch-decision-block arch-decision-block--considered">
              <div className="arch-decision-label">Considered</div>
              <ul className="arch-decision-list">
                {slide.considered.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
          <div className="col-md-5">
            <div className="arch-decision-block arch-decision-block--picked">
              <div className="arch-decision-label">Picked</div>
              <p className="arch-decision-picked-text">{slide.picked}</p>
            </div>
          </div>
        </div>
        <div className="row arch-decision-row2">
          <div className="col-md-7">
            <div className="arch-decision-block arch-decision-block--why">
              <div className="arch-decision-label">Why it won</div>
              <ul className="arch-decision-list">
                {slide.why.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
          <div className="col-md-5">
            <div className="arch-decision-block arch-decision-block--cost">
              <div className="arch-decision-label">What it cost</div>
              <ul className="arch-decision-list">
                {slide.cost.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
        {slide.note && (
          <div className="arch-decision-note">
            <span className="arch-decision-note-label">Note: </span>
            {slide.note}
          </div>
        )}
      </div>
    )
  }

  renderSectionsSlide(slide) {
    const twoCol = slide.sections.length >= 4
    if (twoCol) {
      return (
        <div className="row arch-sections-grid">
          {slide.sections.map((section, i) => (
            <div key={i} className="col-md-6 arch-section-col">
              <div className="arch-section">
                <div className="arch-section-label">{section.label}</div>
                <ul className="arch-section-list">
                  {section.items.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )
    }
    return (
      <div className="arch-sections">
        {slide.sections.map((section, i) => (
          <div key={i} className="arch-section">
            <div className="arch-section-label">{section.label}</div>
            <ul className="arch-section-list">
              {section.items.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    )
  }

  renderThanksSlide() {
    return (
      <div className="arch-thanks">
        <h2 className="arch-thanks-headline">Thanks for your time!</h2>
        <p className="arch-thanks-question">Questions?</p>
      </div>
    )
  }

  renderSlideContent() {
    const slide = SLIDES[this.state.currentSlide]
    if (slide.type === 'diagram') return this.renderDiagramSlide()
    if (slide.type === 'decision') return this.renderDecisionSlide(slide)
    if (slide.type === 'sections') return this.renderSectionsSlide(slide)
    if (slide.type === 'thanks') return this.renderThanksSlide()
    return null
  }

  renderSlide() {
    const { currentSlide } = this.state
    const slide = SLIDES[currentSlide]
    return (
      <div className="arch-wrapper">
        {this.renderSlideNav()}
        <div className="arch-slide-header">
          <h3 className="arch-slide-title">{slide.title}</h3>
          <span className="arch-slide-counter">{currentSlide + 1} / {SLIDES.length}</span>
        </div>
        <div className="arch-slide-body">
          {this.renderSlideContent()}
        </div>
        <div className="arch-slide-footer">
          <button className="btn btn-outline-secondary arch-nav-btn" onClick={this.handlePrevSlide}>
            ← Prev
          </button>
          <span className="arch-nav-hint">← → to navigate</span>
          <button className="btn btn-outline-secondary arch-nav-btn" onClick={this.handleNextSlide}>
            Next →
          </button>
        </div>
      </div>
    )
  }

  render() {
    return this.state.authenticated ? this.renderSlide() : this.renderPasswordGate()
  }
}

export default ArchitectureDiagramComponent
