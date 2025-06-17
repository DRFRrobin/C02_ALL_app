import { app, BrowserWindow, ipcMain, dialog, session } from 'electron';
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_NAME = 'config.json';
let mainWindow;

const DATA_DIR = app.getPath('userData');
const CONFIG_PATH = path.join(DATA_DIR, CONFIG_NAME);
const DEFAULT_CONFIG = path.join(__dirname, 'config', 'default-config.json');

async function ensureConfig() {
  try {
    await fs.access(CONFIG_PATH);
  } catch {
    const data = await fs.readFile(DEFAULT_CONFIG, 'utf-8');
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(CONFIG_PATH, data);
  }
}

async function readConfig() {
  const data = await fs.readFile(CONFIG_PATH, 'utf-8');
  return JSON.parse(data);
}

async function saveConfig(data) {
  await fs.writeFile(CONFIG_PATH, JSON.stringify(data, null, 2));
}

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
  await ensureConfig();
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

ipcMain.on('login-success', async () => {
  await mainWindow.loadFile(path.join(__dirname, 'renderer', 'desktop.html'));
});
