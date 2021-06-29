<template>
  <div class="flex flex-col border h-full">
    <div class="flex justify-between text-3xl w-full">
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
import * as _ from 'lodash';
import * as WaveSurfer from 'wavesurfer.js';
// import * as WaveSurferRegions from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';
import { mapGetters } from 'vuex';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config.js';

export default {
  name: 'WaveSurfer',
  data() {
    return {
      waveSurfer: null,
      waveSurferOptions: [
        { icon: 'step-backward' },
        { icon: 'play' },
        { icon: 'step-forward' },
        { icon: 'search-minus' },
        { icon: 'search-plus' },
      ],
    };
  },
  methods: {
    getWaveSurferColors(cssVariable) {
      const fullConfig = resolveConfig(tailwindConfig);
      const computedStyle = getComputedStyle(
        document.querySelector('.' + this.activeTheme)
      );
      _.each(Object.keys(fullConfig.theme.colors), (key) => {
        console.log(computedStyle.getPropertyValue('--' + key));
      });
      return computedStyle.getPropertyValue(cssVariable);
    },
    zoomIn() {
      const currentZoom = this.waveSurfer.params.minPxPerSec;
      if (currentZoom >= 100) {
        return;
      }

      if (currentZoom <= 10) {
        this.waveSurfer.zoom(currentZoom + 20);
      } else {
        this.waveSurfer.zoom(currentZoom + 10);
      }
    },
    zoomOut() {
      const currentZoom = this.waveSurfer.params.minPxPerSec;
      if (currentZoom <= 10) {
        return;
      }

      this.waveSurfer.zoom(currentZoom - 10);
    },
    skipBackward() {
      this.waveSurfer.skipBackward(5);
    },
    skipForward() {
      this.waveSurfer.skipForward(5);
    },
    togglePlayPause() {
      if (this.waveSurfer.isPlaying()) {
        this.pause();
      } else {
        this.play();
      }
    },
    play() {
      // TODO: Do not hard code icon replacement.
      this.waveSurferOptions[1].icon = 'pause';
      this.waveSurfer.play();
    },
    pause() {
      // TODO: Do not hard code icon replacement.
      this.waveSurferOptions[1].icon = 'play';
      this.waveSurfer.pause();
    },
    optionSelected(option) {
      const audioTrackOptions = {
        play: 'play',
        pause: 'pause',
        'step-forward': 'skipForward',
        'step-backward': 'skipBackward',
        'search-plus': 'zoomIn',
        'search-minus': 'zoomOut',
      };
      this[audioTrackOptions[option]]();
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
        waveColor: this.getWaveSurferColors('--red'),
        backend: 'MediaElement',
        container: document.getElementById('waveform'),
        plugins: [],
      });

      this.waveSurfer.on('pause', () => {
        this.pause();
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
    ...mapGetters(['activeTheme', 'fileUrl', 'filePath']),
  },
  watch: {
    fileUrl: 'onFileUrlChange',
  },
};
</script>
