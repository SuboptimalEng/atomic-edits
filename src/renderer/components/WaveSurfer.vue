<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-around text-3xl h-full w-full border-b">
      <div class="flex place-items-center">
        <button
          v-for="option in waveSurferOptions"
          :key="option.icon"
          class="px-4 h-full focus:outline-none hover:bg-primary-hover"
          @click="waveSurferOptionSelected(option.icon)"
        >
          <fa :icon="option.icon" />
        </button>
      </div>
    </div>
    <!-- <div class="grid grid-cols-1 h-full items-center"> -->
    <div class="grid grid-cols-1 h-full border-t">
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
  mounted() {
    if (!_.isEmpty(this.fileUrl)) {
      this.loadWaveSurfer();
    }
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
      this.waveSurfer.zoom(currentZoom + 20);
    },
    zoomOut() {
      const currentZoom = this.waveSurfer.params.minPxPerSec;
      this.waveSurfer.zoom(currentZoom - 20);
    },
    skipBackward() {
      this.waveSurfer.skipBackward(5);
    },
    skipForward() {
      this.waveSurfer.skipForward(5);
    },
    togglePlayPauseButton(icon) {
      const playOrPause = ['play', 'pause'];
      const playOrPauseIdx = _.findIndex(this.waveSurferOptions, (option) => {
        return playOrPause.includes(option.icon);
      });
      this.waveSurferOptions[playOrPauseIdx].icon = icon;
    },
    play() {
      this.togglePlayPauseButton('pause');
      this.waveSurfer.play();
    },
    pause() {
      this.togglePlayPauseButton('play');
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
        // scrollParent: false,
        // hideScrollbar: true,
        barHeight: 1,
        // TODO: decodes on zoom?
        forceDecode: true,
        mediaControls: false,
        // INSIGHT: control audio speed
        audioRate: 1,
        backend: 'MediaElement',
        container: document.getElementById('waveform'),
        waveColor: this.getWaveSurferColors('--ws-wave-color'),
        progressColor: this.getWaveSurferColors('--ws-progress-color'),
        // backgroundColor: this.getWaveSurferColors('--primary-hover'),
        plugins: [],
      });

      this.waveSurfer.on('finish', () => {
        this.togglePlayPauseButton('play');
      });
    },
    loadWaveSurfer() {
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
    fileUrl: 'loadWaveSurfer',
  },
};
</script>
