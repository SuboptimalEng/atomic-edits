<template>
  <div class="flex flex-col">
    <button
      v-for="setting in availableSettings"
      :key="setting.section"
      class="px-4 py-2 focus:outline-none"
      :class="[
        activeSetting === setting.section
          ? 'bg-secondary text-primary'
          : 'hover:bg-primary-hover',
      ]"
      @click="setActiveSetting(setting.section)"
    >
      <fa :icon="setting.icon" />
    </button>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Sidebar',
  data() {
    return {
      availableSettings: [
        {
          // TODO: Refactor settings.
          section: 'wave-surfer-settings',
          isActive: true,
          icon: 'video',
        },
        {
          section: 'global-settings',
          isActive: false,
          icon: 'cog',
        },
      ],
    };
  },
  methods: {
    ...mapMutations(['setActiveSetting']),
  },

  computed: {
    ...mapGetters(['activeSetting']),
  },
};
</script>