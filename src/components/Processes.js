import React from 'react'
import ReactDOM from 'react-dom'

var Prob = (props) => {
  var graph;
  if (props.details.graph) {
    graph = (<div className="prob-graph">
              <canvas id={props.details.graph} height="40" className="prob-chart"></canvas>
            </div>)
  }
  return (
    <div className="prob">
      <div className="prob-logo">
        <img src={`assets/${props.details.logo}.svg`} />
      </div>
      <div className="prob-infos">
        <div className="prob-name">{props.details.name}</div>
        <div className={`prob-value ${props.details.gradient}Gradient`}>{props.details.value} {props.details.units}</div>
      </div>
      {graph}
    </div>
  )
}

var Process = (props) => {
  const probs = props.details.probs.map((prob) => {
    var details = {
      logo: prob.logo,
      name: prob.name,
      gradient: prob.gradient,
      value: prob.value,
      units: prob.units
    }
    return (<Prob key={prob.name} details={details} />)
  })
  return (
    <div className="process">
      <div className="process-header">
        <div className="process-header-title">
          <div className="process-header-logo"><img src={`assets/${props.details.status}.svg`} /></div>
          <div className="process-header-name">{props.details.name}</div>
        </div>
        <div className="process-header-arrow"><img src="assets/arrow.svg" /></div>
      </div>
      <div className="probs">
        {probs}
      </div>
    </div>
  )
}

class Processes extends React.Component {
  render () {
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