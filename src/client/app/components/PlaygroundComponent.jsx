import React from 'react'
import PixelBoardComponent from './PixelDrawings/PixelBoardComponent.jsx'
import TicTacBoardComponent from './TicTacFour/TicTacBoardComponent.jsx'

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
    let contentView
    if (this.state.contentView === "Pixel Drawer") {
      contentView = <PixelBoardComponent/>
    } else if (this.state.contentView === "TicTacFour") {
      contentView = <TicTacBoardComponent/>
    } else if (this.state.contentView === "Developer") {
      contentView = <DeveloperComponent/>
    } else {
      contentView = <RecruiterComponent/>
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
                <a className={this.state.contentView === "Developer" ? "nav-link active underline" : "nav-link"} href="#" onClick={ this.switchContentView.bind(this, "Developer") }>Link</a>
              </li>
            </ul>
          </div>
          <div className="row">
            <div className="story-image">
              { contentView }
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default PlaygroundComponent
