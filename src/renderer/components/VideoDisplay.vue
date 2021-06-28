<template>
  <div class="h-full">
    <div class="flex flex-col h-full place-items-center">
      <div v-if="fileUrl.length === 0">
        <div>Upload a Video/MP3 File</div>
        <div>
          <input
            type="file"
            accept="video/mp4,audio/mp3"
            @change="onFileChange"
            class="border"
          />
        </div>
      </div>
      <div v-else class="h-full">
        <video
          :src="fileUrl"
          type="video/mp4,audio/mp3"
          ref="editableVideo"
          class="h-full focus:outline-none"
          controls
        ></video>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'VideoDisplay',
  methods: {
    ...mapMutations(['setFileUrl', 'setFilePath']),

    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (files.length === 0) {
        return;
      }
      this.setFilePath(files[0].path);
      this.setFileUrl(URL.createObjectURL(files[0]));
    },
  },
  computed: {
    ...mapGetters(['fileUrl', 'filePath']),
  },
};
</script>
