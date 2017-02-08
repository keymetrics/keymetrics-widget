const {ipcRenderer} = require('electron')

var servers = [];
var serverElement = null;
var processElement = null;
var probElement = null;

ipcRenderer.on('data', (event, arg) => {
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
      <div class="name">${server}</div>
      <div id="${server}" class="processes">
      </div>
    `;

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
        <div class="name">${process}</div>
        <div class="probs">
          <div class="cpu">${arg.mini_metrics[server][process].cpu} %</div>
          <div class="mem">${arg.mini_metrics[server][process].mem} MB</div>
          <div id="${process}"></div>
        </div>
      `;

      var probs = [];
      for (var prob in arg.apps_server[server][process].axm_monitor) { 
        if (probs.indexOf(prob) === -1) {
          probs.push(prob);
          probElement = document.createElement('div');
          probElement.setAttribute('id', prob);
          probElement.setAttribute('class', 'prob');
          document.getElementById(process).appendChild(probElement);
        }
        else {
          probElement = document.getElementById(prob);
        }

        probElement.innerHTML = `
          <div id="${prob}">${prob} : ${arg.apps_server[server][process].axm_monitor[prob].value}</div>
        `;
      }
    }
  }
})
