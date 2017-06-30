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

        <nav className="navbar navbar-toggleable-md navbar-light nav-content">
          <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <a className="navbar-brand big-brand">Eugene Chinveeraphan</a>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className={this.state.currentView === "About" ? "nav-item active" : "nav-item"}>
                <a className="nav-item nav-link" href="#" onClick={ this.toContent.bind(this, "About") }>About</a>
              </li>
              <li className={this.state.currentView === "Resume" ? "nav-item active" : "nav-item"}>
                <a className="nav-item nav-link" href="#" onClick={ this.toContent.bind(this, "Resume") }>Experience</a>
              </li>
              <li className={this.state.currentView === "Contact" ? "nav-item active" : "nav-item"}>
                <a className="nav-item nav-link" href="#" onClick={ this.toContent.bind(this, "Contact") }>Contact</a>
              </li>
            </ul>
          </div>
        </nav>

        <div className="container">
          { contentView }
        </div>

      </div>
    )
  }
}

render(<App/>, document.getElementById('app'))
