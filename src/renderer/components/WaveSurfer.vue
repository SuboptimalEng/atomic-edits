<template>
  <div class="flex flex-col border h-full">
    <div class="flex justify-between text-3xl w-full">
      <div class="flex place-items-center">
        <button
          v-for="option in waveSurferOptions"
          :key="option.icon"
          class="px-4 py-2 focus:outline-none hover:bg-primary-hover"
          @click="waveSurferOptionSelected(option.icon)"
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
// import resolveConfig from 'tailwindcss/resolveConfig';
// import tailwindConfig from '../../../tailwind.config.js';

export default {
  name: 'WaveSurfer',
  data() {
    return {
      waveSurfer: null,
      waveSurferOptions: [
        { icon: 'volume-down' },
        { icon: 'volume-up' },
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
      // INSIGHT: Get tailwind variables like this.
      // const fullConfig = resolveConfig(tailwindConfig);
      // _.each(Object.keys(fullConfig.theme.colors), (key) => {
      //   console.log(computedStyle.getPropertyValue('--' + key));
      // });
      const computedStyle = getComputedStyle(
        document.querySelector('.' + this.activeTheme)
      );
      return computedStyle.getPropertyValue(cssVariable);
    },
    zoomIn() {
      const currentZoom = this.waveSurfer.params.minPxPerSec;
      const newZoom = currentZoom + 10;
      if (newZoom > 100) {
        return;
      }

      this.waveSurfer.zoom(newZoom);
    },
    zoomOut() {
      const currentZoom = this.waveSurfer.params.minPxPerSec;
      const newZoom = currentZoom - 10;
      if (newZoom < 10) {
        return;
      }

      this.waveSurfer.zoom(newZoom);
      if (newZoom === 10) {
        this.waveSurfer.toggleScroll();
      }
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
      const playOrPause = ['play', 'pause'];
      const playOrPauseIdx = _.findIndex(this.waveSurferOptions, (option) => {
        return playOrPause.includes(option.icon);
      });
      this.waveSurferOptions[playOrPauseIdx].icon = 'pause';
      this.waveSurfer.play();
    },
    pause() {
      const playOrPause = ['play', 'pause'];
      const playOrPauseIdx = _.findIndex(this.waveSurferOptions, (option) => {
        return playOrPause.includes(option.icon);
      });
      this.waveSurferOptions[playOrPauseIdx].icon = 'play';
      this.waveSurfer.pause();
    },
    lowerVolume() {
      const currentVolume = this.waveSurfer.getVolume();
      const newVolume = currentVolume - 0.2;
      if (newVolume >= 0) {
        this.waveSurfer.setVolume(newVolume);
      }
    },
    increaseVolume() {
      const currentVolume = this.waveSurfer.getVolume();
      const newVolume = currentVolume + 0.2;
      if (newVolume <= 1) {
        this.waveSurfer.setVolume(newVolume);
      }
    },
    waveSurferOptionSelected(option) {
      const waveSurferMethods = {
        play: 'play',
        pause: 'pause',
        'step-forward': 'skipForward',
        'step-backward': 'skipBackward',
        'search-plus': 'zoomIn',
        'search-minus': 'zoomOut',
        'volume-down': 'lowerVolume',
        'volume-up': 'increaseVolume',
      };
      this[waveSurferMethods[option]]();
    },
    createWaveSurfer() {
      this.waveSurfer = WaveSurfer.create({
        height: 180,
        fillParent: true,
        barHeight: 1,
        // TODO: decodes on zoom?
        forceDecode: true,
        mediaControls: false,
        // INSIGHT: control audio speed
        audioRate: 1,
        backend: 'MediaElement',
        container: document.getElementById('waveform'),
        waveColor: this.getWaveSurferColors('--secondary'),
        plugins: [],
      });

      // Change play button UI when track is done playing.
      // Accidentally called this.pause() recursively.
      // TODO: Fix this.
      // this.waveSurfer.on('pause', () => {
      //   this.pause();
      // });
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
