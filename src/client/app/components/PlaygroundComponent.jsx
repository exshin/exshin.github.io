import React from 'react'
import SomniaComponent from './Somnia/SomniaComponent.jsx'
import PixelBoardComponent from './PixelDrawings/PixelBoardComponent.jsx'
import TicTacBoardComponent from './TicTacFour/TicTacBoardComponent.jsx'
import PokePuzzlerComponent from './PokePuzzler/PokePuzzlerComponent.jsx'

class PlaygroundComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      contentView: "Somnia"
    }
    this.switchContentView = this.switchContentView.bind(this)
  }

  switchContentView(content, target) {
    this.setState({ contentView: content })
  }

  render() {
    let contentView, contentDescription, techTag, projectColor, title
    if (this.state.contentView === "Somnia") {
      contentView = <SomniaComponent/>
      title = "Somnia"
      contentDescription = "Somnia is a turn-based match-3 RPG I'm building for iOS. You travel through dreamscapes with a team of \"Reveries\" — ethereal creatures tied to elements like fire, water, air, light, and dusk — and battle by chaining tiles on a puzzle board to power their skills. Areas branch into nodes (combat, dialogue, rest, hidden rooms), so each run threads exploration, story beats, and team-building together."
      techTag = "Built via SwiftUI"
      projectColor = "#7a5cd6"
    } else if (this.state.contentView === "Pixel Drawer") {
      contentView = <PixelBoardComponent/>
      title = "Pixel Drawer"
      contentDescription = "I'm planning to create a short animated story with pixel like graphics, and so I built this tool to help create my pixel drawings. I'm planning to add the animation component to it next. As of now, you can save and load your own pixel drawings. Give it a shot!"
      techTag = "Built via React.js"
      projectColor = "#4a90d9"
    } else if (this.state.contentView === "TicTacFour") {
      contentView = <TicTacBoardComponent/>
      title = "TicTacFour"
      contentDescription = "I wanted to build a simple game, but wanted a something a little more complex than just the tictactoe that I thought of. Designing and building this game was fun. It gave me a chance to work on a simple AI and further develop my React skillset."
      techTag = "Built via React.js"
      projectColor = "#5cb85c"
    } else if (this.state.contentView === "PokePuzzler") {
      contentView = <PokePuzzlerComponent/>
      title = "Poke Puzzler (deprecated)"
      contentDescription = "No longer actively working on this one — keeping it up as an archive. The original idea was a Pokemon-inspired Match-3 iOS game: I love match-3 games and was really into Pokemon growing up, so I built the base gameplay loop and a few iOS animations from scratch before shelving it."
      techTag = "Built via Swift3 · deprecated"
      projectColor = "#999999"
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
                <a className={this.state.contentView === "Somnia" ? "nav-link active underline" : "nav-link"} href="#" onClick={ this.switchContentView.bind(this, "Somnia") }>Somnia</a>
              </li>
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
              <div className="playground-card" style={{ '--project-color': projectColor }}>
                <h4>{ title }</h4>
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
