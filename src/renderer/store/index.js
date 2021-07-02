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

    // Wave Surfer Settings
    normalizeAudio: true,
    skipSilentRegions: true,
    silenceLength: 0.5,
    silencePadding: 0,
    silenceSensitivity: 0.1,

    // Global Settings
    activeTheme: 'theme-dark',
    activeSetting: 'wave-surfer-settings',
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
    setActiveTheme(state, activeTheme) {
      state.activeTheme = activeTheme;
    },
    setActiveSetting(state, activeSetting) {
      state.activeSetting = activeSetting;
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
    activeTheme(state) {
      return state.activeTheme;
    },
    activeSetting(state) {
      return state.activeSetting;
    },
  },
  actions: {},
  modules: {},
});
