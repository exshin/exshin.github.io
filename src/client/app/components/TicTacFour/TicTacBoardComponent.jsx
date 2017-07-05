import React from 'react'
import TicTacComponent from './TicTacComponent.jsx'

class TicTacBoardComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      rows: [1,2,3,4],
      cols: [1,2,3,4],
      playerMoves: [],
      aiMoves: [],
      winner: "",
      message: ""
    }
    this.clickAdd = this.clickAdd.bind(this)
    this.aiTurn = this.aiTurn.bind(this)
    this.checkLines = this.checkLines.bind(this)
    this.win = this.win.bind(this)
    this.startNewGame = this.startNewGame.bind(this)
  }

  clickAdd(position) {
    let currentBoard = this.state.playerMoves
    let totalBoard = currentBoard.concat(this.state.aiMoves)
    let index = totalBoard.indexOf(position)

    if (index === -1 && winner === "") {
      currentBoard.push(position)
      this.setState({ playerMoves: currentBoard }, function() {
        this.aiTurn(0.9)
      })
    }
  }

  aiTurn(difficultyLevel) {
    let currentAiBoard = this.state.aiMoves
    let currentPlayerBoard = this.state.playerMoves
    var nextAiMove = ""
    var message = ""

    // unfilled are all the potential next moves for the AI
    let filled = currentAiBoard.concat(currentPlayerBoard) // Array of Strings
    let possible = [11, 12, 13, 14, 21, 22, 23, 24, 31, 32, 33, 34, 41, 42, 43, 44]
    let unfilled = possible.filter(function(x) { return filled.indexOf(String(x)) < 0 })

    let { potentialLines: playerPotentialLines, win: playerWin } = this.checkLines(currentPlayerBoard, currentAiBoard, "player")
    let { potentialLines: aiPotentialLines, win: aiWin } = this.checkLines(currentAiBoard, currentPlayerBoard, "ai")

    if (aiWin) {
      nextAiMove = String(aiPotentialLines[0].line[0])
      message = `AI makes it's move! ${nextAiMove}`
      console.log(aiPotentialLines)
    } else if (Math.random() < difficultyLevel) {
      for (var p = 0; p < 2; p++ ) {
        let potentialLines = [playerPotentialLines, aiPotentialLines][p]

        if (potentialLines.length > 0) {
          var { line, count } = potentialLines[Math.floor(Math.random() * potentialLines.length)]
          nextAiMove = String(line[Math.floor(Math.random() * line.length)])
          message = `AI makes it's move! ${nextAiMove}`
          break
        }
      }
    }

    if (nextAiMove === "") {
      nextAiMove = String(unfilled[Math.floor(Math.random() * unfilled.length)])
      message = `AI makes it's move! ${nextAiMove}`
    }

    if (playerWin) {
      message = "Congratulations! You Win!"
      this.win("player")
    } else  {
      // Tie. End Game
      if (unfilled.length <= 1) {
        message = "It's a tie!"
        this.win("tie")
      }
      if (aiWin) {
        message = "AI Wins!"
        this.win("ai")
      }
      currentAiBoard.push(nextAiMove)
      console.log(nextAiMove)
      this.setState({ aiMoves: currentAiBoard }, function() {
        this.setState({ message })
      })

    }
  }

  checkLines(currentBoard, otherBoard, player) {
    var maxLength = 0
    var potentialLines = []
    var win = false

    let allLines = [
      [11, 12, 13, 14],
      [21, 22, 23, 24],
      [31, 32, 33, 34],
      [41, 42, 43, 44],
      [11, 21, 31, 41],
      [12, 22, 32, 42],
      [13, 23, 33, 43],
      [14, 24, 34, 44],
      [11, 22, 33, 44],
      [14, 23, 32, 41]
    ]

    for (var i = 0; i < allLines.length; i++) {
      let line = allLines[i]
      var markCount = 0
      var otherCount = 0
      var potentialLine = []

      for (var j = 0; j < line.length; j++) {
        let number = line[j]
        var addToPotentialLine = true

        if (currentBoard.indexOf(String(number)) > -1) {
          // There is a mark in the current line
          markCount += 1
          addToPotentialLine = false
        } else if (otherBoard.indexOf(String(number)) > -1) {
          // Check if other player mark exists in the line
          otherCount += 1
          addToPotentialLine = false
        }

        if (addToPotentialLine) {
          potentialLine.push(number)
        }
      }

      if (markCount === 4 && player === "player") {
        // Tic Tac Four! Declare player winner
        win = true
      } else if (markCount >= 3 && otherCount === 0 && player === "ai") {
        // Declare AI winner
        win = true
        potentialLines = [{ line: potentialLine, count: markCount }]
        console.log(potentialLine)
      } else {
        if (markCount > maxLength && otherCount === 0 && win === false) {
          maxLength = markCount
          potentialLines = [{ line: potentialLine, count: markCount }]
        } else if (markCount > 0 && markCount === maxLength && otherCount === 0) {
          potentialLines.push({ line: potentialLine, count: markCount })
        }
      }
    }

    return { potentialLines, win }
  }

  win(winner) {
    // Game ends
    this.setState({ winner })
    console.log(`WINNER! ${winner} !!!`)
  }

  startNewGame() {
    this.setState({
      playerMoves: [],
      aiMoves: [],
      winner: "",
      message: ""
    })
  }

  render() {
    let gameEnd = this.state.winner === "" ? false : true
    return (
      <div className="container-fluid">
        {gameEnd === true &&
          <div className="container-fluid">
            <button className="btn btn-outline-primary btn-sm" onClick={ this.startNewGame }>Start New Game</button>
          </div>
        }
        <div className="tictac-outer-board container-fluid border">
          <div className="tictac-board container-fluid">
            {this.state.rows.map((row, i) =>
              <div className="row tictac-board-row" key={ i } id={ String(i) }>
                {this.state.cols.map((col, j) =>
                  <div className="col tictac-board-col" key={ j } id={ String(j) }>
                    <TicTacComponent player={ this.state.playerMoves.indexOf(String(row)+String(col)) } ai={ this.state.aiMoves.indexOf(String(row)+String(col)) } clickAdd={ this.clickAdd } i={ row } j={ col }/>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <p>{ this.state.message }</p>
      </div>
    )
  }

}

export default TicTacBoardComponent
