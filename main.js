const {ipcMain} = require('electron');
var menubar = require('menubar');
var Keymetrics = require('keymetrics-api');

var mb = menubar();

// Keymetrics config
var km = new Keymetrics({
  token: '',
  public_key: '',
  realtime: true
});

// Keymetrics Init
km.init(function(err, res) {
  if (err) return console.log(err);
  // Data bus
  km.bus.on('data:*:status', function(data) {
    if (mb.window) {
    	mb.window.webContents.send('data', data);
    }
  });
});

// Menubar
mb.on('ready', function ready () {
  console.log('app is ready');
})
