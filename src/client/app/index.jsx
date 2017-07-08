import AboutComponent from './components/AboutComponent.jsx'
import ResumeComponent from './components/ResumeComponent.jsx'
import PlaygroundComponent from './components/PlaygroundComponent.jsx'

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
      contentView = <PlaygroundComponent/>
    }

    return (
      <div className="row container-fluid">
        <div className="col-7 top-bar">
          <div className="big-brand">
            <img className="portrait float-left rounded" src="./src/client/img/hummingbird_focus.jpg"></img>
            <p>EUGENE CHINVEERAPHAN</p>
          </div>
        </div>

        <div className="col-5 top-bar">
          <nav className="navbar navbar-toggleable-md navbar-light nav-content">
            <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>


            <div className="collapse navbar-collapse" id="navbarNav">

                <ul className="navbar-nav float-md-right">
                  <li className={this.state.currentView === "About" ? "nav-item active underline" : "nav-item"}>
                    <a className="nav-item nav-link" href="#" onClick={ this.toContent.bind(this, "About") }>About</a>
                  </li>
                  <li className={this.state.currentView === "Resume" ? "nav-item active underline" : "nav-item"}>
                    <a className="nav-item nav-link" href="#" onClick={ this.toContent.bind(this, "Resume") }>Experience</a>
                  </li>
                  <li className={this.state.currentView === "Playground" ? "nav-item active underline" : "nav-item"}>
                    <a className="nav-item nav-link" href="#" onClick={ this.toContent.bind(this, "Playground") }>Playground</a>
                  </li>
                  <li className="nav-item vertical-line"></li>
                  <li className="nav-item">
                    <a className="nav-item nav-link nav-icon" href="https://www.linkedin.com/in/eugenechinveeraphan/"><i className="fa fa-linkedin-square" aria-hidden="true"></i></a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-item nav-link nav-icon" href="https://twitter.com/echinveeraphan"><i className="fa fa-twitter-square" aria-hidden="true"></i></a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-item nav-link nav-icon" href="https://github.com/exshin"><i className="fa fa-github-square" aria-hidden="true"></i></a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-item nav-link nav-icon" href="https://www.twitch.tv/exshin"><i className="fa fa-twitch" aria-hidden="true"></i></a>
                  </li>
                </ul>
              </div>

          </nav>
        </div>


        <div className="container">
          { contentView }
        </div>

      </div>
    )
  }
}

render(<App/>, document.getElementById('app'))
