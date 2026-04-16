import React from 'react'

class AboutComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = { btnChange: false, btnText: "No", storyTime: false }
    this.storyTime = this.storyTime.bind(this)
    this.yesAnyways = this.yesAnyways.bind(this)
    this.changeBack = this.changeBack.bind(this)
  }

  storyTime() {
    this.setState({ storyTime: true })
  }

  yesAnyways() {
    this.setState({ btnChange: true, btnText: "Yesssss" })
  }

  changeBack() {
    this.setState({ btnChange: false, btnText: "No" })
  }

  render() {
    return (
      <div className="about-hero">
        <img src="./img/hike_sunrise_dust.jpg" className="about-hero-img"></img>
        <div className="about-content">
          <h1 className="about-name">Eugene Chinveeraphan</h1>
          <p className="about-role">Senior Software Engineer · San Francisco</p>
          <p className="about-bio">Feel free to check out my Experience and Playground!</p>
        </div>
      </div>
    )
  }

}

export default AboutComponent
