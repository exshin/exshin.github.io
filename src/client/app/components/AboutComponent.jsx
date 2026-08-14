import React from 'react'

/* Straight into the work. Deep links, so these survive being pasted anywhere. */
const START_HERE = [
  {
    href: '#experience',
    label: 'Experience',
    blurb: 'Nine years at Zendesk across billing, payments and platform integrations.',
    accent: '#4a90d9',
  },
  {
    href: '#playground/wordblok',
    label: 'WordBloks',
    blurb: 'A word puzzle I built in SwiftUI and shipped to the App Store.',
    accent: '#F2C200',
  },
  {
    href: '#playground/activity-finder',
    label: 'Activity Finder',
    blurb: 'Plain English search over 20,900 Bay Area classes, camps and clubs.',
    accent: '#2f6f5e',
  },
]

class AboutComponent extends React.Component {
  render() {
    return (
      <div className="about-hero">
        <img
          src="./img/hike_sunrise_dust.jpg"
          className="about-hero-img"
          alt="Fog rolling over the Bay Area hills at sunrise"
          width="1600"
          height="560"
        />
        <div className="about-content">
          <h1 className="about-name">Eugene Chinveeraphan</h1>
          <p className="about-role">Senior Software Engineer · San Francisco</p>

          <p className="about-bio">
            I work on the systems that move money. For the last nine years that has been
            Zendesk, across billing, payments and platform integrations. Most recently I
            architected an order processing service that creates orders in under five seconds
            at a thousand a minute, and pulled usage payments out of the billing monolith into
            a service of its own.
          </p>
          <p className="about-bio">
            On my own time I build things end to end, which is where I get to do the parts a
            large company splits across four teams. I design them, write them, and ship them.
            Two of those are on this site with writeups of how they work and what I got wrong.
          </p>

          <div className="about-start">
            <div className="about-start-label">Start here</div>
            <div className="about-start-grid">
              {START_HERE.map(item => (
                <a
                  key={item.href}
                  className="about-start-card"
                  href={item.href}
                  style={{ '--card-accent': item.accent }}
                >
                  <span className="about-start-card-label">{item.label}</span>
                  <span className="about-start-card-blurb">{item.blurb}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AboutComponent
