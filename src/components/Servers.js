import React from 'react'
import ReactDOM from 'react-dom'
import Processes from './Processes.js'

var Server = (props) => {
  return (
    <div className="server">
      <div className="server-header">
        <div className="server-header-title">
          <div className="server-header-logo"><img src="assets/server.svg" /></div>
          <div className="server-header-name">{props.details.name}</div>
        </div>
        <div className="server-header-arrow"><img src="assets/arrow.svg" /></div>
      </div>
      <div className="processes">
        <Processes details={props.details.processes} />
      </div>
    </div>
  )
}

class Servers extends React.Component {
  render () {
    const servers = this.props.details.map((server) => (
      <Server key={server.name} details={server} />
    ))
    return (
      <div className="servers">
        {servers}
      </div>
    )
  }
}

export default Servers