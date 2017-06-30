import React from 'react'
import DeveloperComponent from './DeveloperComponent.jsx'
import AnalystComponent from './AnalystComponent.jsx'
import RecruiterComponent from './RecruiterComponent.jsx'

class ResumeComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = { workerLevel: "Recruiter" }
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
      <div className="container">
        <h3>Resume</h3>

        <ul className="nav justify-content-end">
          <li className="nav-item">
            <a className="nav-link" href="#" data-content="About" onClick={ this.toWorker.bind(this, "Recruiter") }>Technical Recruiter</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#" data-content="Resume" onClick={ this.toWorker.bind(this, "Analyst") }>Senior Analyst</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#" data-content="Contact" onClick={ this.toWorker.bind(this, "Developer") }>Backend Software Engineer</a>
          </li>
        </ul>

        <div className="container">
          { contentView }
        </div>
      </div>
    )
  }

}

export default ResumeComponent
