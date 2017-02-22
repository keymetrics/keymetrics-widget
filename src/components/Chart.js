import React from 'react'
import ReactDOM from 'react-dom'
import {Line} from 'react-chartjs-2'

class Chart extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const data = {
      labels: ['', '', '', '', '', '', '', '', '', '', '', ''],
      datasets: [
        {
          data: this.props.values,
          type: 'line',
          lineTension: 0,
          borderWidth: 1,
          pointRadius: 0,
          fill: false,
          borderColor: '#26e089'
        }
      ]
    }
    const options = {
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          display: false
        }],
        yAxes: [{
          display: false,
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
    return (
      <div className="probe-graph">
        <Line data={data} options={options} width={100} height={20} />
      </div>
    )
  }
}

export default Chart