import React from 'react'
import PixelBoardComponent from './PixelDrawings/PixelBoardComponent.jsx'
import TicTacBoardComponent from './TicTacFour/TicTacBoardComponent.jsx'
import PokePuzzlerComponent from './PokePuzzler/PokePuzzlerComponent.jsx'

class PlaygroundComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      contentView: "Pixel Drawer"
    }
    this.switchContentView = this.switchContentView.bind(this)
  }

  switchContentView(content, target) {
    this.setState({ contentView: content })
  }

  render() {
    let contentView, contentDescription, techTag
    if (this.state.contentView === "Pixel Drawer") {
      contentView = <PixelBoardComponent/>
      contentDescription = "I'm planning to create a short animated story with pixel like graphics, and so I built this tool to help create my pixel drawings. I'm planning to add the animation component to it next. As of now, you can save and load your own pixel drawings. Give it a shot!"
      techTag = "Built via React.js"
    } else if (this.state.contentView === "TicTacFour") {
      contentView = <TicTacBoardComponent/>
      contentDescription = "I wanted to build a simple game, but wanted a something a little more complex than just the tictactoe that I thought of. Designing and building this game was fun. It gave me a chance to work on a simple AI and further develop my React skillset."
      techTag = "Built via React.js"
    } else if (this.state.contentView === "PokePuzzler") {
      contentView = <PokePuzzlerComponent/>
        contentDescription = "I'm currently still working on this iOS app. I love match-3 games and was really into Pokemon growing up. Figured it would be fun and educational to try and build a Pokemon Match-3 game from scratch. I've gotten the base game play down (with a few of the iOS animations) and still have a ton more ideas to build!"
        techTag = "Built via Swift3"
    }

    return (
      <div className="container-fluid">
        <div className="outer-board container-fluid">
          <div className="row margin-bottom">
            <p>Welcome to my Playground. This is where I'll keep some of the things I'm tinkering with at the moment. Feel free to check it out!</p>
          </div>
          <div className="row margin-bottom">
            <ul className="nav justify-content-center container-fluid">
              <li className="nav-item">
                <a className={this.state.contentView === "Pixel Drawer" ? "nav-link active underline" : "nav-link"} href="#" onClick={ this.switchContentView.bind(this, "Pixel Drawer") }>Pixel Drawer</a>
              </li>
              <li className="nav-item">
                <a className={this.state.contentView === "TicTacFour" ? "nav-link active underline" : "nav-link"} href="#" onClick={ this.switchContentView.bind(this, "TicTacFour") }>TicTacFour Game</a>
              </li>
              <li className="nav-item">
                <a className={this.state.contentView === "PokePuzzler" ? "nav-link active underline" : "nav-link"} href="#" onClick={ this.switchContentView.bind(this, "PokePuzzler") }>Poke Puzzler</a>
              </li>
            </ul>
          </div>
          <div className="row container">
            <div className="container-fluid">
              <div className="alert alert-info padding-bottom-30" role="alert">
                <h4>{ this.state.contentView }</h4>
                <p className="content-description">{ contentDescription }</p>
                <p className="tech-tag float-right">{ techTag }</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col col align-self-center story-image">
              { contentView }
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default PlaygroundComponent
