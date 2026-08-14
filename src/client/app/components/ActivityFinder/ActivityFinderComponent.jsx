import React from 'react'

const IMG = './img/'

const CATALOGUE = [
  { value: '20,900', label: 'Classes, camps and clubs' },
  { value: '153,726', label: 'Individual sessions' },
  { value: '1,144', label: 'Venues' },
  { value: '25', label: 'Bay Area cities' },
]

const PIPELINE = [
  { label: 'Ingest', nodes: ['adapters', 'ingest', 'store', 'activities.db'] },
  { label: 'Serve', nodes: ['activities.db', 'query', 'api', 'web'] },
]

const PRINCIPLES = [
  {
    key: 'interpret',
    area: 'Interpreter',
    title: 'The model supplies meaning, never syntax.',
    blurb:
      'The LLM returns plain values — age 7, price ceiling 200 — and our code builds the SQL. That boundary is what makes a rules-based interpreter and a model-based one interchangeable: both must construct the identical query, or the same question answers differently depending on who parsed it.',
  },
  {
    key: 'geo',
    area: 'Geocoding',
    title: 'A guessed coordinate is worse than none.',
    blurb:
      'ZIP 94544 once cached as Bavaria. HTTP 200, no error raised, nothing in the logs — just testers reporting "I put in my zip and got nothing." Now a bounding-box check rejects any coordinate outside the Bay Area before it can be stored.',
  },
  {
    key: 'absence',
    area: 'Ingestion',
    title: 'Absence is legal, so correctness is a distribution.',
    blurb:
      'Every data defect this project has found reported zero errors. Nothing was ever malformed — a field was simply missing, or lived somewhere else. So health is measured as ratios, vocabularies and coverage percentages; an error count will happily tell you everything is fine while a third of the catalogue is gone.',
  },
  {
    key: 'tests',
    area: 'Testing',
    title: 'A green suite proves nothing about a model-backed feature.',
    blurb:
      'The test suite is offline by construction — every model call is injected — so passing says nothing about whether the real thing works. Five defects were caught only by starting the app, including an endpoint answering 200 with an empty body because its model was never registered.',
  },
]

const DISCLOSURES = [
  {
    key: 'assumed',
    label: 'Assumed',
    blurb: 'An inference the model made is chipped and badged, never folded in silently.',
    color: '#e8834a',
  },
  {
    key: 'empty',
    label: 'Emptied by',
    blurb: 'A search that finds nothing names the constraint that emptied it.',
    color: '#2f6f5e',
  },
  {
    key: 'unpublished',
    label: 'Unpublished',
    blurb: 'What a provider never published shows as unpublished — not as zero.',
    color: '#7a7a7a',
  },
]

function CatalogueStats() {
  return (
    <div className="af-stats" aria-label="Catalogue size">
      {CATALOGUE.map(s => (
        <div key={s.label} className="af-stat">
          <div className="af-stat-value">{s.value}</div>
          <div className="af-stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  )
}

function DisclosureLegend() {
  return (
    <div className="af-legend" aria-label="How uncertainty is shown">
      {DISCLOSURES.map(d => (
        <div key={d.key} className="af-legend-item">
          <span className="af-legend-chip" style={{ '--chip-color': d.color }}>
            {d.label}
          </span>
          <span className="af-legend-blurb">{d.blurb}</span>
        </div>
      ))}
    </div>
  )
}

function ActivityFinderHero({ onOpen }) {
  const full = IMG + 'af_hero.png'
  return (
    <div className="af-hero">
      <div className="af-hero-copy">
        <div className="af-hero-quote">Say it the way you&rsquo;d say it out loud.</div>
        <div className="af-hero-sub">
          Classes, camps and clubs across 25 Bay Area cities &mdash; searched by the week
          you actually have.
        </div>
      </div>
      <button
        type="button"
        className="af-hero-trigger"
        onClick={() => onOpen(full, 'Activity Finder landing page')}
        aria-label="Enlarge the landing page screenshot"
      >
        <img
          className="af-hero-img"
          src={IMG + 'af_thumb.png'}
          alt="Activity Finder landing page with a single search box"
          loading="lazy"
        />
      </button>
    </div>
  )
}

function ActivityFinderShot({ src, alt, caption, onOpen }) {
  return (
    <button
      type="button"
      className="af-shot"
      onClick={() => onOpen(src, alt)}
      aria-label={alt ? `Enlarge: ${alt}` : 'Enlarge screenshot'}
    >
      <img src={src} alt={alt || ''} loading="lazy" />
      {caption && <div className="af-shot-caption">{caption}</div>}
    </button>
  )
}

function ActivityFinderSection({ eyebrow, title, children, images, layout, accent, extras, onOpen }) {
  const imageEls = (images || []).map((img, idx) => (
    <ActivityFinderShot
      key={idx}
      src={IMG + img.src}
      alt={img.alt}
      caption={img.caption}
      onOpen={onOpen}
    />
  ))

  const style = accent ? { '--section-accent': accent } : undefined

  return (
    <section className={`af-section af-section--${layout}`} style={style}>
      <div className="af-section-text">
        {eyebrow && <div className="af-eyebrow">{eyebrow}</div>}
        <h4 className="af-section-title">{title}</h4>
        <div className="af-section-divider" />
        <p className="af-section-body">{children}</p>
        {extras}
      </div>
      {imageEls.length > 0 && <div className="af-section-images">{imageEls}</div>}
    </section>
  )
}

function ActivityFinderPipeline() {
  return (
    <div className="af-pipeline" aria-label="Data flow, from crawl to browser">
      {PIPELINE.map(row => (
        <div key={row.label} className="af-pipeline-row">
          <span className="af-pipeline-label">{row.label}</span>
          <span className="af-pipeline-nodes">
            {/* React 15 on this site — no Fragment, so build a flat keyed array. */}
            {row.nodes.reduce((els, n, i) => {
              if (i > 0) {
                els.push(
                  <span className="af-pipeline-arrow" key={`arrow-${i}`} aria-hidden="true">
                    &rarr;
                  </span>
                )
              }
              els.push(
                <span
                  key={`node-${i}`}
                  className={
                    'af-pipeline-node' +
                    (n === 'activities.db' ? ' af-pipeline-node--store' : '')
                  }
                >
                  {n}
                </span>
              )
              return els
            }, [])}
          </span>
        </div>
      ))}
      <div className="af-pipeline-note">
        <span className="af-pipeline-node af-pipeline-node--model">interpret</span>
        <span className="af-pipeline-note-text">
          feeds <em>query</em> — English in, filter values out. It never sees SQL.
        </span>
      </div>
    </div>
  )
}

function ActivityFinderTech() {
  return (
    <section className="af-section af-section--tech" style={{ '--section-accent': '#14171F' }}>
      <div className="af-section-text">
        <div className="af-eyebrow">Under the hood</div>
        <h4 className="af-section-title">Four things that turned out to matter.</h4>
        <div className="af-section-divider" />
        <p className="af-section-body">
          A Python ingestion pipeline and FastAPI service behind a React frontend, over a
          SQLite catalogue. The interesting part isn&rsquo;t the stack &mdash; it&rsquo;s the
          rules that came out of defects that <em>shipped</em>, each one a case where
          nothing errored and the answer was still wrong.
        </p>
        <ActivityFinderPipeline />
      </div>
      <div className="af-principles">
        {PRINCIPLES.map(p => (
          <div key={p.key} className="af-principle">
            <div className="af-principle-area">{p.area}</div>
            <div className="af-principle-title">{p.title}</div>
            <div className="af-principle-blurb">{p.blurb}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ActivityFinderLightbox({ image, onClose }) {
  if (!image) return null
  return (
    <div
      className="af-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      onClick={onClose}
    >
      <button type="button" className="af-lightbox-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <img
        className="af-lightbox-img"
        src={image.src}
        alt={image.alt || ''}
        onClick={e => e.stopPropagation()}
      />
      {image.alt && (
        <div className="af-lightbox-caption" onClick={e => e.stopPropagation()}>
          {image.alt}
        </div>
      )}
    </div>
  )
}

class ActivityFinderComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = { lightbox: null }
    this.openLightbox = this.openLightbox.bind(this)
    this.closeLightbox = this.closeLightbox.bind(this)
    this.handleKey = this.handleKey.bind(this)
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKey)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKey)
    document.body.style.overflow = ''
  }

  openLightbox(src, alt) {
    this.setState({ lightbox: { src, alt } })
    document.body.style.overflow = 'hidden'
  }

  closeLightbox() {
    this.setState({ lightbox: null })
    document.body.style.overflow = ''
  }

  handleKey(e) {
    if (e.key === 'Escape' && this.state.lightbox) {
      this.closeLightbox()
    }
  }

  render() {
    const { lightbox } = this.state
    return (
      <div className="activity-finder">
        <ActivityFinderHero onOpen={this.openLightbox} />

        <ActivityFinderSection
          eyebrow="Reading the query"
          title="A sentence, not a keyword box."
          layout="stack"
          accent="#2f6f5e"
          onOpen={this.openLightbox}
          images={[
            {
              src: 'af_reading.png',
              alt: 'The query "swimming for my 7 year old after school under $200" broken into removable filter chips, with the after-school reading badged as assumed',
              caption: 'Every inference is a chip you can take off',
            },
          ]}
          extras={<DisclosureLegend />}
        >
          Type <em>&ldquo;swimming for my 7 year old after school under $200&rdquo;</em> and a
          model turns it into real filters. Every inference it makes becomes a chip you can
          remove &mdash; and anything it <em>guessed</em> rather than read is badged
          <em> assumed</em>, with the cost of that guess spelled out: turning
          &ldquo;after school&rdquo; into weekdays 3:30&ndash;7pm quietly removed 651 results,
          so the app says so and offers to put them back.
        </ActivityFinderSection>

        <ActivityFinderSection
          eyebrow="Availability"
          title="Paint the week you're actually free."
          layout="single-right"
          accent="#4a90d9"
          onOpen={this.openLightbox}
          images={[
            {
              src: 'af_week_grid.png',
              alt: 'A seven-day availability grid with weekday afternoons painted in',
              caption: 'Weekly availability grid',
            },
          ]}
        >
          &ldquo;Free Tuesday and Thursday after 3:30&rdquo; is the constraint that actually
          decides whether a family can go, and no provider&rsquo;s own search offers it. So
          you paint your week onto a grid instead of describing it. A weekday you
          didn&rsquo;t paint is treated as <em>unavailable</em>, not unconstrained &mdash; and
          because every session of a course has to fit, a single meeting outside your week
          rules the course out.
        </ActivityFinderSection>

        <ActivityFinderSection
          eyebrow="Shortlist"
          title="The shortlist is a week, not a list."
          layout="stack"
          accent="#8C66D9"
          onOpen={this.openLightbox}
          images={[
            {
              src: 'af_shortlist.png',
              alt: 'Shortlist view showing total cost, hours per week, run dates, collisions, term bars and a weekly calendar',
              caption: 'Cost, hours, overlap — before you register',
            },
          ]}
        >
          Saving five classes gives you a calendar, not a bookmark folder: what they
          <em> cost</em> together, how many hours a week they eat, when each term actually
          runs, and where two of them <em>collide</em>. Terms rarely line up, so two classes
          sharing a Monday might overlap for one week rather than eight &mdash; the bars show
          which.
        </ActivityFinderSection>

        <ActivityFinderSection
          eyebrow="Aggregation"
          title="It points back."
          layout="stack"
          accent="#e8834a"
          onOpen={this.openLightbox}
          images={[
            {
              src: 'af_points_back.png',
              alt: 'A saved class card with provider, venue, price and a Register button linking to the provider site',
              caption: 'Registration happens on the provider’s site',
            },
          ]}
          extras={<CatalogueStats />}
        >
          Everything is crawled from the parks-and-recreation departments that run it, and
          every result links back to the provider&rsquo;s own page. Nothing here claims a spot
          is <em>available</em> &mdash; availability lives on the provider&rsquo;s site and is
          stale the moment it&rsquo;s crawled, so the app says where to go rather than
          pretending to know.
        </ActivityFinderSection>

        <ActivityFinderTech />

        <ActivityFinderLightbox image={lightbox} onClose={this.closeLightbox} />
      </div>
    )
  }
}

export default ActivityFinderComponent
