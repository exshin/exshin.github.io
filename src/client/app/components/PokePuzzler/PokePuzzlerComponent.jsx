import React from 'react'

class PokePuzzlerComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      contentView: "Poke Puzzler",
      pp_src_string: "./src/client/img/",
      pp_images: ["pp_select.PNG", "pp_battle_start.PNG", "pp_moved.PNG", "pp_your_turn.PNG", "pp_ember.PNG", "pp_battle_won.PNG"],
      pp_texts: [
        "Select your Pokemon. This screen is a placeholder for when I finish the 'Your Pokemon' Collections view.",
        "Battle Start! We start the battle with random energy tiles based on your Pokemon's 3 skill moves.",
        "Made a match. Charmander gets 3 moves to make matches per turn, based on your speed and evolution tier. Each match generates energy to use our powerful moves!",
        "During the opponent's turn, they collect energy and use their moves if they have enough energy to. Then it is our turn again!",
        "We used 'Ember'. We had collected enough of the fire energy on the board to use this move. It does damage AND destroys random tiles on the board.",
        "We won the fight! We collect in-game currency and experience which will level our Pokemon. This screen will also get a facelift later."
      ],
      viewState: 0
    }
    this.clickNext = this.clickNext.bind(this)
  }

  clickNext() {
    let currentViewState = this.state.viewState < 5 ? this.state.viewState + 1 : 0
    this.setState({ viewState: currentViewState })
  }

  render() {
    let contentView
    let { pp_src_string, pp_images, viewState, pp_texts } = this.state
    let currentImage = pp_src_string + pp_images[viewState]
    let currentText = pp_texts[viewState]
    let buttonText = viewState === 5 ? "Restart" : "Next"

    return (
      <div className="container-fluid">
        <div className="container row">
          <div className="col-6">
            <img className="rounded pp-img" src={ currentImage }></img>
          </div>

          <div className="col-6">
            <div className="row">
              <div className="container padding-bottom-30">
                <div className="float-right">
                  <button className="btn btn-outline-primary btn-sm" onClick={ this.clickNext }>
                    { buttonText } <i className="fa fa-angle-right" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="row container">
              <div className="pp-text-block">
                <p className="pp-text">{ currentText }</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }


}

export default PokePuzzlerComponent
