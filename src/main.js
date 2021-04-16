const electron =  require('electron');
const url = require('url');
const path = require('path');

const{app, BrowserWindow} = electron;

let mainWindow;

app.on('ready', function(){
    //Create a new window
    mainWindow = new BrowserWindow({});
    //Load html 
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/src/pages/dropzone/index.html'),
        protocol: 'file',
        slashes: true
    })); //The above passes: file://dirname/mainWindow.html
}) 