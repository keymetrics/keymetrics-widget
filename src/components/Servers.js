import React from 'react';
import Processes from './Processes.js';

class Server extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      show: false,
      rotate: true
    };
  }

  showServer () {
    this.setState({
      show: !this.state.show
    });
    this.setState({
      rotate: !this.state.rotate
    });
  }

  render () {
    var processes;
    if (this.state.show === true) {
      processes = <Processes details={this.props.details.processes} />;
    }
    return (
      <div className='server'>
        <div className='server-header' onClick={() => this.showServer()}>
          <div className='server-header-title'>
            <div className='server-header-logo'><img src='assets/server.svg' /></div>
            <div className='server-header-name'>{this.props.details.name}</div>
          </div>
          <div className={`process-header-arrow ${(this.state.rotate) ? 'rotate' : ''}`}><img src='assets/arrow.svg' /></div>
        </div>
        {processes}
      </div>
    );
  }
}

class Servers extends React.Component {
  render () {
    const servers = this.props.details.map((server) => (
      <Server key={server.name} details={server} />
    ));
    return (
      <div className='servers'>
        {servers}
      </div>
    );
  }
}

export default Servers;
