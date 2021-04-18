/*const electron =  require('electron');
const url = require('url');
const path = require('path');

const{app, BrowserWindow} = electron;

let mainWindow;

app.on('ready', function(){
    //Create a new window
    mainWindow = new BrowserWindow({});
    //Load html 
    mainWindow.loadURL(url.format({
        //pathname: path.join(__dirname, '/src/pages/dropzone/index.html'),
        pathname: path.join(__dirname, 'ex.html'),
        protocol: 'file',
        slashes: true
    })); //The above passes: file://dirname/mainWindow.html
})  */


const { app, BrowserWindow } = require("electron");

const server = require("./server");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL("http://localhost:3000");
  //mainWindow.loadFile('src/pages/dropzone/index.html'); 
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("resize", function (e, x, y) {
  mainWindow.setSize(x, y);
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});