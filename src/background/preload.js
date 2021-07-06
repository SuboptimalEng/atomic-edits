// const { contextBridge, ipcRenderer } = require('electron');
import { contextBridge, ipcRenderer } from 'electron';

const validOnChannels = ['REMOVE_REGION'];
const validSendChannels = [
  'REGION_CONTEXT_MENU',
  'EXPORT_VIDEO',
  'EXPORT_AUDIO',
];

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
