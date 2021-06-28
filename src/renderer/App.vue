<template>
  <div :class="activeTheme">
    <div
      class="
        font-sans
        antialiased
        min-h-screen
        border
        bg-primary
        text-secondary
      "
    >
      <div class="border m-4 absolute top-0 bottom-48 left-0 right-0">
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

        <div class="absolute top-0 bottom-0 right-0 w-16 border text-3xl">
          <div class="flex flex-col justify-between">
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
      </div>

      <div class="border m-4 absolute bottom-0 right-0 left-0 h-48">
        <div>Wave Surfer</div>
      </div>
    </div>
  </div>
</template>

<script>
import VideoDisplay from './components/VideoDisplay.vue';
import GlobalSettings from './components/GlobalSettings.vue';
import WaveSurferSettings from './components/WaveSurferSettings.vue';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'App',
  components: {
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
