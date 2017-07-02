import React from 'react'
import BoardComponent from './PixelDrawings/BoardComponent.jsx'

class PlaygroundComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      test: true
    }
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="outer-board container-fluid">
          <div className="row">
            Pixel Drawer
          </div>
          <div className="row">
            <div className="story-image">
              <BoardComponent />
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default PlaygroundComponent
