// const { contextBridge, ipcRenderer } = require('electron');
import { contextBridge, ipcRenderer } from 'electron';

const validOnChannels = [
  'REMOVE_REGION',
  'EXPORT_STARTED',
  'EXPORT_PROGRESS',
  'EXPORT_COMPLETE',
];
const validSendChannels = ['REGION_CONTEXT_MENU', 'EXPORT_AUDIO_OR_VIDEO'];

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
