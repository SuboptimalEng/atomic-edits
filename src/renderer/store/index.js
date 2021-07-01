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
