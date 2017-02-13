const {ipcRenderer} = require('electron')

var settings = () => {
  var settings = document.getElementById('settings');

  if (settings.style.display === 'none') {
    settings.style.display = 'block';
  }
  else {
    settings.style.display = 'none';
  }
}

var saveSettings = () => {
  var tokens = {
    token: document.getElementById('token').value,
    public_key: document.getElementById('public_key').value
  };
  document.getElementById('servers').innerHTML = '';
  ipcRenderer.send('saveSettings', tokens);
}

// document.getElementById('settings-logo').addEventListener('click', () => {
//   settings();
// });

// document.getElementById('save').addEventListener('click', () => {
//   saveSettings();
// });

var errors = {};
var servers = [];
var serverElement = null;
var processElement = null;
var probElement = null;

ipcRenderer.on('data', (event, arg) => {
  for(var server in arg.apps_server) {
    if (servers.indexOf(server) === -1) {
      servers.push(server);
      serverElement = document.createElement('div');
      serverElement.setAttribute('id', `server-${server}`);
      serverElement.setAttribute('class', 'server');
      document.getElementById('servers').appendChild(serverElement);
    }
    else {
      serverElement = document.getElementById(`server-${server}`);
    }

    serverElement.innerHTML = `
      <div class="server-header" onclick="test()">
        <div class="server-header-title">
          <div class="server-header-logo"><img src="assets/server.svg"></div>
          <div class="server-header-name">Server #${servers.indexOf(server) + 1} - ${server}</div>
        </div>
        <div class="server-header-arrow"><img src="assets/arrow.svg"></div>
      </div>
      <div id="processes-${server}" class="processes"></div>
    `;

    var processes = [];
    for (var process in arg.apps_server[server]) {
      if (processes.indexOf(process) === -1) {
        processes.push(process);
        processElement = document.createElement('div');
        processElement.setAttribute('id', `process-${process}-${servers.indexOf(server) + 1}`);
        processElement.setAttribute('class', 'process');
        document.getElementById(`processes-${server}`).appendChild(processElement);
      }
      else {
        processElement = document.getElementById(`process-${process}-${servers.indexOf(server) + 1}`);
      }

      processElement.innerHTML = `
        <div class="process">
          <div class="process-header">
            <div class="process-header-title">
              <div class="process-header-logo"><img src="assets/online.svg"></div>
              <div class="process-header-name">${process}</div>
            </div>
            <div class="process-header-arrow"><img src="assets/arrow.svg"></div>
          </div>
          <div class="probs">
            <div class="prob">
              <div class="prob-logo">
                <img src="assets/cpu.svg">
              </div>
              <div class="prob-infos">
                <div class="prob-name">CPU</div>
                <div class="prob-value greenGradient">${arg.mini_metrics[server][process].cpu} %</div>
              </div>
              <div class="prob-graph">
                <canvas id="myChart" height="40" class="prob-chart"></canvas>
              </div>
            </div>
            <div class="prob">
              <div class="prob-logo">
                <img src="assets/memory.svg">
              </div>
              <div class="prob-infos">
                <div class="prob-name">MEM</div>
                <div class="prob-value greenGradient">${arg.mini_metrics[server][process].mem} MB</div>
              </div>
              <div class="prob-graph">
                <canvas id="myChart" height="60" class="prob-chart"></canvas>
              </div>
            </div>
            <div class="prob">
              <div class="prob-logo">
                <img src="assets/bug.svg">
              </div>
              <div class="prob-infos">
                <div class="prob-name">Errors</div>
                <div id="errors-${process}-${servers.indexOf(server) + 1}" class="prob-value redGradient">
                  ${(errors[server] && errors[server][process]) ? errors[server][process] : '0'} <img height="25" src="assets/bug_gradient_red.svg">
                </div>
              </div>
            </div>
        </div>
      `;
    }
  }
})

ipcRenderer.on('exceptions', (event, arg) => {
  errors = arg;
})
