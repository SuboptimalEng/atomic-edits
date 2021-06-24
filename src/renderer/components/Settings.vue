<template>
  <div>
    <div>Settings</div>
    <div class="relative">
      <BaseButton @click="toggleShowThemeSelection">Themes</BaseButton>
      <div v-if="showThemeSelection" class="absolute">
        <div
          v-for="theme in themes"
          :key="theme"
          @click="
            setAppTheme(theme);
            toggleShowThemeSelection();
          "
        >
          {{ theme }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from './BaseButton.vue';
import { mapMutations } from 'vuex';

export default {
  name: 'Settings',
  components: {
    BaseButton,
  },
  data() {
    return {
      showThemeSelection: false,
      themes: ['theme-light', 'theme-dark', 'theme-dracula'],
    };
  },
  methods: {
    ...mapMutations(['setAppTheme']),
    toggleShowThemeSelection() {
      this.showThemeSelection = !this.showThemeSelection;
    },
  },
};
</script>
