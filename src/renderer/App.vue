<template>
  <div :class="activeTheme">
    <div class="font-sans antialiased min-h-screen bg-primary text-secondary">
      <div class="m-4 absolute top-0 bottom-60 left-0 right-0">
        <div class="absolute border top-0 bottom-0 left-0 right-80">
          <VideoDisplay></VideoDisplay>
        </div>
        <div class="absolute top-0 bottom-0 right-16 w-64 border">
          <GlobalSettings
            v-if="activeSetting === 'global-settings'"
          ></GlobalSettings>
          <WaveSurferSettings
            v-if="activeSetting === 'wave-surfer-settings'"
          ></WaveSurferSettings>
        </div>

        <div class="absolute border top-0 bottom-0 right-0 w-16 text-3xl">
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
        </div>
      </div>

      <div class="m-4 absolute bottom-0 right-0 left-0 h-60">
        <WaveSurfer></WaveSurfer>
      </div>
    </div>
  </div>
</template>

<script>
import WaveSurfer from './components/WaveSurfer.vue';
import VideoDisplay from './components/VideoDisplay.vue';
import GlobalSettings from './components/GlobalSettings.vue';
import WaveSurferSettings from './components/WaveSurferSettings.vue';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'App',
  components: {
    WaveSurfer,
    VideoDisplay,
    GlobalSettings,
    WaveSurferSettings,
  },
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
    ...mapGetters(['activeTheme', 'activeSetting']),
  },
};
</script>
