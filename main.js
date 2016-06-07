const electron = require('electron');
const save = require('./lib/save.js');

// Module to control application life.
// Module to create native browser window.
const {app, BrowserWindow, dialog, ipcMain, shell} = electron;

// Report crashes to our server.
//require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
let mainWindow = null;

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
  mainWindow.loadURL('file://' + __dirname + '/views/index.html');

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

ipcMain.on('package-folder', function() {
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

ipcMain.on('save-package', (event, options) => {
  console.log('Packaging', options);
  save.save({
    source: options.sourceFolder,
    destination: options.destination,
    publicKey: options.encryptionKey,
    privateKey: options.verificationKey,
    privateKeyPassphrase: options.verificationKeyPassphrase
  }).then(() => {
    console.log('Finished');
    shell.showItemInFolder(options.sourceFolder.toString());
    event.sender.send('save-complete');
  }).catch((e) => {
    console.error(e);
  });
});

ipcMain.on('select-file', (event, options) => {
  if (!options) {
    options = {};
  }

  dialog.showSaveDialog({
    filters: options.filters
  }, (destination) => {
    if (destination) {
      event.sender.send('file-selected', destination, options);
    }
  });
});

ipcMain.on('select-folder', (event, options) => {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, (directory) => {
    if (directory) {
      event.sender.send('folder-selected', directory, options);
    }
  });
});
