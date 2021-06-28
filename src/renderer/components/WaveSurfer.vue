<template>
  <div ref="justTesting">Wave Surfer Hmm</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'WaveSurfer',
  methods: {
    onFileUrlChange() {
      setTimeout(() => {
        const videoDisplayElement = document.getElementById(
          'videoDisplayElement'
        );
        console.log(videoDisplayElement);
      }, 100);
    },
  },
  computed: {
    ...mapGetters(['fileUrl', 'filePath']),
  },
  watch: {
    fileUrl: 'onFileUrlChange',
  },
};
</script>
