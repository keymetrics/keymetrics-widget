import React from 'react'
import ReactDOM from 'react-dom'
import Servers from './components/Servers.js'
import Settings from './components/Settings.js'

ipcRenderer.on('data', (event, arg) => {
  //console.log('test')
})

class App extends React.Component {
  render () {
    var servers = [
      {
        name: 'Jimi',
        processes: [
          {
            status: 'offline',
            name: 'App',
            probs: [
              {
                logo: 'cpu',
                name: 'CPU',
                gradient: 'red',
                value: '0',
                units: '%'
              },
              {
                logo: 'memory',
                name: 'MEM',
                gradient: 'green',
                value: '0',
                units: 'MB'
              }
            ]
          },
          {
            status: 'online',
            name: 'Test',
            probs: [
              {
                logo: 'cpu',
                name: 'CPU',
                gradient: 'green',
                value: '14',
                units: '%'
              },
              {
                logo: 'memory',
                name: 'MEM',
                gradient: 'green',
                value: '87',
                units: 'MB'
              }
            ]
          }
        ]
      },
      {
        name: 'Scaleway',
        processes: [
          {
            status: 'offline',
            name: 'App',
            probs: [
              {
                logo: 'cpu',
                name: 'CPU',
                gradient: 'green',
                value: '0',
                units: '%'
              },
              {
                logo: 'memory',
                name: 'MEM',
                gradient: 'green',
                value: '0',
                units: 'MB'
              }
            ]
          },
          {
            status: 'online',
            name: 'Test',
            probs: [
              {
                logo: 'cpu',
                name: 'CPU',
                gradient: 'green',
                value: '14',
                units: '%'
              },
              {
                logo: 'memory',
                name: 'MEM',
                gradient: 'green',
                value: '87',
                units: 'MB'
              }
            ]
          }
        ]
      }
    ]
    var panel
    var setting = false
    if (setting) {
      panel = <Servers details={servers} />
    }
    else {
      panel = <Settings details={{token: 'test', public_key: 'bla'}} />
    }
    return (
      <div className="container">
        <div className="box">
          <div className="box-title">Processes</div>
          <div className="box-close"><img src="assets/settings.svg" /></div>
        </div>
        {panel}
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
