import React from 'react'

class TicTacComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      turn: "player"
    }
    this.playerMove = this.playerMove.bind(this)
  }

  playerMove() {
    let position = String(this.props.i) + String(this.props.j)
    this.props.clickAdd(position)
  }

  render() {
    let moveMark
    if (this.props.player > -1) {
      moveMark =  "O"
    } else if (this.props.ai > -1) {
      moveMark = "X"
    } else {
      moveMark = ""
    }

    return (
      <div className="empty-square" onClick={ this.playerMove }>
        <div className="tic-tac-move-marker">
          { moveMark }
        </div>
      </div>
    )
  }

}

export default TicTacComponent
