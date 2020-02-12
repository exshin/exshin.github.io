import React from 'react'
import RiviDeveloperComponent from './Resume/RiviDeveloperComponent.jsx'
import AnalystComponent from './Resume/AnalystComponent.jsx'
import RecruiterComponent from './Resume/RecruiterComponent.jsx'
import ZenDeveloperComponent from './Resume/ZenDeveloperComponent.jsx'
import ZenBillingDeveloperComponent from './Resume/ZenBillingDeveloperComponent.jsx'

class ResumeComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = { workerLevel: "ZenBillingDeveloper" }
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
    } else if (this.state.workerLevel === "RiviDeveloper") {
      contentView = <RiviDeveloperComponent/>
    } else if (this.state.workerLevel === "ZenDeveloper") {
      contentView = <ZenDeveloperComponent/>
    } else if (this.state.workerLevel === "ZenBillingDeveloper") {
      contentView = <ZenBillingDeveloperComponent/>
    } else {
      contentView = <RecruiterComponent/>
    }

    return (
      <div>
        <div className="row container">

          <div className="col-4">
            <a className="navbar-brand company-brand"><img className="img-circle company-logo" src="./src/client/img/zendesk-logo.png"></img>Zendesk</a>
            <div className="row">
              <a className="nav-link" href="#" onClick={ this.toWorker.bind(this, "ZenBillingDeveloper") }>Software Engineer - Billing, Growth & Monetization</a>
            </div>
            <div className="row">
              <a className="nav-link" href="#" onClick={ this.toWorker.bind(this, "ZenDeveloper") }>Software Engineer - Core Services Tools</a>
            </div>

            <a className="navbar-brand company-brand"><img className="img-circle company-logo" src="./src/client/img/RivieraLogo.png"></img>Riviera Partners</a>
            <div className="row">
              <a className="nav-link" href="#" onClick={ this.toWorker.bind(this, "RiviDeveloper") }>Software Engineer</a>
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
