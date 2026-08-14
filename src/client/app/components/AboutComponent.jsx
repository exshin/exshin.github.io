import React from 'react'

const IMG = './img/'

/* Things built, then an honest self-assessment. */
const TICKER = [
  { text: 'Designed and built integration services', badge: '0 → 1' },
  { text: 'Billing, Payments & Platform' },
  { text: 'Microservices and Domains' },
  { text: 'ETL data pipelines' },
  { text: 'Entity resolution service' },
  { text: 'Claude Code', level: 'Master', qualifier: 'aspiring' },
  { text: 'Ruby on Rails', level: 'Expert' },
  { text: 'React / JavaScript', level: 'Tinkerer' },
]

/*
 * Each row: hovering reveals a coloured card linking to the live thing,
 * clicking unfolds a summary in place. The full writeup stays on its own
 * page, because each one runs to about five screens.
 */
const WORK = [
  {
    num: '01',
    key: 'wordblok',
    title: 'WordBloks',
    tag: 'SwiftUI · On the App Store',
    peek: 'Play it',
    peekColor: '#e8a904',
    peekHref: 'https://apps.apple.com/us/app/wordbloks/id6771600251',
    external: true,
    stats: [
      ['Platform', 'iOS'],
      ['Type', 'Word Game'],
      ['Modes', '2'],
      ['Status', 'Shipped'],
    ],
    blurb: 'Drag Tetris-shaped pieces of letter tiles onto an 8×8 board. Any run of three or more that spells a real word scores, and a seven letter word is worth sixteen times a three letter one. Letters stay on the board after they score, so every placement is also a setup for the next turn.',
    shots: [
      { src: 'wordblok_thumb.png', label: 'Scoring a word' },
      { src: 'wordblok_board_empty.png', label: 'The board' },
      { src: 'wordblok_play_start.png', label: 'Specials' },
    ],
    writeup: '#playground/wordblok',
  },
  {
    num: '02',
    key: 'activity-finder',
    title: 'Activity Finder',
    tag: 'Python · React · LLM',
    peek: 'Search it',
    peekColor: '#2f6f5e',
    peekHref: 'https://activity-finder.fly.dev',
    external: true,
    stats: [
      ['Classes', '18,000+'],
      ['Sessions', '125,000+'],
      ['Cities', '25'],
      ['Status', 'Live'],
    ],
    blurb: 'Type what you want the way you would say it out loud, and a model turns it into filters you can see and pull off one at a time. When a search comes back too broad, it proposes specific ways to narrow it down and shows how many results each one would leave. It also matches your schedule against what is actually available, so you only see the classes you could really get to.',
    shots: [
      { src: 'af_thumb.png', label: 'Ask in a sentence' },
      { src: 'af_reading.png', label: 'Smart Proposals' },
      { src: 'af_week_grid.png', label: 'Match your week' },
    ],
    writeup: '#playground/activity-finder',
  },
  {
    num: '03',
    key: 'somnia',
    title: 'Somnia',
    tag: 'SwiftUI · In progress',
    peek: 'See it',
    peekColor: '#7a5cd6',
    peekHref: '#playground/somnia',
    external: false,
    stats: [
      ['Platform', 'iOS'],
      ['Type', 'Match-3 RPG Game'],
      ['Status', 'Building'],
    ],
    blurb: 'A turn-based match-3 RPG. You play a Drifter who slips into a real, layered dream world every time they sleep, and travel its six regions with a team of Reveries. Battles are tile-matching puzzles that fuel each creature’s skills.',
    shots: [
      { src: 'somnia_battle_dreamsurge.webp', label: 'Battle' },
      { src: 'somnia_map.webp', label: 'The dream map' },
      { src: 'somnia_reveries_team.webp', label: 'Your team' },
    ],
    writeup: '#playground/somnia',
  },
  {
    num: '04',
    key: 'experience',
    title: 'Experience',
    tag: 'Zendesk · Riviera Partners',
    peek: 'Read it',
    /* not the ink colour, or it vanishes against the inverted row */
    peekColor: '#d94f04',
    peekHref: '#experience',
    external: false,
    stats: [
      ['Years shipping', '10'],
      ['At Zendesk', '9'],
      ['Specialty', 'Backend'],
    ],
    blurb: 'Recruiter, then data analyst, then engineer. Nine years at Zendesk across billing, payments and platform integrations, and seven at Riviera Partners before that. The order path I architected creates orders in under five seconds at over a thousand a minute.',
    shots: [],
    writeup: '#experience',
  },
]

/* No Fragment on React 15, so the pieces go in as a keyed array. */
function Tick({ item }) {
  const bits = [
    <span className="poster-tick-name" key="n">{item.text}</span>,
  ]
  if (item.level) {
    bits.push(<span className="poster-tick-level" key="l">{item.level}</span>)
  }
  if (item.qualifier) {
    bits.push(<span className="poster-tick-qual" key="q">({item.qualifier})</span>)
  }
  if (item.badge) {
    bits.push(<span className="poster-tick-badge" key="b">{item.badge}</span>)
  }
  return <span className="poster-tick">{bits}</span>
}

function Ticker() {
  const run = key => TICKER.map((item, i) => <Tick item={item} key={key + i} />)
  return (
    <div className="poster-marquee">
      <div className="poster-marquee-inner">
        {run('a')}
        {/* duplicated so the loop has no seam */}
        <span aria-hidden="true">{run('b')}</span>
      </div>
    </div>
  )
}

function Summary({ item }) {
  return (
    <div className="poster-panel-inner">
      <div className="poster-stats">
        {item.stats.map(([k, v]) => (
          <div className="poster-stat" key={k}>
            <div className="poster-stat-k">{k}</div>
            <div className="poster-stat-v">{v}</div>
          </div>
        ))}
      </div>
      <p className="poster-blurb">{item.blurb}</p>
      {item.shots.length > 0 && (
        <div className="poster-shots">
          {item.shots.map(shot => (
            <figure className="poster-shot" key={shot.src}>
              <img src={IMG + shot.src} alt={shot.label} loading="lazy" />
              <figcaption>{shot.label}</figcaption>
            </figure>
          ))}
        </div>
      )}
      <a className="poster-deeper" href={item.writeup}>
        Full writeup <span aria-hidden="true">&rarr;</span>
      </a>
    </div>
  )
}

class AboutComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = { open: null }
    this.toggle = this.toggle.bind(this)
  }

  toggle(key) {
    this.setState({ open: this.state.open === key ? null : key })
  }

  render() {
    const { open } = this.state

    return (
      <div className="poster">
        <div className="poster-top">
          <h1 className="poster-name">
            Eugene
            <em>Chinveeraphan</em>
          </h1>
          <div className="poster-meta">
            <span>Product Driven Software Engineer</span>
            <span>San Francisco</span>
          </div>
        </div>

        <Ticker />

        <div className="poster-band">
          <img
            src={IMG + 'hike_sunrise_dust.jpg'}
            className="poster-band-img"
            alt="Fog rolling over the Bay Area hills at sunrise"
            width="1600"
            height="560"
          />
        </div>

        <div className="poster-intro">
          <p>
            I work on the systems that move money. For the last nine years that has been
            Zendesk, across billing, payments and platform integrations. On my own time I build
            things end to end, which is where I get to do the parts a large company splits
            across four teams.
          </p>
        </div>

        <div className="poster-rows">
          {WORK.map(item => {
            const isOpen = open === item.key
            return (
              <div
                className={'poster-row-wrap' + (isOpen ? ' is-open' : '')}
                key={item.key}
                style={{ '--peek': item.peekColor }}
              >
                {/* The peek is positioned against this, not the whole wrap, so
                    it stays put when the summary unfolds below. */}
                <div className="poster-row-head">
                <button
                  type="button"
                  className="poster-row"
                  aria-expanded={isOpen}
                  aria-controls={`panel-${item.key}`}
                  onClick={() => this.toggle(item.key)}
                >
                  <span className="poster-row-num">{item.num}</span>
                  <span className="poster-row-title">{item.title}</span>
                  <span className="poster-row-tag">{item.tag}</span>
                  <span className="poster-row-chevron" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="15" height="15">
                      <path
                        d="M3.5 6 8 10.5 12.5 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>

                {/* Sibling rather than a child, so it is a real link and not
                    an anchor nested inside a button. */}
                <a
                  className="poster-row-peek"
                  href={item.peekHref}
                  target={item.external ? '_blank' : null}
                  rel={item.external ? 'noopener noreferrer' : null}
                >
                  {item.peek}
                  <span aria-hidden="true" className="poster-peek-arrow">
                    {item.external ? '↗' : '→'}
                  </span>
                </a>
                </div>

                <div
                  className={'poster-panel' + (isOpen ? ' open' : '')}
                  id={`panel-${item.key}`}
                  hidden={!isOpen}
                >
                  <Summary item={item} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default AboutComponent
