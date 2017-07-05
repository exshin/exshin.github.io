import React from 'react'

class PokePuzzlerComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      contentView: "Pixel Drawer"
    }
  }

  render() {
    let contentView

    return (
      <div className="container-fluid">
        PokePuzzler Pictures and explanations
      </div>
    )
  }


}

export default PokePuzzlerComponent
