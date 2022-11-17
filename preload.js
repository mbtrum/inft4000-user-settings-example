const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  loadSettings: (callback) => ipcRenderer.on('user-settings', callback),
  openFolder: () => ipcRenderer.invoke('dialog:openFolder'),
  saveSettings: (strPath) => ipcRenderer.send('save-settings', strPath)
})