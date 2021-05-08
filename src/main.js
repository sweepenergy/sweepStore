const { app, BrowserWindow } = require("electron");

const server = require("./server");

let mainWindow;

process.env.NODE_ENV = 'production';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if(process.env.NODE_ENV !== 'production'){
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadURL("http://localhost:3000");
  //mainWindow.loadFile('src/public/pages/import.html');
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
