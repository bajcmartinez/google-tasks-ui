const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;
let authWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 768,
    icon: path.join(__dirname, '../assets/logo.png'),
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
}

/**
 * Window events
 */

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Auth
*/
electron.ipcMain.on('google-auth-start', async (event, authorizeUrl) => {

  authWindow = new BrowserWindow({
    width: 800,
    height: 600,
    parent: mainWindow,
    webPreferences: {
      nodeIntegration: false
    }
  });
  authWindow.loadURL(authorizeUrl);
  mainWindow.on("closed", () => (mainWindow = null));

  authWindow.webContents.on('will-redirect', (windowEvent, url) => {
    if (url.includes("https://googletasksui.com")) {
      function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
          results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
      }

      const access_token = getParameterByName("code", url);
      event.sender.send('google-auth-reply', access_token);

      event.preventDefault();
      authWindow.close();
    }
  })
});