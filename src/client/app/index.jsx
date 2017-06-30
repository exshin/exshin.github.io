import AboutComponent from './components/AboutComponent.jsx'
import ResumeComponent from './components/ResumeComponent.jsx'
import ContactComponent from './components/ContactComponent.jsx'

import React from 'react'
import {render} from 'react-dom'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { currentView: "About" }
    this.toContent = this.toContent.bind(this)
  }

  toContent(currentView, target) {
    this.setState({ currentView })
  }

  render () {
    let contentView
    if (this.state.currentView === "About") {
      contentView = <AboutComponent/>
    } else if (this.state.currentView === "Resume") {
      contentView = <ResumeComponent/>
    } else if (this.state.currentView === "Contact") {
      contentView = <ContactComponent/>
    } else {
      contentView = <AboutComponent/>
    }

    return (
      <div className="container-fluid">

        <ul className="nav justify-content-end">
          <li className="nav-item">
            <a className="nav-link" href="#" data-content="About" onClick={ this.toContent.bind(this, "About") }>About</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#" data-content="Resume" onClick={ this.toContent.bind(this, "Resume") }>Resume</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#" data-content="Contact" onClick={ this.toContent.bind(this, "Contact") }>Contact</a>
          </li>
        </ul>

        <div className="container">
          { contentView }
        </div>

      </div>
    )
  }
}

render(<App/>, document.getElementById('app'))
