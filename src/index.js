import React from 'react'
import ReactDOM from 'react-dom'
import Servers from './components/Servers.js'
import Settings from './components/Settings.js'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      settings: false,
      servers: []
    }
  }

  componentWillMount () {
    ipcRenderer.on('data', (event, arg) => {
      this.setState({
        servers: arg
      })
    })
    ipcRenderer.on('tokens', (event, arg) => {
      console.log(arg)
    })
  }

  show() {
    if (this.state.settings) {
      this.setState({
        settings: false
      })
    }
    else {
      this.setState({
        settings: true
      })
    }
  }

  render () {
    var panel

    if (this.state.settings) {
      panel = <Settings details={{token: 'test', public_key: 'bla'}} />
    }
    else {
      panel = <Servers details={this.state.servers} />
    }
    return (
      <div className="container">
        <div className="box">
          <div className="box-title">{(this.state.settings) ? 'Settings' : 'Processes'}</div>
          <div className="box-close" onClick={() => this.show()}><img src={`assets/${(this.state.settings) ? 'close' : 'settings'}.svg`} /></div>
        </div>
        {panel}
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
