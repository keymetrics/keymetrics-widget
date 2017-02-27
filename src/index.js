import React from 'react';
import ReactDOM from 'react-dom';
import Servers from './components/Servers.js';
import Settings from './components/Settings.js';

class App extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      config: {},
      settings: false,
      servers: []
    };
  }

  componentWillMount () {
    ipcRenderer.on('data', (event, arg) => {
      this.setState({
        servers: arg
      });
    });
    ipcRenderer.on('tokens', (event, arg) => {
      if (!arg || !arg.token || !arg.public_key) {
        this.setState({
          settings: true
        });
      } else {
        this.setState({
          config: {
            token: arg.token,
            public_key: arg.public_key
          },
          settings: false
        });
      }
    });
  }

  show () {
    this.setState({
      settings: !this.state.settings
    });
  }

  render () {
    var panel;

    if (this.state.settings) {
      panel = <Settings details={this.state.config} />;
    } else {
      panel = <Servers details={this.state.servers} />;
    }
    return (
      <div className='container'>
        <div className='box'>
          <div className='box-title'>{(this.state.settings) ? 'Settings' : 'Processes'}</div>
          <div className='box-close' onClick={() => this.show()}><img src={`assets/${(this.state.settings) ? 'close' : 'settings'}.svg`} /></div>
        </div>
        {panel}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
