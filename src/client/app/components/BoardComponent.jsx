import React from 'react'

class BoardComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = { boardState: 0 }
    this.onLike = this.onLike.bind(this)
  }

  onNext() {
    let newBoardState = this.state.boardState + 1
    this.setState({ boardState: newBoardState })
  }

  render() {
    return (
      <div>

      </div>
    )
  }

}

export default BoardComponent
