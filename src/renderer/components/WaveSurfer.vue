<template>
  <div class="flex flex-col border h-full">
    <div class="flex justify-between text-3xl border w-full">
      <div class="flex place-items-center">
        <button
          v-for="option in waveSurferOptions"
          :key="option.icon"
          class="px-4 py-2 focus:outline-none hover:bg-primary-hover"
          @click="optionSelected(option.icon)"
        >
          <fa :icon="option.icon" />
        </button>
      </div>
    </div>
    <div class="grid grid-cols-1 h-full items-center">
      <div id="waveform"></div>
    </div>
  </div>
</template>

<script>
// import * as _ from 'lodash';
import * as WaveSurfer from 'wavesurfer.js';
// import * as WaveSurferRegions from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';
import { mapGetters } from 'vuex';

export default {
  name: 'WaveSurfer',
  data() {
    return {
      waveSurfer: null,
      waveSurferOptions: [
        { icon: 'backward' },
        { icon: 'play' },
        { icon: 'forward' },
        // TODO: Set these options on the right side
        { icon: 'search-minus' },
        { icon: 'search-plus' },
      ],
    };
  },
  methods: {
    zoomIn() {
      const currentZoom = this.waveSurfer.params.minPxPerSec;
      if (currentZoom >= 100) {
        return;
      }
      this.waveSurfer.zoom(currentZoom + 10);
    },
    zoomOut() {
      const currentZoom = this.waveSurfer.params.minPxPerSec;
      if (currentZoom <= 10) {
        return;
      }
      this.waveSurfer.zoom(currentZoom - 10);
    },
    optionSelected(option) {
      const playbackOptions = ['backward', 'play', 'forward'];

      if (playbackOptions.includes(option)) {
        // TODO: Do not hardcode icon replacement.
        this.waveSurferOptions[1].icon = 'pause';
        if (option === 'play') {
          this.waveSurfer.setPlaybackRate(1);
        }

        if (option === 'backward') {
          const playbackRate = this.waveSurfer.getPlaybackRate();
          this.waveSurfer.setPlaybackRate(playbackRate - 2);
        }

        if (option === 'forward') {
          const playbackRate = this.waveSurfer.getPlaybackRate();
          this.waveSurfer.setPlaybackRate(playbackRate + 1);
        }

        this.waveSurfer.play();
      }

      if (option === 'pause') {
        // TODO: Do not hardcode icon replacement.
        this.waveSurferOptions[1].icon = 'play';
        this.waveSurfer.pause();
      }

      if (option === 'search-minus') {
        this.zoomOut();
      }

      if (option === 'search-plus') {
        this.zoomIn();
      }
    },
    createWaveSurfer() {
      this.waveSurfer = WaveSurfer.create({
        height: 180,
        fillParent: true,
        barHeight: 1.25,
        // TODO: decodes on zoom?
        forceDecode: true,
        mediaControls: false,
        // INSIGHT: control audio speed
        audioRate: 1.5,
        wavecolor: '#fafafa',
        backend: 'MediaElement',
        container: document.getElementById('waveform'),
        enableDragSection: false,
        plugins: [],
      });
    },
    onFileUrlChange() {
      setTimeout(() => {
        const videoDisplayElement = document.getElementById(
          'videoDisplayElement'
        );
        this.createWaveSurfer();
        this.waveSurfer.load(videoDisplayElement);
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
