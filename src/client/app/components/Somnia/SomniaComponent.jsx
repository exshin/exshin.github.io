import React from 'react'

const IMG = './img/'

const ELEMENTS = [
  { key: 'ember',  label: 'Ember',  color: '#ff8a4a' },
  { key: 'tide',   label: 'Tide',   color: '#4a8fd6' },
  { key: 'stone',  label: 'Stone',  color: '#9a7a4a' },
  { key: 'drift',  label: 'Drift',  color: '#5fa86b' },
  { key: 'dawn',   label: 'Dawn',   color: '#e8b438' },
  { key: 'dusk',   label: 'Dusk',   color: '#9a6dd6' },
]

function ElementLegend() {
  return (
    <div className="somnia-legend" aria-label="Element legend">
      {ELEMENTS.map(el => (
        <div key={el.key} className="somnia-legend-item">
          <span className="somnia-legend-swatch" style={{ background: el.color }} />
          <span className="somnia-legend-label">{el.label}</span>
        </div>
      ))}
    </div>
  )
}

function SomniaHero({ onOpen }) {
  const src = IMG + 'somnia_atmosphere_forest.webp'
  return (
    <div className="somnia-hero">
      <button
        type="button"
        className="somnia-hero-trigger"
        onClick={() => onOpen(src, 'Forest interior in the world of Somnia')}
        aria-label="Open atmosphere image"
      >
        <img className="somnia-hero-img" src={src} alt="Forest interior in the world of Somnia" loading="lazy" />
      </button>
      <div className="somnia-hero-overlay">
        <div className="somnia-hero-quote">The real world is grey. Somnia is alive.</div>
        <div className="somnia-hero-sub">The danger is that you start to prefer it.</div>
      </div>
    </div>
  )
}

function SomniaShot({ src, alt, caption, onOpen }) {
  return (
    <button
      type="button"
      className="somnia-shot"
      onClick={() => onOpen(src, alt)}
      aria-label={alt ? `Enlarge: ${alt}` : 'Enlarge screenshot'}
    >
      <img src={src} alt={alt || ''} loading="lazy" />
      {caption && <div className="somnia-shot-caption">{caption}</div>}
    </button>
  )
}

function SomniaSection({ id, eyebrow, title, children, images, layout, accent, extras, onOpen }) {
  const imageEls = images.map((img, idx) => (
    <SomniaShot
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
      className={`somnia-section somnia-section--${layout}`}
      style={style}
    >
      <div className="somnia-section-text">
        {eyebrow && <div className="somnia-eyebrow">{eyebrow}</div>}
        <h4 className="somnia-section-title">{title}</h4>
        <div className="somnia-section-divider" />
        <p className="somnia-section-body">{children}</p>
        {extras}
      </div>
      <div className="somnia-section-images">{imageEls}</div>
    </section>
  )
}

function SomniaReveries({ onOpen }) {
  const reveries = [
    {
      name: 'Wisptail',
      role: 'Evolved form',
      level: 'Lv. 17',
      img: 'somnia_reverie_wisptail.webp',
      element: 'ember',
      quote: '"Emberling has awakened."',
      objectPosition: 'center 38%',
    },
    {
      name: 'Glimmerfly',
      role: 'Attacker',
      level: 'Lv. 10',
      img: 'somnia_reverie_glimmerfly.webp',
      element: 'dawn',
      quote: '"Spark Burst — a sharp crack of waking-world electricity."',
      objectPosition: 'center 30%',
    },
    {
      name: 'Pearlkin',
      role: 'Guard',
      level: 'Lv. 17',
      img: 'somnia_reverie_pearlkin.webp',
      element: 'tide',
      quote: '"Pearl Shell — when the team takes damage, all of you recover."',
      objectPosition: 'center 30%',
    },
    {
      name: 'Veilith',
      role: 'Debuffer',
      level: 'Lv. 15',
      img: 'somnia_veilith.webp',
      element: 'dusk',
      quote: 'A Dusk-aligned Reverie. Levels with the team.',
      objectPosition: 'center 25%',
    },
  ]

  const teamSrc = IMG + 'somnia_reveries_team.webp'

  return (
    <section
      className="somnia-section somnia-section--reveries"
      style={{ '--section-accent': '#7a5cd6' }}
    >
      <div className="somnia-reveries-top">
        <div className="somnia-section-text">
          <div className="somnia-eyebrow">Reveries</div>
          <h4 className="somnia-section-title">The soul of the team.</h4>
          <div className="somnia-section-divider" />
          <p className="somnia-section-body">
            Each Reverie is an elemental form plus an emotion &mdash; Ember and will, Tide
            and grief, Stone and steadfastness. They level, learn skills, take on passives
            and artifacts, and slot into a team of three. The element wheel keeps team-building
            intentional; the writing keeps each one feel like more than a stat block.
          </p>
        </div>
        <div className="somnia-section-images">
          <SomniaShot
            src={teamSrc}
            alt="Team management screen"
            caption="Team & bench"
            onOpen={onOpen}
          />
        </div>
      </div>

      <div className="somnia-reverie-grid">
        {reveries.map(rev => {
          const elementMeta = ELEMENTS.find(e => e.key === rev.element)
          const fullSrc = IMG + rev.img
          return (
            <button
              type="button"
              key={rev.name}
              className="somnia-reverie-card"
              onClick={() => onOpen(fullSrc, rev.name)}
              aria-label={`Enlarge: ${rev.name}`}
            >
              <div className="somnia-reverie-img-wrap">
                <img
                  src={fullSrc}
                  alt={rev.name}
                  loading="lazy"
                  style={{ objectPosition: rev.objectPosition }}
                />
                {elementMeta && (
                  <span
                    className="somnia-cast-badge"
                    style={{ background: elementMeta.color }}
                  >
                    {elementMeta.label}
                  </span>
                )}
              </div>
              <div className="somnia-reverie-meta">
                <div className="somnia-reverie-name">{rev.name}</div>
                <div className="somnia-reverie-role">
                  {rev.role} &middot; {rev.level}
                </div>
                <div className="somnia-reverie-quote">{rev.quote}</div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function SomniaCast({ onOpen }) {
  const cast = [
    {
      name: 'Thea',
      role: 'Drifter · Newcomer',
      img: 'somnia_thea_dialogue.webp',
      quote: '"I thought Reveries were just vibes."',
    },
    {
      name: 'Sable',
      role: 'Drifter · Companion',
      img: 'somnia_sable.webp',
      quote: '"Hey. Pulling back was the right move."',
    },
    {
      name: 'Maren',
      role: 'Drifter · Veteran',
      img: 'somnia_maren_dialogue.webp',
      quote: '"Whatever left these wasn\'t passing through. It came here, then left the same way."',
    },
  ]

  return (
    <section className="somnia-section somnia-section--cast">
      <div className="somnia-section-text">
        <div className="somnia-eyebrow">Cast &amp; story</div>
        <h4 className="somnia-section-title">Drifters in the dream.</h4>
        <div className="somnia-section-divider" />
        <p className="somnia-section-body">
          You're a Drifter — someone who slips into Somnia whenever you sleep. So are the
          others you meet there. Dialogue, story choices, and quiet beats sit between every
          encounter, and the writing keeps the wonder honest by letting the dread show
          through.
        </p>
      </div>
      <div className="somnia-cast-grid">
        {cast.map(member => {
          const fullSrc = IMG + member.img
          return (
            <button
              type="button"
              key={member.name}
              className="somnia-cast-card"
              onClick={() => onOpen(fullSrc, member.name)}
              aria-label={`Enlarge: ${member.name}`}
            >
              <div className="somnia-cast-img-wrap">
                <img src={fullSrc} alt={member.name} loading="lazy" />
              </div>
              <div className="somnia-cast-meta">
                <div className="somnia-cast-name">{member.name}</div>
                <div className="somnia-cast-role">{member.role}</div>
                <div className="somnia-cast-quote">{member.quote}</div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function SomniaLightbox({ image, onClose }) {
  if (!image) return null
  return (
    <div
      className="somnia-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      onClick={onClose}
    >
      <button
        type="button"
        className="somnia-lightbox-close"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
      <img
        className="somnia-lightbox-img"
        src={image.src}
        alt={image.alt || ''}
        onClick={e => e.stopPropagation()}
      />
      {image.alt && (
        <div className="somnia-lightbox-caption" onClick={e => e.stopPropagation()}>
          {image.alt}
        </div>
      )}
    </div>
  )
}

class SomniaComponent extends React.Component {
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
      <div className="somnia">
        <SomniaHero onOpen={this.openLightbox} />

        <SomniaSection
          eyebrow="Combat"
          title="The puzzle layer."
          layout="single-right"
          accent="#7a5cd6"
          onOpen={this.openLightbox}
          images={[
            { src: 'somnia_battle_dreamsurge.webp', alt: 'Boss battle vs. Tova\'s Pearlkin with a team of three Reveries' },
          ]}
          extras={<ElementLegend />}
        >
          Combat is a turn-based puzzle on a 7&times;7 board. Match elemental tiles &mdash;
          <em> Ember, Tide, Stone, Drift, Dawn, Dusk </em>
          &mdash; to generate Resonance, fuel each Reverie's skills, then trigger them when
          the bar fills. Cascades and 4- or 5-in-a-line bombs chain into bigger plays. Each
          round comes with its own goals.
        </SomniaSection>

        <SomniaSection
          eyebrow="Signature mechanic"
          title="The Bond."
          layout="single-right"
          accent="#4a8fd6"
          onOpen={this.openLightbox}
          images={[
            { src: 'somnia_bond_charged.webp', alt: 'Bond meter charged in battle' },
          ]}
        >
          Wild battles aren't just fights. Toggle the Will tile into bond mode and match it
          to fill the bond meter &mdash; faster as the enemy weakens. When it's full, the
          Reverie chooses to follow you. A
          <em> Dream Bond, </em>
          earned, not captured.
        </SomniaSection>

        <SomniaSection
          eyebrow="Training"
          title="Sandbox for the puzzle."
          layout="single-left"
          accent="#e8b438"
          onOpen={this.openLightbox}
          images={[
            { src: 'somnia_training_timed.webp', alt: 'Timed practice challenge' },
          ]}
        >
          Drop into focused puzzle challenges to learn the systems &mdash; timed matches,
          element goals, free retries. Useful as an onboarding ramp and as a place to tune
          board behaviour outside a real battle.
        </SomniaSection>

        <SomniaReveries onOpen={this.openLightbox} />

        <SomniaCast onOpen={this.openLightbox} />

        <SomniaSection
          eyebrow="The world"
          title="Six layers, growing stranger."
          layout="dual"
          accent="#5fa86b"
          onOpen={this.openLightbox}
          images={[
            { src: 'somnia_map.webp', alt: 'World map showing branching nodes', caption: 'Branching nodes' },
            { src: 'somnia_region_lava.webp', alt: 'Cracked obsidian plateau in a deeper region', caption: 'A deeper region' },
          ]}
        >
          Somnia is a layered dream world. The outermost region &mdash; the Ancient Stone
          Forest &mdash; feels almost like waking. Deeper down, the world stops obeying
          waking logic: cracked obsidian plateaus, rivers of magma underfoot. Areas branch
          into nodes (combat, dialogue, rest, hidden rooms), and each night you sleep
          takes you a little further.
        </SomniaSection>

        <SomniaLightbox image={lightbox} onClose={this.closeLightbox} />
      </div>
    )
  }
}

export default SomniaComponent
