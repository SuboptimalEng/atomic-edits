<template>
  <div>
    <div class="m-4 absolute top-0 bottom-0 left-0 right-0 border">
      <div class="flex place-items-center justify-around h-full border">
        <label
          for="file-upload"
          class="
            p-8
            flex flex-col
            place-items-center
            justify-center
            cursor-pointer
            border border-dashed
            hover:bg-primary-hover
            focus:outline-none
          "
        >
          <div class="text-9xl">
            <fa icon="folder-open" />
          </div>
          <div class="text-3xl font-bold">Choose a video (or audio) file.</div>
          <input
            id="file-upload"
            type="file"
            accept="video/*,audio/*"
            style="display: none"
            @change="onFileChange"
          />
          <!-- <input
            id="file-upload"
            type="file"
            accept="video/mp4,audio/mp3"
            style="display: none"
            @change="onFileChange"
          /> -->
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadFile',

  data() {
    return {};
  },
  methods: {
    onFileChange() {
      console.log('hi');
    },
  },
};
</script>
