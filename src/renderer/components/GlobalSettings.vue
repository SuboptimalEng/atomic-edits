<template>
  <div>
    <div class="text-3xl font-bold">Settings</div>
    <div class="italic">Coming soon...</div>
    <!-- <div class="relative" v-click-outside="hideThemeSelection">
      <BaseButton @click="toggleThemeSelection">Themes</BaseButton>
      <div v-if="showThemeSelection" class="absolute">
        <div
          v-for="theme in themes"
          :key="theme"
          @click="
            setActiveTheme(theme);
            hideThemeSelection();
          "
        >
          {{ theme }}
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
// import BaseButton from './BaseButton.vue';
import { mapMutations } from 'vuex';

export default {
  name: 'Settings',
  components: {
    // BaseButton,
  },
  data() {
    return {
      showThemeSelection: false,
      themes: ['theme-light', 'theme-dark', 'theme-dracula'],
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
