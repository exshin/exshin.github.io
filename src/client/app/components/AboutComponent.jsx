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
      <div className="row container justify-content-md-center">
        <div className="col col-md-auto">
          <div className="row">
            <div>
              <p>Hello there!</p>
              <p>My name is Eugene Chinveeraphan, and I'm a Software Engineer in the SF Bay Area.</p>
              <p>Feel free to check out my Resume and Playground!</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default AboutComponent
