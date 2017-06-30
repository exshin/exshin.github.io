import React from 'react'

class AboutComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = { likesCount : 0 }
    this.onLike = this.onLike.bind(this)
  }

  onLike () {
    let newLikesCount = this.state.likesCount + 1
    this.setState({ likesCount: newLikesCount })
  }

  render() {
    return (
      <div className="container">
        <div className="container">
          <img src="./img/portrait.png"></img>
          <div>
            <p>Blah blah blah</p>
          </div>
        </div>
      </div>
    )
  }

}

export default AboutComponent
