const {ipcRenderer} = require('electron');

var settingsElem = document.getElementById('settings').style.display = 'none';
var errors = {};
var charts = {};
var servers = [];
var processes = [];
var serverElement = null;
var processElement = null;
var probElement = null;

var settings = () => {
  var settingsElem = document.getElementById('settings');
  var appElem = document.getElementById('app');

  if (settingsElem.style.display === 'none') {
    settingsElem.style.display = 'block';
    app.style.display = 'none';
  }
  else {
    settingsElem.style.display = 'none';
    appElem.style.display = 'block';
  }
}

var saveSettings = () => {
  var tokens = {
    token: document.getElementById('token').value,
    public_key: document.getElementById('public_key').value
  };
  errors = {};
  charts = {};
  servers = [];
  processes = [];
  ipcRenderer.send('saveSettings', tokens);
  document.getElementById('settings').style.display = 'none';
}

var quit = () => {
  ipcRenderer.send('quit', '');
}

var show = (id) => {
  var elem = document.getElementById(id);

  if (elem.style.display === 'none') {
    elem.style.display = 'block';
  }
  else {
    elem.style.display = 'none';
  }
}

ipcRenderer.on('data', (event, arg) => {
  for(var server in arg.apps_server) {
    if (servers.indexOf(server) === -1) {
      servers.push(server);
      serverElement = document.createElement('div');
      serverElement.setAttribute('id', `server-${server}`);
      serverElement.setAttribute('class', 'server');
      document.getElementById('servers').appendChild(serverElement);
      serverElement.innerHTML = `
        <div class="server-header" onclick="show('processes-${server}')">
          <div class="server-header-title">
            <div class="server-header-logo"><img src="assets/server.svg"></div>
            <div class="server-header-name">Server #${servers.indexOf(server) + 1} - ${server}</div>
          </div>
          <div class="server-header-arrow"><img src="assets/arrow.svg"></div>
        </div>
        <div id="processes-${server}" class="processes"></div>
      `;
    }
    else {
      serverElement = document.getElementById(`server-${server}`);
    }

    for (var process in arg.apps_server[server]) {
      if (processes.indexOf(process) === -1) {
        processes.push(process);
        processElement = document.createElement('div');
        processElement.setAttribute('id', `process-${process}-${servers.indexOf(server) + 1}`);
        processElement.setAttribute('class', 'process');
        document.getElementById(`processes-${server}`).appendChild(processElement);
        var probs;
        probs = `
          <div class="process-header" onclick="show('probs-${process}-${servers.indexOf(server) + 1}')">
            <div class="process-header-title">
              <div class="process-header-logo"><img id="imgStatus-${process}-${servers.indexOf(server) + 1}" src="assets/${(arg.apps_server[server][process].status === 'online') ? 'online' : 'offline'}.svg"></div>
              <div class="process-header-name">${process}</div>
            </div>
            <div class="process-header-arrow"><img src="assets/arrow.svg"></div>
          </div>
          <div id="probs-${process}-${servers.indexOf(server) + 1}" class="probs">
            <div class="prob">
              <div class="prob-logo">
                <img src="assets/cpu.svg">
              </div>
              <div class="prob-infos">
                <div class="prob-name">CPU</div>
                <div id="cpuValue-${process}-${servers.indexOf(server) + 1}" class="prob-value greenGradient">${arg.mini_metrics[server][process].cpu} %</div>
              </div>
              <div class="prob-graph">
                <canvas id="cpu-${process}-${servers.indexOf(server) + 1}" height="40" class="prob-chart"></canvas>
              </div>
            </div>
            <div class="prob">
              <div class="prob-logo">
                <img src="assets/memory.svg">
              </div>
              <div class="prob-infos">
                <div class="prob-name">MEM</div>
                <div id="memValue-${process}-${servers.indexOf(server) + 1}" class="prob-value greenGradient">${arg.mini_metrics[server][process].mem} MB</div>
              </div>
              <div class="prob-graph">
                <canvas id="mem-${process}-${servers.indexOf(server) + 1}" height="60" class="prob-chart"></canvas>
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
        `;
          if (arg.apps_server[server][process].axm_monitor['pmx:http:latency']) {
            probs += `
              <div class="prob">
                <div class="prob-logo">
                  <img src="assets/World.svg">
                </div>
                <div class="prob-infos">
                  <div class="prob-name">HTTP avg.</div>
                  <div id="http-${process}-${servers.indexOf(server) + 1}" class="prob-value greenGradient">${arg.apps_server[server][process].axm_monitor['pmx:http:latency'].value}</div>
                </div>
              </div>
            `;
          }
        processElement.innerHTML = `${probs}</div>`;

        if (!charts[`cpu-${process}-${servers.indexOf(server) + 1}`]) {
          console.log(server)
          charts[`cpu-${process}-${servers.indexOf(server) + 1}`] = newChart(document.getElementById(`cpu-${process}-${servers.indexOf(server) + 1}`));
          console.log(charts[`cpu-${process}-${servers.indexOf(server) + 1}`])
        }
        if (!charts[`mem-${process}-${servers.indexOf(server) + 1}`]) {
          charts[`mem-${process}-${servers.indexOf(server) + 1}`] = newChart(document.getElementById(`mem-${process}-${servers.indexOf(server) + 1}`));
        }
      }
      else {
        processElement = document.getElementById(`process-${process}-${servers.indexOf(server) + 1}`);

        // Status
        document.getElementById(`imgStatus-${process}-${servers.indexOf(server) + 1}`).setAttribute('src', `assets/${(arg.apps_server[server][process].status === 'online') ? 'online' : 'offline'}.svg`)
        // Cpu
        document.getElementById(`cpuValue-${process}-${servers.indexOf(server) + 1}`).innerHTML = `${arg.mini_metrics[server][process].cpu} %`;
        putData(charts[`cpu-${process}-${servers.indexOf(server) + 1}`], arg.mini_metrics[server][process].cpu);
        // Mem
        document.getElementById(`memValue-${process}-${servers.indexOf(server) + 1}`).innerHTML = `${arg.mini_metrics[server][process].mem} MB`;
        putData(charts[`mem-${process}-${servers.indexOf(server) + 1}`], arg.mini_metrics[server][process].mem[0]);
        // Errors
        document.getElementById(`errors-${process}-${servers.indexOf(server) + 1}`).innerHTML = `${(errors[server] && errors[server][process]) ? errors[server][process] : '0'} <img height="25" src="assets/bug_gradient_red.svg">`;
        // Http avg.
        if (arg.apps_server[server][process].axm_monitor['pmx:http:latency']) {
          document.getElementById(`http-${process}-${servers.indexOf(server) + 1}`).innerHTML = `${arg.apps_server[server][process].axm_monitor['pmx:http:latency'].value}`;
        }
      }
    }
  }
});

ipcRenderer.on('exceptions', (event, arg) => {
  errors = arg;
});

ipcRenderer.on('exceptionsBus', (event, arg) => {
  arg.forEach((error) => {
    errors[error.process.server][error.process.name] += 1;
  });
});
