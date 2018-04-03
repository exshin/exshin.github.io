import React from 'react'

class ZenDeveloperComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = { workLevel: "recruiter" }
    }

    render() {
        return (
            <div className="container">
                <div className="row work-title-row">
                    <div className="col-6">
                        <p className="work-title">Software Engineer</p>
                    </div>
                    <div className="col-6 align-right date-ranges">
                        <i>August 2017 – Present</i>
                    </div>
                </div>

                <ul className="row resume-line">
                    <li>Delivered a large, complex, cross-organizational project within the first 3 months</li>
                    <li>Regularly developed new features for 3 separate products</li>
                    <li>Ticket triaging during ticket duty, mentoring, and maintaining a high level of communication between the team manager and product manager.</li>
                </ul>
            </div>
        )
    }

}

export default ZenDeveloperComponent
