const {ipcMain} = require('electron');
const menubar = require('menubar');
const Keymetrics = require('keymetrics-api');
const fs = require('fs');
const open = require('open');

// Glabal var
var km;
var tokens;
var servers = [];
var serversIndex = [];
var exceptions = {};

// Menubar config
var mb = menubar({
  dir: 'public',
  width: 350,
  height: 600,
  resizable: false,
  icon: './public/assets/iconTemplate.png',
  preloadWindow: true
});

// Get home directory
var getHome = () => {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

// Read .keymetrics in home directory
var readFile = () => {
  if (!fs.existsSync(getHome() + '/.keymetrics')) {
    fs.openSync(getHome() + '/.keymetrics', 'w');
  }
  return fs.readFileSync(getHome() + '/.keymetrics').toString();
}

// Write .keymetrics in home directory
var writeFile = (tokens) => {
  tokens = JSON.stringify(tokens);
  try {
    var file = fs.writeFileSync(getHome() + '/.keymetrics', tokens);
  }
  catch (e) {
    var file = null;
  }
  return file;
}

// Put data in array to send it in callback
var putData = (data, cb) => {
  for (var server in data.apps_server) {
    if (serversIndex.indexOf(server) === -1) {
      serversIndex.push(server);
    }
    var index = serversIndex.indexOf(server);
    servers[index] = {
      name: server,
      processes: []
    }

    var processes = Object.keys(data.apps_server[server]).sort();

    processes.forEach((process) => {
      servers[index].processes.push({
        status: (data.apps_server[server][process].status === 'online') ? 'online' : 'offline',
        name: process,
        probes: [
          {
            logo: 'cpu',
            name: 'CPU',
            gradient: (data.mini_metrics[server][process].cpu > 50) ? 'red' : 'green',
            value: data.mini_metrics[server][process].cpu,
            units: '%'
          },
          {
            logo: 'memory',
            name: 'MEM',
            gradient: (data.mini_metrics[server][process].mem > 1000) ? 'red' : 'green',
            value: data.mini_metrics[server][process].mem[0],
            units: 'MB'
          },
          {
            logo: 'bug',
            name: 'Errors',
            gradient: 'red',
            value: (exceptions[server] && exceptions[server][process]) ? exceptions[server][process] : 0,
            units: 'bug_gradient_red.svg'
          }
        ]
      });
      if (data.apps_server[server][process].axm_monitor['pmx:http:latency']) {
        servers[index].processes[servers[index].processes.length - 1].probes.push({
          logo: 'world',
          name: 'HTTP avg.',
          gradient: (parseFloat(data.apps_server[server][process].axm_monitor['pmx:http:latency'].value) > 1000) ? 'red' : 'green',
          value: data.apps_server[server][process].axm_monitor['pmx:http:latency'].value
        });
      }
    })
  }
  cb(servers);
}

// Put execptions in array
var putExceptions = (data) => {
  data.forEach((server) => {
    if (!exceptions[server.process.server]) {
      exceptions[server.process.server] = {};
    }
    if (!exceptions[server.process.server][server.process.name]) {
      exceptions[server.process.server][server.process.name] = 0;
    }
    exceptions[server.process.server][server.process.name] += 1;
  });
}

// Keymetrics config
var kmConfig = (tokens) => {
  km = new Keymetrics({
    token: tokens.token,
    public_key: tokens.public_key,
    realtime: true
  });
}

// Get data from bus
var kmData = () => {
  km.init((err, res) => {
    if (err) {
      return ;
    }

    // Get exceptions
    km.bucket.Data.exceptionsSummary((err, body) => {
      exceptions = body;
    })

    // Exceptions bus
    km.bus.on('**:exception', (data) => {
      putExceptions(data);
    })

    // Data bus
    km.bus.on('data:*:status', (data) => {
      if (mb.window) {
        putData(data, (servers) => {
          mb.window.webContents.send('data', servers);
        })
      }
    });
  });
}

// Save settings (Save button on Settings UI)
ipcMain.on('saveSettings', (event, arg) => {
  writeFile(arg);
  if (km) {
    km.close();
  }
  servers = [];
  kmConfig(arg);
  kmData();
  mb.window.webContents.send('tokens', tokens);
})

// Quit app (Disconnect link on Settings UI)
ipcMain.on('quit', (event, arg) => {
  if (km) {
    km.close();
  }
  process.exit(0);
})

// App ready
mb.on('ready', () => {
  try {
    tokens = JSON.parse(readFile());
    kmConfig(tokens);
    kmData();
  }
  catch (e) {}
  
  mb.showWindow();

  // DOM ready
  mb.window.webContents.on('dom-ready', () => {
    mb.window.webContents.send('tokens', tokens);
  });

  // Handle link to open external browser
  mb.window.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    open(url);
  });
})
