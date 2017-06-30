import React from 'react'

class RecruiterComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = { workLevel: "recruiter" }
  }

  render() {
    return (
      <div className="container">
        <h5>Technical Recruiter</h5>
        <ul>
          <li>One of two top sourcers, establishing best practices for the role and training every new recruiter</li>
          <li>o	Managed and supported up to 10 clients at any given time</li>
        </ul>
      </div>
    )
  }

}

export default RecruiterComponent
