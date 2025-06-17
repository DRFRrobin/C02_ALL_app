import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { ensureConfig, readConfig, saveConfig } from './configManager.js';
import { writeLog } from './logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    backgroundColor: '#1e1e1e',
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  // Block external navigation
  mainWindow.webContents.on('will-navigate', e => e.preventDefault());
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
}

app.whenReady().then(async () => {
  process.env.DATA_DIR = app.getPath('userData');
  await ensureConfig();
  await writeLog('info', 'Application started');
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('read-config', async () => {
  return readConfig();
});

ipcMain.handle('save-config', async (event, data) => {
  await saveConfig(data);
  return true;
});

ipcMain.handle('choose-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('write-log', async (event, level, msg) => {
  await writeLog(level, msg);
  return true;
});

ipcMain.on('login-success', async () => {
  await mainWindow.loadFile(path.join(__dirname, 'renderer', 'desktop.html'));
});
