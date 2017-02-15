import React from 'react'
import ReactDOM from 'react-dom'

class Settings extends React.Component {
  render () {
    return (
      <div className="settings">
        <div className="logo">
          <img src="assets/logo-white_Keymetrics@2x.png" />
        </div>
        <div className="text">
          To get token and public_key, visit <a href="https://app.keymetrics.io/" target="_blank">Keymetrics</a>
        </div>
        <div className="form">
          <input type="text" placeholder="token" defaultValue={this.props.details.token} /><br />
          <input type="text" placeholder="public_key" defaultValue={this.props.details.public_key} /><br />
          <button>SAVE</button>
        </div>
        <div className="quit">
          DISCONNECT
        </div>
      </div>
    )
  }
}

export default Settings