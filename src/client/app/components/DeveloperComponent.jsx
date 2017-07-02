import React from 'react'

class DeveloperComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = { workLevel: "recruiter" }
  }

  render() {
    return (
      <div className="container">
        <div className="row work-title-row">
          <div className="col-6">
            <p className="work-title">Backend Software Engineer</p>
          </div>
          <div className="col-6 align-right date-ranges">
            <i>December 2015 – Present</i>
          </div>
        </div>

        <ul className="row resume-line">
          <li>Collaborated with Product, Data Science, and DevOps to build and release an entity resolution service from the ground up</li>
          <li>Integrated resolution services with asynchronous workers via Sidekiq to manage job resolution status</li>
          <li>Built ETL data pipeline, integrating information from third party data providers using Redis ElastiCache</li>
          <li>Architected chrome extension using ReactJS, NuclearJS, Ruby to automatically detect and scrape key data from online sources into relational database</li>
          <li>Profiled API performance using RubyProfiler and NewRelic, improving application response times 10x from ~800ms to ~80ms</li>
          <li>Migrated ETL API out of monolithic architecture towards service oriented architecture</li>
          <li>Mentored multiple interns in coding best practices & API design, leading to release of metrics dashboard</li>
          <li>Designed and optimized new database schemas and indices in Postgres for merge activity dashboard</li>
          <li>Prototyped, iterated and shipped a hackathon project that displayed a relationship map between employees at similar companies</li>
          <li>Participated in regular on-call rotation, code reviews, bug triaging, and writing unit tests in Rspec</li>
        </ul>
      </div>
    )
  }

}

export default DeveloperComponent
