import AboutComponent from './components/AboutComponent.jsx'
import ResumeComponent from './components/ResumeComponent.jsx'
import PlaygroundComponent from './components/PlaygroundComponent.jsx'
import ArchitectureDiagramComponent from './components/ArchitectureDiagram/ArchitectureDiagramComponent.jsx'

import React from 'react'
import {render} from 'react-dom'

/* Views addressable by URL hash, so a link can point at a section. */
const VIEWS = {
  about: 'About',
  experience: 'Resume',
  playground: 'Playground',
  system_design: 'SystemDesign',
}
const SLUG_FOR_VIEW = {
  About: 'about',
  Resume: 'experience',
  Playground: 'playground',
  SystemDesign: 'system_design',
}

function parseHash() {
  const raw = window.location.hash.replace(/^#\/?/, '')
  if (!raw) return { view: 'About', project: null }
  const [viewSlug, projectSlug] = raw.split('/')
  return {
    view: VIEWS[viewSlug] || 'About',
    project: projectSlug || null,
  }
}

/* Inline so the page does not load an icon-font kit for four glyphs. */
const SOCIAL = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/eugenechinveeraphan/',
    path: 'M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0ZM.22 8.02h4.52V24H.22V8.02Zm7.4 0h4.33v2.18h.06c.6-1.14 2.08-2.34 4.28-2.34 4.58 0 5.42 3.01 5.42 6.93V24h-4.52v-7.31c0-1.74-.03-3.98-2.43-3.98-2.43 0-2.8 1.9-2.8 3.86V24H7.62V8.02Z',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/exshin',
    path: 'M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.5 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z',
  },
  {
    label: 'X, formerly Twitter',
    href: 'https://twitter.com/echinveeraphan',
    path: 'M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.22-6.82-5.96 6.82H1.68l7.73-8.84L1.25 2.25h6.82l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.11l11.97 15.64Z',
  },
  {
    label: 'Twitch',
    href: 'https://www.twitch.tv/exshin',
    path: 'M4.27 0 1.5 3.69v16.62h5.54V24h3.23l3.23-3.69h4.62L23.5 14.7V0H4.27Zm16.46 13.6-3.23 3.7h-5.54l-3.23 3.69v-3.7H4.5V2.77h16.23V13.6ZM17.5 6.46v6.46h-2.31V6.46h2.31Zm-6.23 0v6.46H8.96V6.46h2.31Z',
  },
]

function SocialLink({ item }) {
  return (
    <li className="nav-item nav-item--social">
      <a
        className="nav-item nav-link nav-icon"
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={item.label}
        title={item.label}
      >
        <svg className="nav-icon-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path fill="currentColor" d={item.path} />
        </svg>
      </a>
    </li>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props)
    const { view, project } = parseHash()
    this.state = { currentView: view, initialProject: project, navOpen: false }
    this.toContent = this.toContent.bind(this)
    this.onHashChange = this.onHashChange.bind(this)
    this.toggleNav = this.toggleNav.bind(this)
    this.onProjectChange = this.onProjectChange.bind(this)
  }

  componentDidMount() {
    window.addEventListener('hashchange', this.onHashChange)
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.onHashChange)
  }

  /* Back and forward buttons move between sections. */
  onHashChange() {
    const { view, project } = parseHash()
    this.setState({ currentView: view, initialProject: project })
  }

  toContent(currentView, event) {
    if (event) event.preventDefault()
    window.location.hash = SLUG_FOR_VIEW[currentView] || 'about'
    this.setState({ currentView, initialProject: null, navOpen: false })
  }

  /* Keeps the URL pointing at whichever project is on screen. */
  onProjectChange(slug) {
    if (this.state.currentView !== 'Playground') return
    const next = `playground/${slug}`
    if (window.location.hash.replace(/^#\/?/, '') !== next) {
      window.history.replaceState(null, '', `#${next}`)
    }
  }

  toggleNav() {
    this.setState({ navOpen: !this.state.navOpen })
  }

  renderView() {
    switch (this.state.currentView) {
      case 'About':
        return <AboutComponent />
      case 'Resume':
        return <ResumeComponent />
      case 'SystemDesign':
        return <ArchitectureDiagramComponent />
      default:
        return (
          <PlaygroundComponent
            initialProject={this.state.initialProject}
            onProjectChange={this.onProjectChange}
          />
        )
    }
  }

  navItem(view, label) {
    const active = this.state.currentView === view
    return (
      <li className={active ? 'nav-item active underline' : 'nav-item'}>
        <a
          className="nav-item nav-link"
          href={`#${SLUG_FOR_VIEW[view]}`}
          aria-current={active ? 'page' : null}
          onClick={e => this.toContent(view, e)}
        >
          {label}
        </a>
      </li>
    )
  }

  render() {
    const { navOpen } = this.state

    return (
      <div className="container-fluid poster-shell">
        <div className="sticky-header row">
          <div className="col-7 top-bar">
            <a
              className="big-brand"
              href="#about"
              onClick={e => this.toContent('About', e)}
              aria-label="Eugene Chinveeraphan, home"
            >
              <img
                className="portrait float-left rounded"
                src="./img/hummingbird_focus.jpg"
                alt=""
                width="52"
                height="52"
              />
              <p>EUGENE CHINVEERAPHAN</p>
            </a>
          </div>

          <div className="col-5 top-bar">
            <nav className="navbar navbar-toggleable-md navbar-light nav-content">
              <button
                className="navbar-toggler navbar-toggler-right"
                type="button"
                onClick={this.toggleNav}
                aria-expanded={navOpen}
                aria-controls="navbarNav"
                aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
              >
                <svg className="nav-toggle-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path
                    d={navOpen ? 'M6 6 18 18M18 6 6 18' : 'M3 6h18M3 12h18M3 18h18'}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <div
                className={navOpen ? 'navbar-collapse nav-open' : 'collapse navbar-collapse'}
                id="navbarNav"
              >
                <ul className="navbar-nav float-md-right">
                  {this.navItem('About', 'About')}
                  {this.navItem('Resume', 'Experience')}
                  {this.navItem('Playground', 'Playground')}
                  <li className="nav-item vertical-line"></li>
                  {SOCIAL.map(item => <SocialLink key={item.label} item={item} />)}
                </ul>
              </div>
            </nav>
          </div>
        </div>

        <div className="container content-area">
          {this.renderView()}
        </div>
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'))
