import React from 'react'
import DeveloperComponent from './DeveloperComponent.jsx'
import AnalystComponent from './AnalystComponent.jsx'
import RecruiterComponent from './RecruiterComponent.jsx'

class ResumeComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = { workerLevel: "Developer" }
    this.toWorker = this.toWorker.bind(this)
  }

  toWorker(workerLevel, target) {
    this.setState({ workerLevel })
  }

  render() {
    let contentView
    if (this.state.workerLevel === "Recruiter") {
      contentView = <RecruiterComponent/>
    } else if (this.state.workerLevel === "Analyst") {
      contentView = <AnalystComponent/>
    } else if (this.state.workerLevel === "Developer") {
      contentView = <DeveloperComponent/>
    } else {
      contentView = <RecruiterComponent/>
    }

    return (
      <div>
        <div className="row container">

          <div className="col-4">
            <a className="navbar-brand company-brand"><img className="img-circle company-logo" src="./src/client/img/RivieraLogo.png"></img>Riviera Partners</a>
            <div className="row">
              <a className="nav-link" href="#" onClick={ this.toWorker.bind(this, "Developer") }>Backend Software Engineer</a>
            </div>
            <div className="row">
              <a className="nav-link" href="#" onClick={ this.toWorker.bind(this, "Analyst") }>Senior Analyst</a>
            </div>
            <div className="row">
              <a className="nav-link" href="#" onClick={ this.toWorker.bind(this, "Recruiter") }>Technical Recruiter</a>
            </div>
          </div>
          <div className="col-8">
            <div className="row container">
              { contentView }
            </div>
          </div>
        </div>

      </div>
    )
  }

}

export default ResumeComponent
