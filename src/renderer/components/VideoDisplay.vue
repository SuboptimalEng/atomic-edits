<template>
  <div class="h-full bg-black">
    <div class="flex flex-col h-full place-items-center justify-center">
      <fa v-if="isAudioFile()" icon="headphones" class="text-9xl" />
      <video
        :src="fileUrl"
        id="video-display-element"
        type="video/mp4,audio/mp3"
        :class="[
          isAudioFile() ? 'hidden h-0 w-0' : 'h-full focus:outline-none',
        ]"
      ></video>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'VideoDisplay',
  methods: {
    isAudioFile() {
      return this.fileType.includes('audio');
    },
  },
  computed: {
    ...mapGetters(['fileUrl', 'fileType']),
  },
};
</script>
