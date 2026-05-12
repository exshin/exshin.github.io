import React from 'react'

class SomniaComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      somnia_src_string: "./img/",
      somnia_images: ["somnia_battle.png", "somnia_veilith.png", "somnia_map.png", "somnia_sable.png"],
      somnia_texts: [
        "Battle in motion. Combat is a tile-matching puzzle: drag energy tiles to fuel each Reverie's skills. Every element (fire, water, air, light, dusk) powers a different move on your active team.",
        "Meet your Reveries. Each companion has its own role (here, Veilith — a Dusk debuffer), unlockable battle skills, passives, and artifacts that you swap in and out as you build a team.",
        "Explore a dreamscape. Areas like the Ancient Stone Forest branch into nodes — battles, dialogue, rest stops, and hidden rooms — letting you shape each run through the world.",
        "A story between fights. Reveries are framed by narrative beats with characters like Sable, with dialogue and choices woven between combat encounters."
      ],
      viewState: 0
    }
    this.clickNext = this.clickNext.bind(this)
  }

  clickNext() {
    let lastIndex = this.state.somnia_images.length - 1
    let currentViewState = this.state.viewState < lastIndex ? this.state.viewState + 1 : 0
    this.setState({ viewState: currentViewState })
  }

  render() {
    let { somnia_src_string, somnia_images, somnia_texts, viewState } = this.state
    let currentImage = somnia_src_string + somnia_images[viewState]
    let currentText = somnia_texts[viewState]
    let buttonText = viewState === somnia_images.length - 1 ? "Restart" : "Next"

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

export default SomniaComponent
