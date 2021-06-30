<template>
  <div class="h-full bg-black">
    <div class="flex flex-col h-full place-items-center">
      <video
        :src="fileUrl"
        id="videoDisplayElement"
        type="video/mp4,audio/mp3"
        class="h-full focus:outline-none"
        controls
      ></video>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'VideoDisplay',
  computed: {
    ...mapGetters(['fileUrl', 'filePath']),
  },
};
</script>
