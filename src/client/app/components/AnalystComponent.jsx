import React from 'react'

class AnalystComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = { workLevel: "recruiter" }
  }

  render() {
    return (
      <div className="container">
        <h5>Senior Analyst</h5>
        <ul>
          <li>Wrote SQL queries and VBA scripts to pull custom datasets from a complex relational database</li>
          <li>Analyzed and produced reports on supply and demand on candidate flow, individual recruiter revenue forecasts, and optimal activity levels based on activity to candidate saturation</li>
        </ul>
      </div>
    )
  }

}

export default AnalystComponent
