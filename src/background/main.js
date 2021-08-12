'use strict';

import { app, protocol, BrowserWindow } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';
const isDevelopment = process.env.NODE_ENV !== 'production';

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

import * as path from 'path';
let win;
async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1600,
    height: 1200,
    webPreferences: {
      // Required for Spectron testing
      // enableRemoteModule: !!process.env.IS_TEST,
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }
}

import _ from 'lodash';
let command;

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('quit', () => {
  // TODO V2: kill ffmpeg better?
  if (!_.isEmpty(command)) {
    console.log('Ffmpeg has been stopped.');
    command.kill();
  } else {
    console.log('Safely closed the app.');
  }
});

/* ================================================================ */
/* ================================================================ */
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import { ipcMain, Menu, dialog } from 'electron';

// INSIGHT: Replace app.asar <- no idea what this is doin...
ffmpeg.setFfmpegPath(ffmpegPath.path.replace('app.asar', 'app.asar.unpacked'));

const getMergedSilentRegions = (silentRegions) => {
  if (silentRegions.length <= 1) {
    return silentRegions;
  }
  const sortedSilentRegions = _.orderBy(silentRegions, 'start', 'asc');
  const res = [];
  let start = sortedSilentRegions[0].start;
  let end = sortedSilentRegions[0].end;
  const roundToTens = (num) => {
    return Math.round(num * 10) / 10;
  };
  _.each(sortedSilentRegions, (region) => {
    if (region.start <= end) {
      end = Math.max(end, region.end);
    } else {
      res.push({
        start: roundToTens(start),
        end: roundToTens(end),
      });
      start = region.start;
      end = region.end;
    }
  });
  res.push({
    start: roundToTens(start),
    end: roundToTens(end),
  });

  return res;
};

const getRegionsToClip = (silentRegions, videoLength) => {
  const regionsToClip = [];
  const numberOfSilentRegions = silentRegions.length;

  // If there are no silent regions in the video then clip
  // the entire video.
  if (numberOfSilentRegions === 0) {
    regionsToClip.push({ start: 0, end: videoLength });
    return regionsToClip;
  }

  // If the first silent region does not start from the beginning
  // of the video, then clip from the beginning of the video till
  // the start of the first region.
  if (silentRegions[0].start !== 0) {
    regionsToClip.push({
      start: 0,
      end: silentRegions[0].start,
    });
  }

  _.each(silentRegions, (silentRegion, idx) => {
    if (idx + 1 >= numberOfSilentRegions) {
      // Check if the last silent region ends at the end of the video.
      // If not, then add the end of the video.
      if (silentRegion.end !== videoLength) {
        regionsToClip.push({
          start: silentRegion.end,
          end: videoLength,
        });
      }
    } else {
      regionsToClip.push({
        start: silentRegion.end,
        end: silentRegions[idx + 1].start,
      });
    }
  });

  return regionsToClip;
};

const getVideoAudioFilter = (regionsToClip) => {
  const videoAudioFilterArray = [];
  _.each(regionsToClip, (region) => {
    videoAudioFilterArray.push(`between(t,${region.start},${region.end})`);
  });
  const videoAudioFilter = videoAudioFilterArray.join('+');
  return videoAudioFilter;
};

ipcMain.on('REGION_CONTEXT_MENU', (event, payload) => {
  const template = [
    {
      label: 'Remove',
      click: () => {
        event.reply('REMOVE_REGION', payload);
      },
    },
  ];
  const menu = Menu.buildFromTemplate(template);
  menu.popup(BrowserWindow.fromWebContents(event.sender));
});

ipcMain.on('EXPORT_AUDIO_OR_VIDEO', (event, payload) => {
  const filePath = dialog.showSaveDialogSync(win);
  if (_.isEmpty(filePath)) {
    console.log('No file selected.');
    return;
  }
  const originalFilePath = payload.filePath;
  const videoLength = payload.duration;
  const silentRegions = payload.silentRegions;
  const mergedSilentRegions = getMergedSilentRegions(silentRegions);
  const regionsToClip = getRegionsToClip(mergedSilentRegions, videoLength);
  const videoAudioFilter = getVideoAudioFilter(regionsToClip);
  console.log({
    originalFilePath,
    videoLength,
    silentRegions,
    mergedSilentRegions,
    regionsToClip,
    videoAudioFilter,
  });

  if (payload.exportType === 'exportVideo') {
    const pathToOutputFile = filePath.concat('.mp4');
    command = ffmpeg(originalFilePath)
      .on('error', function(err) {
        console.log('An error occurred: ' + err.message, err);
      })
      .on('start', () => {
        event.reply('EXPORT_STARTED');
      })
      .on('progress', (progress) => {
        event.reply('EXPORT_PROGRESS', {
          percent: progress.percent,
        });
      })
      .on('end', () => {
        event.reply('EXPORT_COMPLETE');
      })
      .videoFilters([`select='${videoAudioFilter}'`, 'setpts=N/FRAME_RATE/TB'])
      .audioFilters([`aselect='${videoAudioFilter}'`, 'asetpts=N/SR/TB'])
      .save(pathToOutputFile);
  } else {
    const pathToOutputFile = filePath.concat('.mp3');
    command = ffmpeg(originalFilePath)
      .on('error', function(err) {
        console.log('An error occurred: ' + err.message, err);
      })
      .on('start', () => {
        event.reply('EXPORT_STARTED');
      })
      .on('progress', (progress) => {
        event.reply('EXPORT_PROGRESS', {
          percent: progress.percent,
        });
      })
      .on('end', () => {
        event.reply('EXPORT_COMPLETE');
      })
      .audioFilters([`aselect='${videoAudioFilter}'`, 'asetpts=N/SR/TB'])
      .save(pathToOutputFile);
  }
});

/* ================================================================ */
/* ================================================================ */

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
