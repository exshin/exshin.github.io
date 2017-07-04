import React from 'react'
import PictComponent from './PictComponent.jsx'
import LoadListComponent from './LoadListComponent.jsx'

class PixelBoardComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      mouseDownState: false,
      filler: true,
      rows: Array.from(Array(20).keys()),
      cols: Array.from(Array(30).keys()),
      boardFill: [],
      saveList: this.loadDefaultSaves()
    }
    this.save = this.save.bind(this)
    this.reset = this.reset.bind(this)
    this.clickAdd = this.clickAdd.bind(this)
    this.setMouseDownState = this.setMouseDownState.bind(this)
    this.loadSelected = this.loadSelected.bind(this)
    this.clearSaved = this.clearSaved.bind(this)
  }

  save() {
    let date = new Date().toString()
    let saveListString = localStorage.getItem("pixel-drawings-echinveeraphan")

    localStorage.setItem(date, this.state.boardFill)
    if (saveListString) {
      let saveList = saveListString.split(",")
      saveList.push(date)
      localStorage.setItem("pixel-drawings-echinveeraphan", saveList)
      this.setState({ saveList })
    } else {
      localStorage.setItem("pixel-drawings-echinveeraphan", [date])
      this.setState({ saveList: [date] })
    }
  }

  reset() {
    this.setState({ boardFill: [] })
  }

  loadDefaultSaves() {
    let saveListString = localStorage.getItem("pixel-drawings-echinveeraphan")
    if (saveListString) {
      let saveList = saveListString.split(",")
      return saveList
    } else {
      // No saves, tell user
      return []
    }
  }

  loadSelected(selected) {
    let index = this.state.saveList.indexOf(selected)
    if (index > -1) {
      let savedBoardString = localStorage.getItem(selected)
      let savedBoard = savedBoardString.split(",")
      this.setState({ boardFill: savedBoard })
    } else {
      console.log("Error. Can't find selected save: " + selected)
    }
  }

  clearSaved() {
    this.state.saveList.forEach(function(saveName) {
      localStorage.removeItem(saveName)
    })
    localStorage.removeItem("pixel-drawings-echinveeraphan")
    this.setState({ saveList: [] })
  }

  clickAdd(helperNumber, clickFill) {
    let currentBoard = this.state.boardFill
    let index = currentBoard.indexOf(helperNumber)

    if (clickFill) {
      if (index === -1) {
        currentBoard.push(helperNumber)
        this.setState({ filler: true })
      }
    } else {
      if (index > -1) {
        currentBoard.splice(index, 1)
      }
      this.setState({ filler: false })
    }

    this.setState({ boardFill: currentBoard })
  }

  setMouseDownState(mouseDownState) {
    this.setState({ mouseDownState })
  }

  render() {
    let storyState = this.props.storyState
    return (
      <div className="container-fluid">
        <div className="outer-board container-fluid border">
          <div className="board container-fluid">
            {this.state.rows.map((row, i) =>
              <div className="row board-row" key={ i } id={ String(i) }>
                {this.state.cols.map((col, j) =>
                  <div className="col board-col" key={ j } id={ String(j) }>
                    <PictComponent on={ this.state.boardFill.indexOf(String(i)+'.'+String(j)) } i={ i } j={ j } clickAdd={ this.clickAdd } setMouseDownState={ this.setMouseDownState } mouseDownState={ this.state.mouseDownState } filler={ this.state.filler }/>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="outer-board container-fluid">
          <div className="container pixel-buttons">
            <button type="button" className="btn btn-outline-primary btn-sm btn-pixel" onClick={ this.save }>
              Save
            </button>
            <button type="button" className="btn btn-outline-warning btn-sm btn-pixel" onClick={ this.reset }>
              Reset
            </button>
            <div className="load-list">
              <LoadListComponent saveList={ this.state.saveList } loadSelected={ this.loadSelected } clearSaved={ this.clearSaved }/>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default PixelBoardComponent
