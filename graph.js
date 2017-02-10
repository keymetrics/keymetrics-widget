var myChart
ready(() => {
    var ctx = document.getElementById("myChart");
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    type: 'line',
                    lineTension: 0,
                    borderWidth: 1,
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            linearGradientLine: true,
            legend: {
              display: false
            },
            scales: {
                xAxes: [{
                    display: false,
                    ticks: {}
                }],
                yAxes: [{
                    display: false,
                    ticks: {
                        beginAtZero: true,
                        max: 100
                    }
                }]
            }
        }
    });

    setInterval(() => {
        if (myChart.data.datasets[0].data.length > 11) {
            myChart.data.datasets[0].data.shift();
            myChart.data.labels.shift();
        }
        myChart.data.datasets[0].data.push(Math.random() * 100);
        myChart.data.labels.push(Math.floor(new Date()));
        myChart.options.scales.xAxes[0].ticks.min = myChart.data.labels[myChart.data.labels.length - 10];
        myChart.options.scales.xAxes[0].ticks.max = Math.floor(new Date());
        myChart.update();
    }, 1000)



    var gradientLinePlugin = {
      // Called at start of update.
      beforeUpdate: function(chartInstance) {
        if (chartInstance.options.linearGradientLine) {
          // The context, needed for the creation of the linear gradient.
          var ctx = chartInstance.chart.ctx;
          // The first (and, assuming, only) dataset.
          var dataset = chartInstance.data.datasets[0];
          // Calculate min and max values of the dataset.
          var minValue = Number.MAX_VALUE;
          var maxValue = Number.MIN_VALUE;
          for (var i = 0; i < dataset.data.length; ++i) {
            if (minValue > dataset.data[i])
              minValue = dataset.data[i];
            if (maxValue < dataset.data[i])
              maxValue = dataset.data[i];
          }
          // Calculate Y pixels for min and max values.
          var yAxis = chartInstance.scales['y-axis-0'];
          var minValueYPixel = yAxis.getPixelForValue(minValue);
          var maxValueYPixel = yAxis.getPixelForValue(maxValue);
          // Create the gradient.
          var gradient = ctx.createLinearGradient(0, minValueYPixel, 0, maxValueYPixel);
          // A kind of red for min.
          gradient.addColorStop(0, '#26cce0');
          // A kind of blue for max.
          gradient.addColorStop(1, '#26e089');
          // Assign the gradient to the dataset's border color.
          dataset.borderColor = gradient;
          // Uncomment this for some effects, especially together with commenting the `fill: false` option below.
          // dataset.backgroundColor = gradient;
        }
      }
    };

    Chart.pluginService.register(gradientLinePlugin);

})

function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
