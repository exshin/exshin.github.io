import React from 'react'

class ZenBillingDeveloperComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = { workLevel: "recruiter" }
    }

    render() {
        return (
            <div className="container">
                <div className="row work-title-row">
                    <div className="col-6">
                        <p className="work-title">Software Engineer - Billing, Growth & Monetization</p>
                    </div>
                    <div className="col-6 align-right date-ranges">
                        <i>July 2019 – Present</i>
                    </div>
                </div>

                <ul className="row resume-line">
                    <li>Built an async API Service to integrate charge transactions between Sell Voice and Zuora</li>
                    <li>Implemented new features and enhancements to the Core Billing app servicing all Zendesk products</li>
                    <li>Regularly presented in tech demos to share new technologies and learnings to improve team knowledge base</li>
                    <li>Participated in regular on-call rotation, code reviews, bug triaging, and writing unit tests in Rspec</li>
                </ul>
            </div>
        )
    }

}

export default ZenBillingDeveloperComponent
