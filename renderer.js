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

document.getElementById('settings-logo').addEventListener('click', () => {
  settings();
});

document.getElementById('save').addEventListener('click', () => {
  saveSettings();
});


var servers = [];
var serverElement = null;
var processElement = null;
var probElement = null;
var i;

ipcRenderer.on('data', (event, arg) => {
  i = 1;
  for(var server in arg.apps_server) {
    if (servers.indexOf(server) === -1) {
      servers.push(server);
      serverElement = document.createElement('div');
      serverElement.setAttribute('id', server);
      serverElement.setAttribute('class', 'server');
      document.querySelector('#servers').appendChild(serverElement);
    }
    else {
      serverElement = document.getElementById(server);
    }

    serverElement.innerHTML = `
      <div class="server-name">
        <div class="server-name-title">
          <div><img src="assets/server.svg"></div>
          <div>Server #${i} - ${server}</div>
        </div>
        <div><img src="assets/arrow.svg"></div>
      </div>
      <div id="${server}" class="processes">
      </div>
    `;
    i++;

    var processes = [];
    for (var process in arg.apps_server[server]) {
      if (processes.indexOf(process) === -1) {
        processes.push(process);
        processElement = document.createElement('div');
        processElement.setAttribute('id', process);
        processElement.setAttribute('class', 'process');
        document.getElementById(server).appendChild(processElement);
      }
      else {
        processElement = document.getElementById(process);
      }

      processElement.innerHTML = `
        <div class="process-name">
          <div><img src="assets/online.svg"></div>
          <div>${process}</div>
          <div><img src="assets/arrow.svg"></div>
        </div>
        <div class="probs">
          <div class="cpu">
            <div class="title">CPU</div>
            <div class="value">${arg.mini_metrics[server][process].cpu} %</div>
          </div>
          <div class="mem">${arg.mini_metrics[server][process].mem} MB</div>
          <div id="${process}"></div>
        </div>
      `;

      // var probs = [];
      // for (var prob in arg.apps_server[server][process].axm_monitor) { 
      //   if (probs.indexOf(prob) === -1) {
      //     probs.push(prob);
      //     probElement = document.createElement('div');
      //     probElement.setAttribute('id', prob);
      //     probElement.setAttribute('class', 'prob');
      //     document.getElementById(process).appendChild(probElement);
      //   }
      //   else {
      //     probElement = document.getElementById(prob);
      //   }

      //   probElement.innerHTML = `
      //     <div id="${prob}">${prob} : ${arg.apps_server[server][process].axm_monitor[prob].value}</div>
      //   `;
      // }
    }
  }
})
