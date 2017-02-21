import React from 'react'
import ReactDOM from 'react-dom'
import Chart from './Chart.js'

var Probe = (props) => {
  var graph;
  if (props.details.graph) {
    graph = <Chart values={props.details.graph.values} />
  }
  var units
  if (props.details.logo === 'bug') {
    units = <img height="25" src={`assets/${props.details.units}`} />
  }
  else {
    units = props.details.units
  }
  return (
    <div className="probe">
      <div className="probe-logo">
        <img src={`assets/${props.details.logo}.svg`} />
      </div>
      <div className="probe-infos">
        <div className="probe-name">{props.details.name}</div>
        <div className={`probe-value ${props.details.gradient}Gradient`}>{props.details.value} {units}</div>
      </div>
      {graph}
    </div>
  )
}

var Process = (props) => {
  const probes = props.details.probes.map((probe) => (
    <Probe key={probe.name} details={probe} />
  ))
  return (
    <div className="process">
      <div className="process-header">
        <div className="process-header-title">
          <div className="process-header-logo"><img src={`assets/${props.details.status}.svg`} /></div>
          <div className="process-header-name">{props.details.name}</div>
        </div>
        <div className="process-header-arrow"><img src="assets/arrow.svg" /></div>
      </div>
      <div className="probes">
        {probes}
      </div>
    </div>
  )
}

class Processes extends React.Component {
  render() {
    const processes = this.props.details.map((process) => (
      <Process key={process.name} details={process} />
    ))
    return (
      <div className="processes">
        {processes}
      </div>
    )
  }
}

export default Processes