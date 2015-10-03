var app = require('app'); // Module to control application life.
var BrowserWindow = require('browser-window'); // Module to create native browser window.
var dialog = require('dialog');
var ipc = require('ipc');
var save = require('./lib/save.js');
var shell = require('shell');

// Report crashes to our server.
//require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/views/index.html');

  // Open the devtools.
  //mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

ipc.on('package-folder', function(event, arg) {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, function(directory) {
    if (directory) {
      dialog.showSaveDialog({
        filters: [{
          name: 'ZDF',
          extensions: ['zdf']
        }]
      }, function(destination) {
        if (destination) {
          save.save(directory.toString(), destination.toString(), function() {
            console.log('Finished');
            shell.showItemInFolder(destination.toString());
            app.quit();
          });
        }
      });
    }
  });
});

ipc.on('save-package', function(event, options) {
  console.log('Packaging', options);
  save.save(options.sourceFolder, options.destination, function() {
    console.log('Finished');
    shell.showItemInFolder(options.sourceFolder.toString());
    event.sender.send('save-complete');
  });
});

ipc.on('select-file', function(event, options) {
  if (!options) {
    options = {};
  }

  dialog.showSaveDialog({
    filters: options.filters
  }, function(destination) {
    if (destination) {
      event.sender.send('file-selected', destination, options);
    }
  });
});

ipc.on('select-folder', function(event, options) {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, function(directory) {
    if (directory) {
      event.sender.send('folder-selected', directory, options);
    }
  });
});
