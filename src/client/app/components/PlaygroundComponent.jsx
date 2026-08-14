import React from 'react'
import ActivityFinderComponent from './ActivityFinder/ActivityFinderComponent.jsx'
import SomniaComponent from './Somnia/SomniaComponent.jsx'
import WordBlokComponent from './WordBlok/WordBlokComponent.jsx'
import PixelBoardComponent from './PixelDrawings/PixelBoardComponent.jsx'
import TicTacBoardComponent from './TicTacFour/TicTacBoardComponent.jsx'
import PokePuzzlerComponent from './PokePuzzler/PokePuzzlerComponent.jsx'

const PROJECTS = {
  'Activity Finder': {
    key: 'Activity Finder',
    slug: 'activity-finder',
    title: 'Activity Finder',
    tagline: 'Natural-language search for Bay Area kids’ classes',
    description: "Activity Finder searches more than 18,000 classes, camps and clubs from 25 Bay Area cities. You type what you want the way you'd say it out loud, like \"swimming for my 7 year old after school under $200\", and a model turns that into filters you can see and pull off one at a time. The piece I spent the longest on is availability. You paint the hours you're free onto a grid, and a course only matches if every session fits inside them. Saving classes gives you a calendar with the total cost, the hours per week, and any collisions. Everything is crawled from the parks and rec departments that run the classes, and registration happens on their site, not mine.",
    techTags: ['Python', 'React', 'LLM'],
    cardTech: 'Python, React',
    projectColor: '#2f6f5e',
    thumb: { type: 'image', src: './img/af_thumb.png' },
    archived: false,
    Component: ActivityFinderComponent,
  },
  WordBlok: {
    key: 'WordBlok',
    slug: 'wordblok',
    title: 'WordBlok',
    tagline: 'Polyomino + Scrabble word puzzle for iOS',
    description: "WordBlok is a polished iOS word puzzle I'm building that fuses Tetris-style piece placement with Scrabble-style word scoring. Drag polyomino-shaped pieces of letter tiles onto an 8×8 board; any time the placed tiles form a real dictionary word, it scores — with a punishing length multiplier (a 7-letter word is worth 16× a 3-letter word's base value). Letters persist after scoring, so each turn quietly sets up the next. Wildcards, bombs, and blockers add strategic specials. Built natively in SwiftUI with an event-driven engine layer and a pure scorer.",
    techTags: ['SwiftUI', 'iOS'],
    projectColor: '#F2C200',
    thumb: { type: 'image', src: './img/wordblok_thumb.png' },
    archived: false,
    Component: WordBlokComponent,
  },
  Somnia: {
    key: 'Somnia',
    slug: 'somnia',
    title: 'Somnia',
    tagline: 'Turn-based match-3 RPG for iOS',
    description: 'Somnia is a turn-based match-3 RPG I\'m building for iOS. You play a Drifter — someone who slips into a real, layered dream world whenever they sleep — and travel its six regions with a team of Reveries: native creatures tied to the elements Ember, Tide, Stone, Drift, Dawn, and Dusk. Battles play out as tile-matching puzzles that fuel each Reverie\'s skills. Areas branch into nodes (combat, dialogue, rest, hidden rooms), so every night threads exploration, story, and team-building together.',
    techTags: ['SwiftUI', 'iOS'],
    projectColor: '#7a5cd6',
    thumb: { type: 'image', src: './img/somnia_battle_dreamsurge.webp' },
    archived: false,
    Component: SomniaComponent,
  },
  'Pixel Drawer': {
    key: 'Pixel Drawer',
    slug: 'pixel-drawer',
    title: 'Pixel Drawer',
    tagline: 'Pixel art editor',
    description: "I'm planning to create a short animated story with pixel like graphics, and so I built this tool to help create my pixel drawings. I'm planning to add the animation component to it next. As of now, you can save and load your own pixel drawings. Give it a shot!",
    techTags: ['React'],
    projectColor: '#4a90d9',
    thumb: { type: 'synth-pixel' },
    archived: false,
    Component: PixelBoardComponent,
  },
  TicTacFour: {
    key: 'TicTacFour',
    slug: 'tictacfour',
    title: 'TicTacFour',
    tagline: 'A bigger tic-tac-toe with simple AI',
    description: 'I wanted to build a simple game, but wanted a something a little more complex than just the tictactoe that I thought of. Designing and building this game was fun. It gave me a chance to work on a simple AI and further develop my React skillset.',
    techTags: ['React'],
    projectColor: '#5cb85c',
    thumb: { type: 'synth-tictac' },
    archived: false,
    Component: TicTacBoardComponent,
  },
  PokePuzzler: {
    key: 'PokePuzzler',
    slug: 'poke-puzzler',
    title: 'Poke Puzzler',
    tagline: 'Match-3 prototype (archive)',
    description: "No longer actively working on this one — keeping it up as an archive. The original idea was a Pokemon-inspired Match-3 iOS game: I love match-3 games and was really into Pokemon growing up, so I built the base gameplay loop and a few iOS animations from scratch before shelving it.",
    techTags: ['Swift3', 'Archive'],
    projectColor: '#999999',
    thumb: { type: 'image', src: './img/pp_battle_start.PNG' },
    archived: true,
    Component: PokePuzzlerComponent,
  },
}

const PROJECT_ORDER = ['WordBlok', 'Activity Finder', 'Somnia', 'Pixel Drawer', 'TicTacFour', 'PokePuzzler']

function PlaygroundHeader() {
  return (
    <div className="playground-header">
      <h1 className="playground-title">Playground</h1>
      <div className="playground-title-divider"></div>
      <p className="playground-subtitle">Things I'm tinkering with at the moment.</p>
    </div>
  )
}

function PixelThumb() {
  const cells = [
    [0,0,1,1,1,1,0,0],
    [0,1,2,2,2,2,1,0],
    [1,2,3,2,2,3,2,1],
    [1,2,2,2,2,2,2,1],
    [1,2,3,2,2,3,2,1],
    [1,2,2,3,3,2,2,1],
    [0,1,2,2,2,2,1,0],
    [0,0,1,1,1,1,0,0],
  ]
  const palette = ['#f5f5f5', '#dbe9f6', '#4a90d9', '#1a1a1a']
  const rects = []
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      rects.push(
        <rect
          key={`${x}-${y}`}
          x={x * 10}
          y={y * 10}
          width={10}
          height={10}
          fill={palette[cells[y][x]]}
        />
      )
    }
  }
  return (
    <svg className="playground-thumb-svg" viewBox="0 0 80 80" preserveAspectRatio="xMidYMid meet">
      <rect x="0" y="0" width="80" height="80" fill="#fafafa" />
      <g transform="translate(0,0)">{rects}</g>
    </svg>
  )
}

function TicTacThumb() {
  const lines = []
  for (let i = 1; i < 4; i++) {
    lines.push(<line key={`v-${i}`} x1={i * 20} y1={0} x2={i * 20} y2={80} stroke="#ddd" strokeWidth="1" />)
    lines.push(<line key={`h-${i}`} x1={0} y1={i * 20} x2={80} y2={i * 20} stroke="#ddd" strokeWidth="1" />)
  }
  const mark = (cx, cy, kind) => {
    if (kind === 'x') {
      return (
        <g key={`${cx}-${cy}-x`}>
          <line x1={cx - 5} y1={cy - 5} x2={cx + 5} y2={cy + 5} stroke="#4682b4" strokeWidth="2" strokeLinecap="round" />
          <line x1={cx - 5} y1={cy + 5} x2={cx + 5} y2={cy - 5} stroke="#4682b4" strokeWidth="2" strokeLinecap="round" />
        </g>
      )
    }
    return <circle key={`${cx}-${cy}-o`} cx={cx} cy={cy} r="5" stroke="#cd5c5c" strokeWidth="2" fill="none" />
  }
  return (
    <svg className="playground-thumb-svg" viewBox="0 0 80 80" preserveAspectRatio="xMidYMid meet">
      <rect x="0" y="0" width="80" height="80" fill="#fafafa" />
      {lines}
      {mark(10, 10, 'x')}
      {mark(50, 30, 'o')}
      {mark(70, 50, 'x')}
      {mark(30, 70, 'o')}
    </svg>
  )
}

function PlaygroundThumb({ thumb, title }) {
  if (thumb.type === 'image') {
    return <img className="playground-thumb-img" src={thumb.src} alt="" />
  }
  if (thumb.type === 'synth-pixel') return <PixelThumb />
  if (thumb.type === 'synth-tictac') return <TicTacThumb />
  return null
}

function PlaygroundGalleryCard({ project, selected, onSelect }) {
  const classes = ['playground-card-nav']
  if (selected) classes.push('playground-card-nav--selected')
  if (project.archived) classes.push('playground-card-nav--archived')

  return (
    <button
      type="button"
      className={classes.join(' ')}
      style={{ '--project-color': project.projectColor }}
      aria-pressed={selected}
      onClick={() => onSelect(project.key)}
    >
      <div className="playground-thumb">
        <PlaygroundThumb thumb={project.thumb} title={project.title} />
        {project.archived && <span className="playground-archive-pill">Archive</span>}
      </div>
      <div className="playground-card-body">
        <div className="playground-card-title">{project.title}</div>
        <div className="playground-card-tagline">{project.tagline}</div>
        {/* cardTech overrides the card label when one tag doesn't tell the story */}
        <div className="playground-card-tech">{project.cardTech || project.techTags[0]}</div>
      </div>
    </button>
  )
}

function PlaygroundGallery({ selected, onSelect }) {
  return (
    <div className="playground-gallery">
      {PROJECT_ORDER.map(key => (
        <PlaygroundGalleryCard
          key={key}
          project={PROJECTS[key]}
          selected={selected === key}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

function PlaygroundHero({ project }) {
  return (
    <div className="playground-hero" style={{ '--project-color': project.projectColor }}>
      <div className="playground-hero-top">
        <h3 className="playground-hero-title">{project.title}</h3>
        <div className="playground-hero-tags">
          {project.techTags.map(tag => (
            <span key={tag} className="playground-hero-pill">{tag}</span>
          ))}
        </div>
      </div>
      <div className="playground-hero-divider"></div>
      <p className="playground-hero-description">{project.description}</p>
    </div>
  )
}

const KEY_FOR_SLUG = PROJECT_ORDER.reduce((acc, key) => {
  acc[PROJECTS[key].slug] = key
  return acc
}, {})

class PlaygroundComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      contentView: KEY_FOR_SLUG[props.initialProject] || 'WordBlok',
    }
    this.switchContentView = this.switchContentView.bind(this)
  }

  componentDidMount() {
    this.reportProject(this.state.contentView)
  }

  componentWillReceiveProps(next) {
    const key = KEY_FOR_SLUG[next.initialProject]
    if (key && key !== this.state.contentView) {
      this.setState({ contentView: key })
    }
  }

  reportProject(key) {
    if (this.props.onProjectChange) {
      this.props.onProjectChange(PROJECTS[key].slug)
    }
  }

  switchContentView(content) {
    this.setState({ contentView: content })
    this.reportProject(content)
  }

  render() {
    const project = PROJECTS[this.state.contentView]
    const ProjectComponent = project.Component

    return (
      <div className="container-fluid playground-page poster">
        <PlaygroundHeader />
        <PlaygroundGallery selected={this.state.contentView} onSelect={this.switchContentView} />
        <PlaygroundHero project={project} />
        <div className="playground-content">
          <ProjectComponent />
        </div>
      </div>
    )
  }
}

export default PlaygroundComponent
