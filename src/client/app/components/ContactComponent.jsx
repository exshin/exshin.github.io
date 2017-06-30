import React from 'react'

class ContactComponent extends React.Component {

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
        <h3>Contact</h3>
      </div>
    )
  }

}

export default ContactComponent
