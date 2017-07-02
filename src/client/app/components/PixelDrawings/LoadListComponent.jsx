import React from 'react'
import './PictComponent.jsx'

class LoadListComponent extends React.Component {

  constructor(props) {
    super(props)
    this.clickLoad = this.clickLoad.bind(this)
    this.clear = this.clear.bind(this)
    this.renderClearButton = this.renderClearButton.bind(this)
  }

  clickLoad(selected, target) {
    this.props.loadSelected(selected)
  }

  clear() {
    this.props.clearSaved()
  }

  renderClearButton() {
    if (this.props.saveList.length > 0) {
      return (
        <li className="row">
          <button className="btn btn-sm btn-outline-danger" onClick={ this.clear }>
            Clear All Saved Pixel Drawings
          </button>
        </li>
      )
    } else {
      return (
        <div/>
      )
    }
  }

  render() {
    return (
      <div>
        <div className="sm-font margin-bottom">Click to load from the saved pixel drawings below</div>
        <ul className="load-list-ul">
          {this.props.saveList.map((row, i) =>
            <li className="row" key={ row }>
              <button className="btn btn-sm btn-outline-info" onClick={ this.clickLoad.bind(this, row) }>{ row }</button>
            </li>
          )}
          { this.renderClearButton() }
        </ul>
      </div>
    )
  }

}

export default LoadListComponent
