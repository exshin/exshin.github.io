import React from 'react'

const IMG = './img/'

/* The numbers that do the arguing. */
const TICKER = [
  '1,000+ orders per minute',
  'Sub-5-second order creation',
  '99.9% data accuracy',
  '800ms down to 80ms',
  '20,900 classes indexed',
  '9 years at Zendesk',
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
      ['Board', '8×8'],
      ['Long word bonus', '16×'],
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
      ['Classes', '20,900'],
      ['Sessions', '153,726'],
      ['Cities', '25'],
      ['Status', 'Live'],
    ],
    blurb: 'Type what you want the way you would say it out loud, and a model turns it into filters you can see and pull off one at a time. You paint the hours you are free onto a grid, and a course only matches if every one of its sessions fits inside them.',
    shots: [
      { src: 'af_thumb.png', label: 'Ask in a sentence' },
      { src: 'af_reading.png', label: 'Every guess shown' },
      { src: 'af_week_grid.png', label: 'Your week' },
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
      ['Regions', '6'],
      ['Elements', '6'],
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
    peekColor: '#14120f',
    peekHref: '#experience',
    external: false,
    stats: [
      ['Years shipping', '16'],
      ['At Zendesk', '9'],
      ['Orders / min', '1,000+'],
    ],
    blurb: 'Recruiter, then data analyst, then engineer. Nine years at Zendesk across billing, payments and platform integrations, and seven at Riviera Partners before that. The order path I architected creates orders in under five seconds at over a thousand a minute.',
    shots: [],
    writeup: '#experience',
  },
]

function Ticker() {
  const run = key => TICKER.map((t, i) => <span key={key + i}>{t}</span>)
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
            <span>Senior Software Engineer</span>
            <span>San Francisco</span>
            <span>Payments &amp; Platform</span>
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
