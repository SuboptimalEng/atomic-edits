<template>
  <div :class="appTheme">
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
      <div class="border m-4 absolute top-0 bottom-0 left-0 right-0">
        <div class="grid grid-cols-3 h-full">
          <div class="col-span-2 border h-full">
            <VideoEditor></VideoEditor>
          </div>
          <div class="col-span-1 border">
            <Settings></Settings>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Settings from './components/Settings.vue';
import VideoEditor from './components/VideoEditor.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  components: {
    Settings,
    VideoEditor,
  },
  computed: {
    ...mapGetters(['appTheme']),
  },
};
</script>
