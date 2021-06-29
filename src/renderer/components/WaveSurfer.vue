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
        // TODO: Set these options on the right side
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
      this.waveSurfer.zoom(currentZoom + 10);
    },
    zoomOut() {
      const currentZoom = this.waveSurfer.params.minPxPerSec;
      if (currentZoom <= 10) {
        return;
      }
      this.waveSurfer.zoom(currentZoom - 10);
    },
    skipBackward() {
      this.waveSurfer.skipBackward();
    },
    skipForward() {
      this.waveSurfer.skipForward();
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
      const playbackOptions = {
        play: this.togglePlayPause,
        pause: this.togglePlayPause,
        'step-forward': this.skipForward,
        'step-backward': this.skipBackward,
        'search-plus': this.zoomIn,
        'search-minus': this.zoomOut,
      };
      playbackOptions[option]();
    },
    createWaveSurfer() {
      console.log(this);
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
      console.log(this.waveSurfer.getWaveColor());
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
