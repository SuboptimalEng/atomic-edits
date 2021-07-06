<template>
  <div>
    <div class="text-3xl font-bold pb-4">App Settings</div>
    <div class="text-xl font-bold pb-2">Keyboard Shortcuts</div>
    <div v-for="shortcut in keyboardShortcuts" :key="shortcut.name">
      <div class="flex justify-between">
        <div class="w-32 flex justify-between place-items-center">
          <div>
            {{ shortcut.text }}
          </div>
          <div><fa icon="arrow-right" class="text-xs" /></div>
        </div>
        <div>
          {{ shortcut.key }}
        </div>
      </div>
    </div>
    <div class="text-xl font-bold py-2">Themes</div>
    <div>Coming soon...</div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { KEYBOARD_SHORTCUTS } from '../shared/constants.js';

export default {
  name: 'GlobalSettings',
  data() {
    return {
      showThemeSelection: false,
      themes: ['theme-light', 'theme-dark', 'theme-dracula'],
      keyboardShortcuts: KEYBOARD_SHORTCUTS,
    };
  },
  methods: {
    ...mapMutations(['setActiveTheme']),

    hideThemeSelection() {
      this.showThemeSelection = false;
    },

    toggleThemeSelection() {
      this.showThemeSelection = !this.showThemeSelection;
    },
  },
};
</script>
