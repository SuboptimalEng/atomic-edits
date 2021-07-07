import _ from 'lodash';
import { createStore } from 'vuex';

// TODO: Refactor this
// const availableThemes = ['theme-dark', 'theme-light', 'theme-dracula'];
// const availableSettings = ['wave-surfer-settings', 'global-settings'];

export default createStore({
  state: {
    fileUrl: '',
    filePath: '',
    fileName: '',
    fileType: '',

    // Global Settings
    activeTheme: 'theme-dark',
    activeSetting: 'wave-surfer-settings',

    // Wave Surfer Settings
    duration: undefined,
    normalizeAudio: true,
    skipSilentRegions: true,
    silenceLength: 0.5,
    silencePadding: 0,
    silenceSensitivity: 0.1,
    removedRegions: [],

    // Exporting
    showExportingUI: false,
  },
  mutations: {
    setFileUrl(state, fileUrl) {
      state.fileUrl = fileUrl;
    },
    setFilePath(state, filePath) {
      state.filePath = filePath;
    },
    setFileName(state, fileName) {
      state.fileName = fileName;
    },
    setFileType(state, fileType) {
      state.fileType = fileType;
    },
    setActiveTheme(state, activeTheme) {
      state.activeTheme = activeTheme;
    },
    setActiveSetting(state, activeSetting) {
      state.activeSetting = activeSetting;
    },
    toggleNormalizeAudio(state) {
      state.normalizeAudio = !state.normalizeAudio;
    },
    toggleSkipSilentRegions(state) {
      state.skipSilentRegions = !state.skipSilentRegions;
    },
    setSilenceLength(state, silenceLength) {
      if (silenceLength >= 0.5) {
        state.silenceLength = Math.round(silenceLength * 10) / 10;
      }
    },
    setSilencePadding(state, silencePadding) {
      state.silencePadding = Math.round(silencePadding * 10) / 10;
    },
    setSilenceSensitivity(state, silenceSensitivity) {
      if (silenceSensitivity <= 1 && silenceSensitivity >= 0) {
        state.silenceSensitivity = Math.round(silenceSensitivity * 100) / 100;
      }
    },
    storeRemovedRegion(state, region) {
      state.removedRegions.push(region);
    },
    restoreRemovedRegion(state) {
      const region = state.removedRegions.pop();
      return region;
    },
    setShowExportingUI(state, showExportingUI) {
      state.showExportingUI = showExportingUI;
    },
  },
  getters: {
    fileUrl(state) {
      return state.fileUrl;
    },
    filePath(state) {
      return state.filePath;
    },
    fileName(state) {
      return state.fileName;
    },
    fileType(state) {
      return state.fileType;
    },
    activeTheme(state) {
      return state.activeTheme;
    },
    activeSetting(state) {
      return state.activeSetting;
    },
    normalizeAudio(state) {
      return state.normalizeAudio;
    },
    skipSilentRegions(state) {
      return state.skipSilentRegions;
    },
    silenceLength(state) {
      return state.silenceLength;
    },
    silencePadding(state) {
      return state.silencePadding;
    },
    silenceSensitivity(state) {
      return state.silenceSensitivity;
    },
    removedRegions(state) {
      // INSIGHT: get a clone of the object for watcher
      // return Object.assign({}, state.removedRegions);
      return _.cloneDeep(state.removedRegions);
    },
    showExportingUI(state) {
      return state.showExportingUI;
    },
  },
  actions: {},
  modules: {},
});
