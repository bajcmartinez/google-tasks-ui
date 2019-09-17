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

  const checkNavigation = (windowEvent, url) => {
    if (url.includes("response=code")) {
      // https://accounts.google.com/o/oauth2/approval/v2/approvalnativeapp?auto=false&response=code%3D4%2FrAGGV6Hgym-ugQGJcmwBek1SUyc6kJMUn9gYHFJ3ZCpQujU5l6I3q-o%26scope%3Dhttps%3A%2F%2Fwww.googleapis.com%2Fauth%2Ftasks&hl=en&approvalCode=4%2FrAGGV6Hgym-ugQGJcmwBek1SUyc6kJMUn9gYHFJ3ZCpQujU5l6I3q-o
      function getParameterByName(name, url) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
          results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace( /\+/g, ' '));
      }

      const response = getParameterByName("response", url);
      const access_token = getParameterByName("code", "http://localhost/?" + response);
      event.sender.send('google-auth-reply', access_token);

      event.preventDefault();
      authWindow.close();
    }
  }

  authWindow.webContents.on('will-redirect', checkNavigation);
  authWindow.webContents.on('will-navigate', checkNavigation);
});