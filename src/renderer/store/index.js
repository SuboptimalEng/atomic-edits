import { createStore } from 'vuex';

// TODO: Refactor this
// const availableThemes = ['theme-dark', 'theme-light', 'theme-dracula'];
// const availableSettings = ['wave-surfer-settings', 'global-settings'];

export default createStore({
  state: {
    activeTheme: 'theme-dark',
    activeSetting: 'wave-surfer-settings',
  },
  mutations: {
    setActiveTheme(state, activeTheme) {
      state.activeTheme = activeTheme;
    },
    setActiveSetting(state, activeSetting) {
      state.activeSetting = activeSetting;
    },
  },
  getters: {
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
