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
    title: 'The model only returns values.',
    blurb:
      'It hands back plain numbers and strings, like age 7 or a $200 ceiling, and my code builds the query from those. Keeping that split is what lets a hand-written parser and a model sit behind the same endpoint. Both have to end up at the same query, or the same question gets two different answers depending on who read it.',
  },
  {
    key: 'geo',
    area: 'Geocoding',
    title: 'A Hayward zip code resolved to Bavaria.',
    blurb:
      'The geocoder handed back a German town for 94544 and cached it. Status 200, nothing logged, no error anywhere. What I got instead was testers telling me they typed their zip in and nothing came back. There is a bounding box check now that throws out any coordinate outside the Bay Area before it can be stored.',
  },
  {
    key: 'absence',
    area: 'Ingestion',
    title: 'Every data bug so far reported zero errors.',
    blurb:
      'Nothing was ever malformed. A field would just be missing, or sitting under a key I was not reading. So the health checks look at coverage ratios and value distributions instead of counting failures. An error count will tell you the crawl went fine while a third of the catalogue is missing.',
  },
  {
    key: 'tests',
    area: 'Testing',
    title: 'A green suite said nothing about the model.',
    blurb:
      'Every model call in the tests is injected, so the suite runs offline and passing proves nothing about the features that make real calls. Five bugs turned up only by opening the app. One was an endpoint returning 200 with an empty body, because the model it wanted was never registered.',
  },
]

const DISCLOSURES = [
  {
    key: 'assumed',
    label: 'Assumed',
    blurb: 'The model inferred this. You did not type it.',
    color: '#e8834a',
  },
  {
    key: 'empty',
    label: 'Emptied by',
    blurb: 'When nothing comes back, it names the filter responsible.',
    color: '#2f6f5e',
  },
  {
    key: 'unpublished',
    label: 'Unpublished',
    blurb: 'A provider that never listed a price says so instead of showing a zero.',
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
        <div className="af-hero-quote">Find a class that fits your week.</div>
        <div className="af-hero-sub">
          Classes, camps and clubs from 25 Bay Area cities, searched by age, price, and
          the hours you have free.
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
          feeds <em>query</em>. English goes in, filter values come out. It never sees SQL.
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
        <h4 className="af-section-title">Four things I got wrong first.</h4>
        <div className="af-section-divider" />
        <p className="af-section-body">
          Python for the crawl and the API, React on the front, SQLite for the catalogue.
          The stack is boring. What took longer to learn was a handful of rules that came
          out of bugs I <em>shipped</em>, where nothing threw an error and the answer was
          still wrong.
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
          eyebrow="Search"
          title="Type the whole sentence."
          layout="stack"
          accent="#2f6f5e"
          onOpen={this.openLightbox}
          images={[
            {
              src: 'af_reading.png',
              alt: 'The query "swimming for my 7 year old after school under $200" broken into removable filter chips, with the after-school reading badged as assumed',
              caption: 'Each filter is a chip you can remove',
            },
          ]}
          extras={<DisclosureLegend />}
        >
          You type <em>&ldquo;swimming for my 7 year old after school under $200&rdquo;</em>{' '}
          and a model turns that into filters. Each one shows up as a chip you can pull off.
          If the model filled in something you never said, the chip gets marked as assumed
          and the app tells you what the guess cost you. Reading &ldquo;after school&rdquo; as
          weekdays 3:30 to 7pm dropped 651 results, so it offers to put them back.
        </ActivityFinderSection>

        <ActivityFinderSection
          eyebrow="Availability"
          title="Paint in the hours you're free."
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
          Most of the decision comes down to which afternoons are open, and none of the
          providers let you search on that. So you paint your week onto a grid instead of
          trying to describe it. Anything you leave blank counts as <em>unavailable</em>,
          and a course has to fit entirely inside what you painted. One meeting outside
          your hours rules the whole thing out.
        </ActivityFinderSection>

        <ActivityFinderSection
          eyebrow="Shortlist"
          title="Save five classes and you get a calendar."
          layout="stack"
          accent="#8C66D9"
          onOpen={this.openLightbox}
          images={[
            {
              src: 'af_shortlist.png',
              alt: 'Shortlist view showing total cost, hours per week, run dates, collisions, term bars and a weekly calendar',
              caption: 'Cost, hours and overlap in one view',
            },
          ]}
        >
          The shortlist adds up what everything <em>costs</em> together, how many hours a
          week it takes, and which classes land in the same slot. Terms almost never line
          up, so two classes that share a Monday might only <em>collide</em> for one week
          out of eight. The bars show you which weeks those are.
        </ActivityFinderSection>

        <ActivityFinderSection
          eyebrow="Aggregation"
          title="Registration happens somewhere else."
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
          Everything here is crawled from the parks and rec departments that run the
          classes, and every result links back to their page. The app never tells you a
          spot is <em>open</em>. That lives on the provider&rsquo;s site and goes stale the
          moment I crawl it, so I send you there rather than guess.
        </ActivityFinderSection>

        <ActivityFinderTech />

        <ActivityFinderLightbox image={lightbox} onClose={this.closeLightbox} />
      </div>
    )
  }
}

export default ActivityFinderComponent
