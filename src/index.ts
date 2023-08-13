import { app, BrowserWindow } from 'electron';
import log from 'electron-log';
import './modules/ffmpeg'
import './backend'
import './config'
import { initPlugins } from './plugins'
import { runDatabase } from '@database';
import { initializeRecognition } from '@services/recognition';

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Logs limit (256 kb)
log.transports.file.maxSize = 262_144;
Object.assign(console, log.functions);

log.scope('app:userData.path').info(app.getPath('userData'));

const isProd = app.isPackaged;
const devToolsPadding = isProd ? 0 : 610

const createWindow = async (): Promise<void> => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 990,
    minHeight: 392,
    width: 752 + devToolsPadding,
    minWidth: 768,
    maxWidth: 940 + devToolsPadding,
    // TODO: MacOS
    titleBarStyle: isProd ? 'hidden' : 'default',
    titleBarOverlay: {
      color: '#040404',
      symbolColor: '#fff',
      height: 32
    },
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.setBackgroundColor('#040404');

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  await Promise.all([
    initPlugins(isProd),
    runDatabase(),
    initializeRecognition(),
  ])

  await createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', async () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
