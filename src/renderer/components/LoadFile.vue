<template>
  <div class="flex place-items-center justify-around h-full border">
    <label
      for="file-upload"
      class="
        p-16
        flex flex-col
        place-items-center
        justify-center
        cursor-pointer
        border-2 border-dashed
        hover:bg-primary-hover
        focus:outline-none
      "
    >
      <div class="text-9xl">
        <fa icon="folder-open" />
      </div>
      <div class="text-3xl font-bold">Select a file.</div>
      <!-- TODO: Support multiple file types. -->
      <!-- accept="video/*,audio/*" -->
      <div>Types: mp3 & mp4</div>
      <input
        id="file-upload"
        type="file"
        accept="video/mp4,audio/mp3"
        style="display: none"
        @change="onFileChange"
      />
    </label>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'LoadFile',

  methods: {
    ...mapMutations([
      'setFileUrl',
      'setFilePath',
      'setFileName',
      'setFileType',
    ]),

    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (files.length === 0) {
        return;
      }
      this.setFilePath(files[0].path);
      this.setFileName(files[0].name);
      this.setFileType(files[0].type);
      this.setFileUrl(URL.createObjectURL(files[0]));
    },
  },
};
</script>
