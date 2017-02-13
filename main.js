const {ipcMain} = require('electron');
const menubar = require('menubar');
const Keymetrics = require('keymetrics-api');
const fs = require('fs');
const open = require('open');
var km;
var tokens;

var mb = menubar({
  width: 350,
  height: 600,
  resizable: false,
  icon: './assets/iconTemplate.png',
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
    if (err) return console.log(err);

    km.bucket.Data.exceptionsSummary((err, body) => {
      if (mb.window) {
        mb.window.webContents.send('exceptions', body);
      }
    })

    // km.bus.on('**:exceptions', (data) => {
    //   console.log(data)
    // })

    // Data bus
    km.bus.on('data:*:status', (data) => {
      //console.log(JSON.stringify(data))
      if (mb.window) {
        mb.window.webContents.send('data', data);
      }
    });
  });
}

ipcMain.on('saveSettings', (event, arg) => {
  writeFile(arg);
  km.close();
  kmConfig(arg);
  kmData();
})

// Menubar
mb.on('ready', () => {
  console.log('app is ready');  try {
    console.log('File')
    tokens = JSON.parse(readFile());
    kmConfig(tokens);
    kmData();
  }
  catch (e) {
    console.log('No file')
  }
  //console.log(tokens)

  mb.showWindow();

  mb.window.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    open(url);
  });
})
