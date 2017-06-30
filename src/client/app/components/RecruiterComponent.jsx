import React from 'react'

class RecruiterComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = { workLevel: "recruiter" }
  }

  render() {
    return (
      <div className="container">
        <div className="row work-title-row">
          <div className="col-8">
            <p className="work-title">Technical Recruiter</p>
          </div>
          <div className="col-4 align-right">
            <i>June 2010 – February 2012</i>
          </div>
        </div>

        <ul className="row resume-line">
          <li>One of two top sourcers, establishing best practices for the role and training every new recruiter</li>
          <li>Managed and supported up to 10 clients at any given time</li>
        </ul>
      </div>
    )
  }

}

export default RecruiterComponent
