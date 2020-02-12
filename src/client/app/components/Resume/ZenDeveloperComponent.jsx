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
                        <p className="work-title">Software Engineer - Core Services Tools</p>
                    </div>
                    <div className="col-6 align-right date-ranges">
                        <i>August 2017 – June 2019</i>
                    </div>
                </div>

                <ul className="row resume-line">
                    <li>Successfully led a large, complex project to GA involving multiple codebases and stakeholders within the first 6 months</li>
                    <li>Built a micro-service to destroy user data in compliance with GDPR standards (RoR, Sqs)</li>
                    <li>Implemented new features and enhancements to a public facing status app for all Zendesk products (React with Ruby/Rails)</li>
                    <li>Participated in regular on-call rotation, code reviews, bug triaging, and writing unit tests in Rspec</li>
                </ul>
            </div>
        )
    }

}

export default ZenDeveloperComponent
