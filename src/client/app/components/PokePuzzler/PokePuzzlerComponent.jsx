import React from 'react'

class PokePuzzlerComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      contentView: "Poke Puzzler"
    }
  }

  render() {
    let contentView

    return (
      <div className="container-fluid">
        <div className="pokepuzzler-img float-left">
          Select your Pokemon. This screen is a placeholder for when I finish the "Your Pokemon" Collections view.
          <img className="rounded img-fluid pp-img" src="./src/client/img/pp_select.png"></img>
        </div>
        <div className="pokepuzzler-img float-left">
          Battle Start! We start the battle with random energy tiles based on your Pokemon's 3 skill moves.
          <img className="rounded img-fluid pp-img" src="./src/client/img/pp_battle_start.png"></img>
        </div>
        <div className="pokepuzzler-img float-left">
          Made a match. Charmander gets 3 moves to make matches per turn (dependent on your speed and evolution tier).
          <img className="rounded img-fluid pp-img" src="./src/client/img/pp_moved.png"></img>
        </div>
        <div className="pokepuzzler-img float-left">
          During the opponent's turn, they collect energy and use their moves if they have enough energy to. Then it is our turn again!
          <img className="rounded img-fluid pp-img" src="./src/client/img/pp_your_turn.png"></img>
        </div>
        <div className="pokepuzzler-img float-left">
          Used Ember. We collected enough of the fire energy on the board to use this move. It does damage AND destroys random tiles on the board.
          <img className="rounded img-fluid pp-img" src="./src/client/img/pp_ember.png"></img>
        </div>
        <div className="pokepuzzler-img float-left">
          We won the fight! We collect in-game currency and experience which will level our Pokemon. This screen will also get a facelift later.
          <img className="rounded img-fluid pp-img" src="./src/client/img/pp_battle_won.png"></img>
        </div>
      </div>
    )
  }


}

export default PokePuzzlerComponent
