import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  readConfig: () => ipcRenderer.invoke('read-config'),
  saveConfig: data => ipcRenderer.invoke('save-config', data),
  chooseFolder: () => ipcRenderer.invoke('choose-folder'),
  log: (level, msg) => ipcRenderer.invoke('log', level, msg)
});
