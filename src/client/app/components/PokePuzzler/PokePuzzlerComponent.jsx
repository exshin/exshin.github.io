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

        <div className="row padding-bottom-30">
          <div className="col-4 pp-col">
            <div className="card pp-card">
              <img className="card-img-top pp-img" src="./src/client/img/pp_select.PNG"></img>
              <div className="card-block pp-text-block">
                <p className="card-text pp-text">Select your Pokemon. This screen is a placeholder for when I finish the "Your Pokemon" Collections view.</p>
              </div>
            </div>
          </div>
          <div className="col-4 pp-col">
            <div className="card pp-card">
              <img className="card-img-top pp-img" src="./src/client/img/pp_battle_start.PNG"></img>
              <div className="card-block pp-text-block">
                <p className="card-text pp-text">Battle Start! We start the battle with random energy tiles based on your Pokemon's 3 skill moves.</p>
              </div>
            </div>
          </div>
          <div className="col-4 pp-col">
            <div className="card pp-card">
              <img className="card-img-top pp-img" src="./src/client/img/pp_moved.PNG"></img>
              <div className="card-block pp-text-block">
                <p className="card-text pp-text">Made a match. Charmander gets 3 moves to make matches per turn, based on your speed and evolution tier.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-4 pp-col">
            <div className="card pp-card">
              <img className="card-img-top pp-img" src="./src/client/img/pp_your_turn.PNG"></img>
              <div className="card-block pp-text-block">
                <p className="card-text pp-text">During the opponent's turn, they collect energy and use their moves if they have enough energy to. Then it is our turn again!</p>
              </div>
            </div>
          </div>
          <div className="col-4 pp-col">
            <div className="card pp-card">
              <img className="card-img-top pp-img" src="./src/client/img/pp_ember.PNG"></img>
              <div className="card-block pp-text-block">
                <p className="card-text pp-text">Used Ember. We collected enough of the fire energy on the board to use this move. It does damage AND destroys random tiles on the board.</p>
              </div>
            </div>
          </div>
          <div className="col-4 pp-col">
            <div className="card pp-card">
              <img className="card-img-top pp-img" src="./src/client/img/pp_battle_won.PNG"></img>
              <div className="card-block pp-text-block">
                <p className="card-text pp-text">We won the fight! We collect in-game currency and experience which will level our Pokemon. This screen will also get a facelift later.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }


}

export default PokePuzzlerComponent
