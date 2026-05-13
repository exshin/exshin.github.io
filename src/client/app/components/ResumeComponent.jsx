import React from 'react'

const COMPANIES = [
  {
    id: 'zendesk',
    name: 'Zendesk',
    logo: './img/zendesk_logo2.png',
    rangeLabel: 'August 2017 – Present',
    roles: [
      {
        id: 'zen-sr-plg',
        title: 'Senior Software Engineer — Product Led Growth',
        dateLabel: 'Sep 2021 – Present',
        tags: ['Ruby on Rails', 'AWS SQS', 'Postgres', 'Claude'],
        bullets: [
          'Architected and developed an order processing integration service targeting sub-5-second order creation, 99.9% data accuracy, and throughput of 1,000+ orders per minute',
          'Built a new domain service (RoR, AWS SQS) pulling core usage payments functionality from the existing billing monolith, which improved stability, reduced latency, and reduced code complexity',
          'Led several multi-feature platform integration projects across coordinated work streams (3 separate orgs, as well as product and design) maintaining momentum across interdependencies and time zones',
          'Authored and organized test plans and execution documentation, enabling consistent test execution and smoother contributor handoffs',
          'Developed and shared AI tooling across the team (Claude skills) to greatly lift engineering productivity',
        ],
      },
      {
        id: 'zen-billing',
        title: 'Software Engineer — Billing, Growth & Monetization',
        dateLabel: 'Jul 2019 – Sep 2021',
        tags: ['Ruby on Rails', 'Zuora', 'Rspec'],
        bullets: [
          'Built an async API Service to integrate charge transactions between Sell Voice and Zuora',
          'Implemented new features and enhancements to the Core Billing app servicing all Zendesk products',
          'Regularly presented in tech demos to share new technologies and learnings to improve team knowledge base',
          'Participated in regular on-call rotation, code reviews, bug triaging, and writing unit tests in Rspec',
        ],
      },
      {
        id: 'zen-core',
        title: 'Software Engineer — Core Services Tools',
        dateLabel: 'Aug 2017 – Jul 2019',
        tags: ['Ruby on Rails', 'AWS SQS', 'React', 'Rspec'],
        bullets: [
          'Successfully led a large, complex project to GA involving multiple codebases and stakeholders within the first 6 months',
          'Built a micro-service to destroy user data in compliance with GDPR standards (RoR, Sqs)',
          'Implemented new features and enhancements to a public facing status app for all Zendesk products (React with Ruby/Rails)',
          'Participated in regular on-call rotation, code reviews, bug triaging, and writing unit tests in Rspec',
        ],
      },
    ],
  },
  {
    id: 'riviera',
    name: 'Riviera Partners',
    logo: './img/RivieraLogo.png',
    rangeLabel: 'June 2010 – July 2017',
    roles: [
      {
        id: 'riv-swe',
        title: 'Software Engineer',
        dateLabel: 'Dec 2015 – Jul 2017',
        tags: ['Ruby on Rails', 'React', 'Postgres', 'Sidekiq', 'Redis', 'NewRelic'],
        bullets: [
          'Collaborated with Product, Data Science, and DevOps to build and release an entity resolution service from the ground up',
          'Integrated resolution services with asynchronous workers via Sidekiq to manage job resolution status',
          'Built ETL data pipeline, integrating information from third party data providers using Redis ElastiCache',
          'Architected chrome extension using ReactJS, NuclearJS, Ruby to automatically detect and scrape key data from online sources into relational database',
          'Profiled API performance using RubyProfiler and NewRelic, improving application response times 10x from ~800ms to ~80ms',
          'Migrated ETL API out of monolithic architecture towards service oriented architecture',
          'Mentored multiple interns in coding best practices & API design, leading to release of metrics dashboard',
          'Designed and optimized new database schemas and indices in Postgres for merge activity dashboard',
          'Prototyped, iterated and shipped a hackathon project that displayed a relationship map between employees at similar companies',
          'Participated in regular on-call rotation, code reviews, bug triaging, and writing unit tests in Rspec',
        ],
      },
      {
        id: 'riv-analyst',
        title: 'Senior Data Analyst',
        dateLabel: 'Feb 2012 – Dec 2015',
        tags: ['SQL', 'VBA'],
        bullets: [
          'Wrote SQL queries and VBA scripts to pull custom datasets from a complex relational database',
          'Analyzed and produced reports on supply and demand on candidate flow, individual recruiter revenue forecasts, and optimal activity levels based on activity to candidate saturation',
        ],
      },
      {
        id: 'riv-recruiter',
        title: 'Technical Recruiter',
        dateLabel: 'Jun 2010 – Feb 2012',
        tags: [],
        bullets: [
          'One of two top sourcers, establishing best practices for the role and training every new recruiter',
          'Managed and supported up to 10 clients at any given time',
        ],
      },
    ],
  },
]

function ResumeHeader() {
  return (
    <div className="resume-header">
      <h2 className="resume-title">Experience</h2>
      <div className="resume-title-divider"></div>
      <p className="resume-subtitle">A decade of building things, mostly behind the scenes.</p>
    </div>
  )
}

function ResumeRoleCard({ role, isExpanded, onSelect }) {
  if (isExpanded) {
    return (
      <div className="resume-role-card resume-role-card--expanded">
        <div className="resume-role-header-expanded">
          <h3 className="resume-role-title-expanded">{role.title}</h3>
          <span className="resume-role-date-expanded">{role.dateLabel}</span>
        </div>
        {role.tags.length > 0 && (
          <div className="resume-tag-row">
            {role.tags.map(tag => (
              <span key={tag} className="resume-tag">{tag}</span>
            ))}
          </div>
        )}
        <ul className="resume-bullets">
          {role.bullets.map((bullet, idx) => (
            <li key={idx}>{bullet}</li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <button
      type="button"
      className="resume-role-card"
      aria-expanded={false}
      onClick={() => onSelect(role.id)}
    >
      <div className="resume-role-card-collapsed">
        <div className="resume-role-card-collapsed-left">
          <span className="resume-role-icon" aria-hidden="true">+</span>
          <span className="resume-role-title-collapsed">{role.title}</span>
        </div>
        <span className="resume-role-date-collapsed">{role.dateLabel}</span>
      </div>
    </button>
  )
}

function ResumeCompanyGroup({ company, expandedRoleId, onSelectRole }) {
  return (
    <div className="resume-company-group">
      <div className="resume-company-header">
        <img className="resume-company-logo" src={company.logo} alt="" />
        <div>
          <div className="resume-company-name">{company.name}</div>
          <div className="resume-company-meta">
            {company.rangeLabel} · {company.roles.length} role{company.roles.length === 1 ? '' : 's'}
          </div>
        </div>
      </div>
      {company.roles.map(role => (
        <ResumeRoleCard
          key={role.id}
          role={role}
          isExpanded={expandedRoleId === role.id}
          onSelect={onSelectRole}
        />
      ))}
    </div>
  )
}

class ResumeComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = { expandedRoleId: 'zen-sr-plg' }
    this.onSelectRole = this.onSelectRole.bind(this)
  }

  onSelectRole(id) {
    if (id === this.state.expandedRoleId) return
    this.setState({ expandedRoleId: id })
  }

  render() {
    return (
      <div className="resume-page">
        <ResumeHeader />
        {COMPANIES.map(company => (
          <ResumeCompanyGroup
            key={company.id}
            company={company}
            expandedRoleId={this.state.expandedRoleId}
            onSelectRole={this.onSelectRole}
          />
        ))}
      </div>
    )
  }

}

export default ResumeComponent
