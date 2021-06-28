import { createStore } from 'vuex';

// TODO: Refactor this
// const availableThemes = ['theme-dark', 'theme-light', 'theme-dracula'];
// const availableSettings = ['wave-surfer-settings', 'global-settings'];

export default createStore({
  state: {
    fileUrl: '',
    filePath: '',
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
