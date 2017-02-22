const {ipcMain} = require('electron');
const menubar = require('menubar');
const Keymetrics = require('keymetrics-api');
const fs = require('fs');
const open = require('open');
const path = require('path');

// Glabal var
var km;
var tokens;
var bucketId;
var servers = [];
var serversIndex = [];
var exceptions = {};
var charts = {};

// Menubar config
var mb = menubar({
  dir: path.join(__dirname, '/public'),
  width: 350,
  height: 600,
  resizable: false,
  icon: path.join(__dirname, '/public/assets/iconTemplate.png'),
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
    };

    var processes = Object.keys(data.apps_server[server]).sort();

    processes.forEach((process) => {
      if (!charts[`cpu-${server}-${process}`] || charts[`cpu-${server}-${process}`].length === 0) {
        charts[`cpu-${server}-${process}`] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
      if (charts[`cpu-${server}-${process}`] && charts[`cpu-${server}-${process}`].length > 10) {
        charts[`cpu-${server}-${process}`].shift();
      }
      charts[`cpu-${server}-${process}`].push(data.mini_metrics[server][process].cpu[0])

      if (!charts[`mem-${server}-${process}`] || charts[`mem-${server}-${process}`].length === 0) {
        charts[`mem-${server}-${process}`] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
      if (charts[`mem-${server}-${process}`] && charts[`mem-${server}-${process}`].length > 10) {
        charts[`mem-${server}-${process}`].shift();
      }

      charts[`mem-${server}-${process}`].push(data.mini_metrics[server][process].mem[0])

      servers[index].processes.push({
        status: (data.apps_server[server][process].status === 'online') ? 'online' : 'offline',
        name: process,
        probes: [
          {
            logo: 'cpu',
            name: 'CPU',
            gradient: (data.mini_metrics[server][process].cpu > 50) ? 'red' : 'green',
            value: data.mini_metrics[server][process].cpu,
            units: '%',
            graph: {
              name: `cpu-${server}-${process}`,
              values: charts[`cpu-${server}-${process}`]
            },
            url: `https://app.keymetrics.io/#/bucket/${bucketId}/apps-signs?server_name=${server}&app_name=${process}`
          },
          {
            logo: 'memory',
            name: 'MEM',
            gradient: (data.mini_metrics[server][process].mem > 1000) ? 'red' : 'green',
            value: data.mini_metrics[server][process].mem[0],
            units: 'MB',
            graph: {
              name: `mem-${server}-${process}`,
              values: charts[`mem-${server}-${process}`]
            },
            url: `https://app.keymetrics.io/#/bucket/${bucketId}/apps-signs?server_name=${server}&app_name=${process}`
          },
          {
            logo: 'bug',
            name: 'Errors',
            gradient: 'red',
            value: (exceptions[server] && exceptions[server][process]) ? exceptions[server][process] : 0,
            units: 'bug_gradient_red.svg',
            url: `https://app.keymetrics.io/#/bucket/${bucketId}/exceptions?server_name=${server}&app_name=${process}`
          }
        ]
      });
      if (data.apps_server[server][process].axm_monitor['pmx:http:latency']) {
        servers[index].processes[servers[index].processes.length - 1].probes.push({
          logo: 'world',
          name: 'HTTP avg.',
          gradient: (parseFloat(data.apps_server[server][process].axm_monitor['pmx:http:latency'].value) > 1000) ? 'red' : 'green',
          value: data.apps_server[server][process].axm_monitor['pmx:http:latency'].value,
          url: `https://app.keymetrics.io/#/bucket/${bucketId}/transactions?server_name=${server}&app_name=${process}`
        });
      }
    });
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
    });

    km.bucket.retrieve(tokens.public_key, (err, bucket) => {
      bucketId = bucket._id;
    });

    // Exceptions bus
    km.bus.on('**:exception', (data) => {
      putExceptions(data);
    });

    // Data bus
    km.bus.on('data:*:status', (data) => {
      if (mb.window) {
        putData(data, (servers) => {
          mb.window.webContents.send('data', servers);
        });
      }
    });
  });
}

// Save settings (Save button on Settings UI)
ipcMain.on('saveSettings', (event, arg) => {
  writeFile(arg);
  tokens = arg;
  if (km) {
    km.close();
    km = null;
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
    km = null;
  }
  process.exit(0);
})

// Get data when widget is open
mb.on('show', () => {
  if (tokens) {
    kmConfig(tokens);
    kmData();
  }
});

// Close km when widget is closed
mb.on('hide', () => {
  if (km) {
    km.close();
    km = null;
  }
});

// App ready
mb.on('ready', () => {
  try {
    tokens = JSON.parse(readFile());
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
