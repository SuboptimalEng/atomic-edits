// const { contextBridge, ipcRenderer } = require('electron');
import { contextBridge, ipcRenderer } from 'electron';

const validOnChannels = ['SELECT_FILE', 'EXPORT_VIDEO'];
const validSendChannels = ['SELECT_FILE', 'EXPORT_VIDEO'];

contextBridge.exposeInMainWorld('ipc', {
  send: (channel, data) => {
    if (validSendChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  on: (channel, func) => {
    if (validOnChannels.includes(channel)) {
      // Strip event as it includes `sender` and is a security risk
      ipcRenderer.on(channel, (event, ...args) => {
        func(...args);
      });
    }
  },
});
