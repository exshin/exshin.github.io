import React from 'react'

class ContactComponent extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-4">
            <img className="portrait" src="./img/portrait.png"></img>
          </div>
          <div className="col-8">
            <div className="row">
              Linkedin
            </div>
            <div className="row">
              Twitter
            </div>
            <div className="row">
              Email
            </div>
          </div>
        </div>


      </div>
    )
  }

}

export default ContactComponent
