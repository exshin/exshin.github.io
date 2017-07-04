import React from 'react'

class PictComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      clickFill: false
    }
    this.addToBoardFill = this.addToBoardFill.bind(this)
  }

  addToBoardFill(mouseState, target) {
    if (mouseState === "mouseDown") {
      let helperNumber = String(this.props.i)+'.'+String(this.props.j)
      this.props.clickAdd(helperNumber, !this.state.clickFill)
      this.setState({ clickFill: !this.state.clickFill })
      this.props.setMouseDownState(true)
    }
    if (mouseState === "mouseOver" && this.props.mouseDownState) {
      let filler = this.props.filler ? true : false
      let helperNumber = String(this.props.i)+'.'+String(this.props.j)
      this.props.clickAdd(helperNumber, filler)
      this.setState({ clickFill: filler })
    }
    if (mouseState === "mouseUp") {
      this.props.setMouseDownState(false)
    }
  }

  render() {
    let square = this.props.on > -1 ? "black-square" : "white-square"
    return (
      <div className={ square } onMouseDown={ this.addToBoardFill.bind(this, "mouseDown") } onMouseUp={ this.addToBoardFill.bind(this, "mouseUp") } onMouseOver={ this.addToBoardFill.bind(this, "mouseOver") }>

      </div>
    )
  }

}

export default PictComponent
