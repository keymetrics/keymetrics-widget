import React from 'react';

class Settings extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      info: ' ',
      token: this.props.details.token,
      public_key: this.props.details.public_key
    };
  }

  quit () {
    ipcRenderer.send('quit', {});
  }

  save () {
    if (this.state.token.length === 64 && this.state.public_key.length === 15) {
      ipcRenderer.send('saveSettings', {
        token: this.state.token,
        public_key: this.state.public_key
      });
      this.setState({
        info: 'Saved !'
      });
    } else {
      this.setState({
        info: 'Wrong token or public_key'
      });
    }
  }

  handleToken (event) {
    this.setState({token: event.target.value});
  }

  handleKey (event) {
    this.setState({public_key: event.target.value});
  }

  render () {
    return (
      <div className='settings'>
        <div className='logo'>
          <img src='assets/logo-white_Keymetrics@2x.png' />
        </div>
        <div className='text'>
          To get token and public_key, visit <a href='https://app.keymetrics.io/' target='_blank'>Keymetrics</a>
        </div>
        <div className='text'>
          {this.state.info}
        </div>
        <div className='form'>
          <input type='text' placeholder='token' defaultValue={this.props.details.token} onChange={(event) => this.handleToken(event)} /><br />
          <input type='text' placeholder='public_key' defaultValue={this.props.details.public_key} onChange={(event) => this.handleKey(event)} /><br />
          <button onClick={() => this.save()}>SAVE</button>
        </div>
        <div className='quit' onClick={() => this.quit()}>
          DISCONNECT
        </div>
      </div>
    );
  }
}

export default Settings;
