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
    let markerClass
    if (this.props.player > -1) {
      moveMark =  "O"
      markerClass = "container tic-tac-move-marker color-steelblue"
    } else if (this.props.ai > -1) {
      moveMark = "X"
      markerClass = "container tic-tac-move-marker color-indianred"
    } else {
      moveMark = ""
    }

    return (
      <div className="empty-square" onClick={ this.playerMove }>
        <div className={ markerClass }>
          { moveMark }
        </div>
      </div>
    )
  }

}

export default TicTacComponent
