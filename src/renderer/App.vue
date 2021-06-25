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
      <div class="border m-4 absolute top-0 bottom-48 left-0 right-0">
        <div class="absolute border top-0 bottom-0 left-0 right-80">
          <VideoEditor></VideoEditor>
        </div>
        <div class="absolute top-0 bottom-0 right-16 w-64 border">
          <Settings></Settings>
        </div>
        <div class="absolute top-0 bottom-0 right-0 w-16 border text-3xl">
          <div class="flex flex-col justify-between">
            <div class="flex flex-col">
              <div class="px-4 py-2 hover:bg-secondary hover:text-primary">
                <fa icon="video" />
              </div>
              <div class="px-4 py-2 hover:bg-secondary hover:text-primary">
                <fa icon="cog" />
              </div>
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
