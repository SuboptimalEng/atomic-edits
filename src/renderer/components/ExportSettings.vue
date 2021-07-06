<template>
  <div>
    <div class="text-3xl font-bold pb-4">Export Settings</div>
    <div class="flex flex-col space-y-2">
      <div v-for="setting in exportSettings" :key="setting.name">
        <button
          class="
            p-2
            flex
            border
            space-x-2
            place-items-center
            hover:bg-primary-hover
            focus:outline-none
          "
        >
          <div>{{ setting.text }}</div>
          <fa :icon="setting.icon" />
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ExportSettings',
  data() {
    return {
      exportSettings: [
        {
          name: 'exportAudio',
          text: 'Export Audio',
          icon: 'file-audio',
        },
        {
          name: 'exportVideo',
          text: 'Export Video',
          icon: 'file-video',
        },
      ],
    };
  },
  mounted() {
    const settingsToKeep = this.isAudioFile() ? 'exportAudio' : 'exportVideo';
    const updatedExportSettings = this.exportSettings.filter(
      (setting) => setting.name === settingsToKeep
    );
    this.exportSettings = updatedExportSettings;
  },
  methods: {
    isAudioFile() {
      return this.fileType.includes('audio');
    },
  },
  computed: {
    ...mapGetters(['fileType']),
  },
};
</script>
