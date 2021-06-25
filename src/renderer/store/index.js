import { createStore } from 'vuex';

export default createStore({
  state: {
    appTheme: 'theme-dark',
  },
  mutations: {
    setAppTheme(state, appTheme) {
      state.appTheme = appTheme;
    },
  },
  getters: {
    appTheme(state) {
      return state.appTheme;
    },
  },
  actions: {},
  modules: {},
});
