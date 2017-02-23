import React from 'react';
import Chart from './Chart.js';

var Probe = (props) => {
  var graph;
  if (props.details.graph) {
    graph = <Chart values={props.details.graph.values} />;
  }
  var units;
  if (props.details.logo === 'bug') {
    units = <img height='25' src={`assets/${props.details.units}`} />;
  } else {
    units = props.details.units;
  }
  return (
    <a href={props.details.url} target='_blank'>
      <div className='probe'>
        <div className='probe-logo'>
          <img src={`assets/${props.details.logo}.svg`} />
        </div>
        <div className='probe-infos'>
          <div className='probe-name'>{props.details.name}</div>
          <div className={`probe-value ${props.details.gradient}Gradient`}>{props.details.value} {units}</div>
        </div>
        {graph}
      </div>
    </a>
  );
};

class Process extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      show: false,
      rotate: true
    };
  }

  showProcess () {
    this.setState({
      show: !this.state.show
    });
    this.setState({
      rotate: !this.state.rotate
    });
  }

  render () {
    var probes;
    if (this.state.show === true) {
      probes = this.props.details.probes.map((probe) => (
        <Probe key={probe.name} details={probe} />
      ));
    }
    return (
      <div className='process'>
        <div className='process-header' onClick={() => this.showProcess()} >
          <div className='process-header-title'>
            <div className='process-header-logo'><img src={`assets/${this.props.details.status}.svg`} /></div>
            <div className='process-header-name'>{this.props.details.name}</div>
          </div>
          <div className={`process-header-arrow ${(this.state.rotate) ? 'rotate' : ''}`}><img src='assets/arrow.svg' /></div>
        </div>
        <div className='probes'>
          {probes}
        </div>
      </div>
    );
  }
}

class Processes extends React.Component {
  render () {
    const processes = this.props.details.map((process) => (
      <Process key={process.name} details={process} />
    ));
    return (
      <div className='processes'>
        {processes}
      </div>
    );
  }
}

export default Processes;
