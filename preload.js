/**
 * preload.js — runs in the renderer context with Node.js access.
 * Exposes a safe, minimal API to the frontend via contextBridge.
 */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * Send a native OS notification via the Electron main process.
   * @param {{ title: string, body: string }} data
   */
  notify: (data) => ipcRenderer.send('show-notification', data),
});
