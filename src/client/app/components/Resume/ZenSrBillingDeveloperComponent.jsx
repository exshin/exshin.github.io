import React from 'react'

class ZenSrBillingDeveloperComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = { workLevel: "recruiter" }
    }

    render() {
        return (
            <div className="container">
                <div className="row work-title-row">
                    <div className="col-6">
                        <p className="work-title">Senior Software Engineer - Product Led Growth</p>
                    </div>
                    <div className="col-6 align-right date-ranges">
                        <i>September 2021 – Present</i>
                    </div>
                </div>

                <ul className="row resume-line">
                    <li>Architected and developed an order processing integration service targeting sub-5-second order creation, 99.9% data accuracy, and throughput of 1,000+ orders per minute</li>
                    <li>Built a new domain service (RoR, AWS SQS) pulling core usage payments functionality from the existing billing monolith, which improved stability, reduced latency, and reduced code complexity</li>
                    <li>Led several multi-feature platform integration projects across coordinated work streams (3 separate orgs, as well as product and design) maintaining momentum across interdependencies and time zones</li>
                    <li>Authored and organized test plans and execution documentation, enabling consistent test execution and smoother contributor handoffs</li>
                    <li>Developed and shared AI tooling across the team (Claude skills) to greatly lift engineering productivity</li>
                </ul>
            </div>
        )
    }

}

export default ZenSrBillingDeveloperComponent
