import React from 'react'

const IMG = './img/'

const BONUS_SQUARES = [
  { key: '2l', label: '2L', sub: 'Double letter', color: '#3d7fa6' },
  { key: '3l', label: '3L', sub: 'Triple letter', color: '#2a8a8a' },
  { key: '2w', label: '2W', sub: 'Double word', color: '#9b3f6e' },
  { key: 'wc', label: '?',  sub: 'Wildcard',     color: '#8c66d9' },
]

function BonusLegend() {
  return (
    <div className="wordblok-legend" aria-label="Bonus square legend">
      {BONUS_SQUARES.map(b => (
        <div key={b.key} className="wordblok-legend-item">
          <span className="wordblok-legend-chip" style={{ background: b.color }}>{b.label}</span>
          <span className="wordblok-legend-label">{b.sub}</span>
        </div>
      ))}
    </div>
  )
}

function LengthMultiplierChart() {
  const rows = [
    { len: '3', mult: '1×',  base: 'base', filled: 1 },
    { len: '4', mult: '2×',  base: '',     filled: 2 },
    { len: '5', mult: '4×',  base: '',     filled: 3 },
    { len: '6', mult: '8×',  base: '',     filled: 4 },
    { len: '7+', mult: '16×', base: 'jackpot', filled: 5 },
  ]
  return (
    <div className="wordblok-multipliers">
      {rows.map(r => (
        <div key={r.len} className="wordblok-mult-row">
          <span className="wordblok-mult-len">{r.len} letters</span>
          <span className="wordblok-mult-bars" aria-hidden="true">
            {[1,2,3,4,5].map(i => (
              <span
                key={i}
                className={'wordblok-mult-bar' + (i <= r.filled ? ' wordblok-mult-bar--on' : '')}
              />
            ))}
          </span>
          <span className="wordblok-mult-val">{r.mult}</span>
          {r.base && <span className="wordblok-mult-note">{r.base}</span>}
        </div>
      ))}
    </div>
  )
}

function WordBlokHero({ onOpen }) {
  const src = IMG + 'wordblok_title.png'
  return (
    <div className="wordblok-hero">
      <button
        type="button"
        className="wordblok-hero-trigger"
        onClick={() => onOpen(src, 'WordBlok title screen')}
        aria-label="Open title screen"
      >
        <img className="wordblok-hero-img" src={src} alt="WordBlok title screen" loading="lazy" />
      </button>
      <div className="wordblok-hero-overlay">
        <div className="wordblok-hero-quote">Place tiles. Make words. Score big.</div>
        <div className="wordblok-hero-sub">Polyomino puzzling meets Scrabble scoring — built for iOS.</div>
        <a
          className="wordblok-appstore-badge"
          href="https://apps.apple.com/us/app/wordbloks/id6771600251"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download WordBloks on the App Store"
        >
          <svg
            className="wordblok-appstore-badge-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path
              fill="currentColor"
              d="M17.05 12.04c-.02-2.05 1.67-3.04 1.75-3.09-.96-1.4-2.45-1.59-2.98-1.61-1.26-.13-2.47.74-3.11.74-.65 0-1.64-.72-2.7-.7-1.39.02-2.67.8-3.39 2.04-1.45 2.51-.37 6.22 1.04 8.26.69.99 1.51 2.11 2.58 2.07 1.04-.04 1.43-.67 2.69-.67 1.25 0 1.6.67 2.69.64 1.11-.02 1.81-1.01 2.49-2.01.78-1.16 1.11-2.28 1.13-2.34-.03-.01-2.16-.83-2.18-3.29Zm-2.07-6.05c.57-.69.95-1.66.84-2.62-.83.03-1.83.55-2.42 1.24-.52.61-.98 1.59-.86 2.53.92.07 1.87-.47 2.44-1.15Z"
            />
          </svg>
          <span className="wordblok-appstore-badge-text">
            <span className="wordblok-appstore-badge-pretitle">Download on the</span>
            <span className="wordblok-appstore-badge-title">App Store</span>
          </span>
        </a>
      </div>
    </div>
  )
}

function WordBlokShot({ src, alt, caption, onOpen }) {
  return (
    <button
      type="button"
      className="wordblok-shot"
      onClick={() => onOpen(src, alt)}
      aria-label={alt ? `Enlarge: ${alt}` : 'Enlarge screenshot'}
    >
      <img src={src} alt={alt || ''} loading="lazy" />
      {caption && <div className="wordblok-shot-caption">{caption}</div>}
    </button>
  )
}

function WordBlokSection({ id, eyebrow, title, children, images, layout, accent, extras, onOpen }) {
  const imageEls = (images || []).map((img, idx) => (
    <WordBlokShot
      key={idx}
      src={IMG + img.src}
      alt={img.alt}
      caption={img.caption}
      onOpen={onOpen}
    />
  ))

  const style = accent ? { '--section-accent': accent } : undefined

  return (
    <section
      id={id}
      className={`wordblok-section wordblok-section--${layout}`}
      style={style}
    >
      <div className="wordblok-section-text">
        {eyebrow && <div className="wordblok-eyebrow">{eyebrow}</div>}
        <h4 className="wordblok-section-title">{title}</h4>
        <div className="wordblok-section-divider" />
        <p className="wordblok-section-body">{children}</p>
        {extras}
      </div>
      {imageEls.length > 0 && (
        <div className="wordblok-section-images">{imageEls}</div>
      )}
    </section>
  )
}

function WordBlokEvolution({ onOpen }) {
  const frames = [
    {
      src: 'wordblok_play_start.png',
      alt: 'Mid-game board with DIN and DAFINE columns building up',
      caption: 'A few turns in',
      note: 'Letters from earlier turns stay on the board.',
    },
    {
      src: 'wordblok_score_fin.png',
      alt: 'Scoring FIN +8 by bridging existing letters with a new N tile',
      caption: '+8 FIN',
      note: 'A new tile bridges two existing letters into a fresh word.',
    },
    {
      src: 'wordblok_score_fen.png',
      alt: 'Scoring FEN +12 — score now 39 with a 3 streak',
      caption: '+12 FEN · 3 streak',
      note: 'Score and streak climb as words extend in new directions.',
    },
  ]

  return (
    <section
      className="wordblok-section wordblok-section--evolution"
      style={{ '--section-accent': '#4D8CF2' }}
    >
      <div className="wordblok-section-text">
        <div className="wordblok-eyebrow">Persistent letters</div>
        <h4 className="wordblok-section-title">Letters stay. Words evolve.</h4>
        <div className="wordblok-section-divider" />
        <p className="wordblok-section-body">
          Unlike Scrabble, scored letters don&rsquo;t leave the board. They become
          <em> scaffolding </em>
          you extend into new, longer words turn after turn. Bridge two leftover letters
          with a single tile and a brand-new word ignites — every placement is also a
          setup for the next one.
        </p>
      </div>
      <div className="wordblok-evolution-grid">
        {frames.map((f, idx) => {
          const fullSrc = IMG + f.src
          return (
            <button
              type="button"
              key={f.src}
              className="wordblok-evolution-card"
              onClick={() => onOpen(fullSrc, f.alt)}
              aria-label={`Enlarge: ${f.alt}`}
            >
              <div className="wordblok-evolution-img-wrap">
                <img src={fullSrc} alt={f.alt} loading="lazy" />
                <span className="wordblok-evolution-step">{idx + 1}</span>
              </div>
              <div className="wordblok-evolution-meta">
                <div className="wordblok-evolution-caption">{f.caption}</div>
                <div className="wordblok-evolution-note">{f.note}</div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function WordBlokModes() {
  const modes = [
    {
      name: 'Free Play',
      tagline: 'Endless · saved between launches',
      blurb: 'Open-ended runs that persist on your device. Chase your high score, or just zone out and place tiles.',
      accent: 'linear-gradient(180deg, #F2C200, #d9aa00)',
      textColor: '#1a1a1a',
    },
    {
      name: 'Daily Challenge',
      tagline: 'Same seed for every player, every day',
      blurb: 'A deterministic run that resets at midnight. Every player gets the same pieces in the same order — pure score-chase.',
      accent: 'linear-gradient(180deg, #4D8CF2, #8C66D9)',
      textColor: '#ffffff',
    },
  ]
  return (
    <section
      className="wordblok-section wordblok-section--modes"
      style={{ '--section-accent': '#F2C200' }}
    >
      <div className="wordblok-section-text">
        <div className="wordblok-eyebrow">Modes</div>
        <h4 className="wordblok-section-title">Two ways to play.</h4>
        <div className="wordblok-section-divider" />
        <p className="wordblok-section-body">
          One mode for sitting with the game as long as you want; one for the daily
          ritual.
        </p>
      </div>
      <div className="wordblok-modes-grid">
        {modes.map(m => (
          <div
            key={m.name}
            className="wordblok-mode-card"
            style={{ background: m.accent, color: m.textColor }}
          >
            <div className="wordblok-mode-name">{m.name}</div>
            <div className="wordblok-mode-tag">{m.tagline}</div>
            <div className="wordblok-mode-blurb">{m.blurb}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function WordBlokLightbox({ image, onClose }) {
  if (!image) return null
  return (
    <div
      className="wordblok-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      onClick={onClose}
    >
      <button
        type="button"
        className="wordblok-lightbox-close"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
      <img
        className="wordblok-lightbox-img"
        src={image.src}
        alt={image.alt || ''}
        onClick={e => e.stopPropagation()}
      />
      {image.alt && (
        <div className="wordblok-lightbox-caption" onClick={e => e.stopPropagation()}>
          {image.alt}
        </div>
      )}
    </div>
  )
}

class WordBlokComponent extends React.Component {
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
      <div className="wordblok">
        <WordBlokHero onOpen={this.openLightbox} />

        <WordBlokSection
          eyebrow="Core loop"
          title="Polyomino pieces. Scrabble scoring."
          layout="single-right"
          accent="#F2C200"
          onOpen={this.openLightbox}
          images={[
            { src: 'wordblok_board_empty.png', alt: 'An 8×8 board with starting bonus squares: 2L, 3L, 2W, and wildcard ?' },
          ]}
          extras={<BonusLegend />}
        >
          Drag Tetris-shaped pieces of 1&ndash;4 letter tiles onto an 8&times;8 board.
          Any time placed tiles form a 3+ letter run that&rsquo;s a real word
          (<em>SOWPODS</em> dictionary), it scores. Letters carry Scrabble values,
          and bonus squares &mdash; <em>2L, 3L, 2W</em> &mdash; stack on top.
        </WordBlokSection>

        <WordBlokSection
          eyebrow="Scoring"
          title="Length is hugely rewarded."
          layout="single-left"
          accent="#8C66D9"
          onOpen={this.openLightbox}
          images={[
            { src: 'wordblok_score_fen.png', alt: 'Mid-run scoring with FEN +12 and a 3-streak', caption: 'Streak + scoring HUD' },
          ]}
          extras={<LengthMultiplierChart />}
        >
          A 7-letter word is worth <em>sixteen times</em> the base value of a
          3-letter word. The doubling curve makes every extra letter feel huge,
          and the streak counter rewards stringing scoring placements together
          without a dry turn.
        </WordBlokSection>

        <WordBlokEvolution onOpen={this.openLightbox} />

        <WordBlokSection
          eyebrow="Specials"
          title="Wildcards, bombs, and blockers."
          layout="single-right"
          accent="#9b3f6e"
          onOpen={this.openLightbox}
          images={[
            { src: 'wordblok_play_start.png', alt: 'Board with a wildcard, a bomb, and gray blocker cells in play', caption: 'Wildcards, bombs, blockers' },
          ]}
        >
          Clear a wildcard square to earn a <em>?</em> tile that scores as any
          letter. Clear a bomb square and the next bomb piece detonates a
          3&times;3 clear of blockers. Blockers take up space until you score a
          word in their row &mdash; then the row clears and frees the board up
          again.
        </WordBlokSection>

        <WordBlokModes />

        <WordBlokLightbox image={lightbox} onClose={this.closeLightbox} />
      </div>
    )
  }
}

export default WordBlokComponent
