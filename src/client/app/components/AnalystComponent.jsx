import React from 'react'

class AnalystComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = { workLevel: "recruiter" }
  }

  render() {
    return (
      <div className="container">
        <div className="row work-title-row">
          <div className="col-8">
            <p className="work-title">Senior Analyst</p>
          </div>
          <div className="col-4 align-right">
            <i>February 2012 – December 2015</i>
          </div>
        </div>

        <ul className="row resume-line">
          <li>Wrote SQL queries and VBA scripts to pull custom datasets from a complex relational database</li>
          <li>Analyzed and produced reports on supply and demand on candidate flow, individual recruiter revenue forecasts, and optimal activity levels based on activity to candidate saturation</li>
        </ul>
      </div>
    )
  }

}

export default AnalystComponent
