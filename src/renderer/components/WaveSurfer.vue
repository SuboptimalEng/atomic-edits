<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-around text-3xl h-full w-full border-b">
      <div class="flex place-items-center">
        <button
          v-for="option in waveSurferOptions"
          :key="option.icon"
          class="px-4 py-2 h-full focus:outline-none hover:bg-primary-hover"
          @click="waveSurferOptionSelected(option.icon)"
        >
          <fa :icon="option.icon" />
        </button>
      </div>
    </div>
    <div class="grid grid-cols-1 h-full border-t">
      <div id="waveform-timeline"></div>
      <div id="waveform" class="w-full"></div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import WaveSurfer from 'wavesurfer.js';
import WaveSurferRegions from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';
import WaveSurferTimeline from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.js';
import { mapGetters, mapMutations } from 'vuex';
// INSIGHT: Get tailwind variables like this.
// import resolveConfig from 'tailwindcss/resolveConfig';
// import tailwindConfig from '../../../tailwind.config.js';

import hotkeys from 'hotkeys-js';
import { KEYBOARD_SHORTCUTS } from '../shared/constants.js';

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
        { icon: 'download' },
      ],
    };
  },
  mounted() {
    // setup wavesurfer silent region color
    this.silentRegionColor = `rgba(${this.getWaveSurferColors(
      '--ws-silent-region-color'
    )}, .4)`;

    if (!_.isEmpty(this.fileUrl)) {
      this.reloadWaveSurfer();
    }

    KEYBOARD_SHORTCUTS.forEach((command) => {
      const keybinding = command['default'];
      // INSIGHT: dynamically call vue methods => this[command.name]()
      hotkeys(keybinding, () => this[command.name]());
    });
    // TODO: Prevent cmd+r, ctrl+r from refreshing the browser.
    hotkeys('cmd+r,ctrl+r', (event) => event.preventDefault());

    window.ipc.on('REMOVE_REGION', (payload) => {
      const region = this.waveSurfer.regions.list[payload.regionId];
      this.storeRemovedRegion({
        drag: true,
        resize: true,
        minLength: 0.5,
        color: this.silentRegionColor,
        start: region.start,
        end: region.end,
        // TODO: Is this needed since adding region should create new id?
        // regionId: payload.regionId,
      });
      region.remove();
    });

    window.ipc.on('EXPORT_STARTED', () => {
      this.setShowExportingUI(true);
    });
  },
  methods: {
    ...mapMutations(['storeRemovedRegion', 'setShowExportingUI']),

    recalculateSilentRegions() {
      this.waveSurfer.clearRegions();
      const duration = this.waveSurfer.getDuration();
      const peaks = this.waveSurfer.backend.getPeaks(
        Math.floor(duration * 100)
      );
      this.loadRegions(this.extractSilentRegions(peaks, duration));
    },
    reloadWaveSurfer() {
      // Maybe remove old wave surfer instance.
      if (!_.isEmpty(this.waveSurfer)) {
        this.waveSurfer.destroy();
      }

      // INSIGHT: Bind wave surfer to video display element.
      const videoDisplayElement = document.getElementById(
        'video-display-element'
      );
      this.waveSurfer = this.createWaveSurfer();
      this.waveSurfer.load(videoDisplayElement);
      this.waveSurfer.on('waveform-ready', () => {
        const duration = this.waveSurfer.getDuration();
        const peaks = this.waveSurfer.backend.getPeaks(
          Math.floor(duration * 100)
        );
        this.loadRegions(this.extractSilentRegions(peaks, duration));
      });
      this.refreshRegionInEvent();
      this.waveSurfer.on('region-contextmenu', (region) => {
        // TODO: Prevent region dragging when context menu is open.
        window.ipc.send('REGION_CONTEXT_MENU', {
          regionId: region.id,
        });
      });
      this.waveSurfer.on('finish', () => {
        this.togglePlayPauseButton('play');
      });

      // Display play button when wavesurfer is reloaded.
      this.togglePlayPauseButton('play');
    },
    loadRegions(regions) {
      _.each(regions, (region) => {
        this.waveSurfer.addRegion(region);
      });
    },
    extractSilentRegions(peaks, duration) {
      const silenceLength = this.silenceLength;
      const silenceSensitivity = this.silenceSensitivity;
      const coef = duration / peaks.length;
      const minClusterLength = silenceLength / coef;

      // Gather silence indices
      const silences = [];
      _.each(peaks, (peak, index) => {
        if (Math.abs(peak) <= silenceSensitivity) {
          silences.push(index);
        }
      });

      const allSilentClusters = [];
      _.each(silences, (silence, index) => {
        if (allSilentClusters.length && silence == silences[index - 1] + 1) {
          allSilentClusters[allSilentClusters.length - 1].push(silence);
        } else {
          allSilentClusters.push([silence]);
        }
      });

      // Filter silence clusters by minimum length
      const filteredSilentClusters = _.filter(allSilentClusters, (cluster) => {
        return cluster.length >= minClusterLength;
      });

      // Create the silent regions
      const silentRegions = _.map(filteredSilentClusters, (cluster) => {
        // let next = fClusters[index + 1];
        return {
          // INSIGHT: Silent regions
          start: cluster[0],
          end: cluster[cluster.length - 1],
          // INSIGHT: Talking regions
          // start: cluster[cluster.length - 1],
          // end: next ? next[0] : length - 1,
        };
      });

      // TODO: Is the inverse of this necessary?
      // Add an initial region if the audio doesn't start with silence
      // let firstCluster = fClusters[0];
      // if (firstCluster && firstCluster[0] != 0) {
      //   regions.unshift({
      //     start: 0,
      //     end: firstCluster[firstCluster.length - 1],
      //   });
      // }

      // Filter regions by minimum length
      const filteredSilentRegions = _.filter(silentRegions, (region) => {
        return region.end - region.start >= minClusterLength;
      });

      // Return time-based regions
      return _.map(filteredSilentRegions, (region) => {
        return {
          drag: true,
          resize: true,
          minLength: 0.5,
          color: this.silentRegionColor,
          start: Math.round(region.start * coef * 10) / 10,
          end: Math.round(region.end * coef * 10) / 10,
        };
      });
    },
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
      const newZoom = currentZoom === 80 ? currentZoom : currentZoom + 10;
      this.waveSurfer.zoom(Number(newZoom));
    },
    zoomOut() {
      const currentZoom = this.waveSurfer.params.minPxPerSec;
      const newZoom = currentZoom === 20 ? currentZoom : currentZoom - 10;
      if (currentZoom === 20) {
        // Don't zoom to prevent scrollbar from appearing.
      } else if (currentZoom - 10 === 20) {
        this.waveSurfer.zoom(Number(newZoom));
        this.waveSurfer.toggleScroll();
      } else {
        this.waveSurfer.zoom(Number(newZoom));
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
        download: 'exportAudioOrVideo',
      };
      this[waveSurferMethods[option]]();
    },
    isAudioFile() {
      return this.fileType.includes('audio');
    },
    exportAudioOrVideo() {
      const silentRegions = [];
      _.each(this.waveSurfer.regions.list, (region) => {
        silentRegions.push({
          start: region.start,
          end: region.end,
        });
      });
      window.ipc.send('EXPORT_AUDIO_OR_VIDEO', {
        filePath: this.filePath,
        duration: this.waveSurfer.getDuration(),
        silentRegions: _.cloneDeep(silentRegions),
        exportType: this.isAudioFile() ? 'exportAudio' : 'exportVideo',
      });
    },
    createWaveSurfer() {
      return WaveSurfer.create({
        height: 200,
        barHeight: 1,
        audioRate: 1,
        fillParent: true,
        scrollParent: false,
        mediaControls: false,
        forceDecode: true,
        container: '#waveform',
        backend: 'MediaElement',
        // INSIGHT: Normalize wave based on highest peak
        normalize: this.normalizeAudio,
        removeMediaElementOnDestroy: false,
        waveColor: this.getWaveSurferColors('--ws-wave-color'),
        progressColor: this.getWaveSurferColors('--ws-progress-color'),
        plugins: [
          WaveSurferTimeline.create({
            height: 20,
            container: '#waveform-timeline',
            primaryFontColor: this.getWaveSurferColors('--ws-progress-color'),
            secondaryFontColor: this.getWaveSurferColors('--ws-progress-color'),
          }),
          WaveSurferRegions.create({
            regions: [],
          }),
        ],
      });
    },
    refreshRegionInEvent() {
      this.waveSurfer.un('region-in');
      this.waveSurfer.on('region-in', (region) => {
        if (this.skipSilentRegions) {
          this.waveSurfer.play(region.end);
        }
      });
    },
    addPaddingToSilentRegions(newValue, oldValue) {
      const silentRegions = [];
      if (newValue - oldValue > 0) {
        // decrease silence region by 0.2s
        _.each(this.waveSurfer.regions.list, (region) => {
          const start = Math.round((region.start + 0.1) * 10) / 10;
          const end = Math.round((region.end - 0.1) * 10) / 10;
          // INSIGHT: If the new silent region is too small, do not update it.
          if (end - start >= 0.5) {
            silentRegions.push({
              ...region,
              start,
              end,
            });
          } else {
            silentRegions.push({
              ...region,
            });
          }
        });
      } else {
        // increase silence region by 0.2s
        _.each(this.waveSurfer.regions.list, (region) => {
          silentRegions.push({
            ...region,
            start: Math.round((region.start - 0.1) * 10) / 10,
            end: Math.round((region.end + 0.1) * 10) / 10,
          });
        });
      }
      this.waveSurfer.clearRegions();
      this.loadRegions(silentRegions);
    },
  },
  computed: {
    ...mapGetters([
      'fileUrl',
      'filePath',
      'fileType',
      'activeTheme',
      'normalizeAudio',
      'skipSilentRegions',
      'silenceLength',
      'silencePadding',
      'silenceSensitivity',
      'removedRegions',
      // TODO V2: Ensure that users can still remove regions
      // 'showExportingUI',
    ]),
  },
  watch: {
    fileUrl: 'reloadWaveSurfer',
    normalizeAudio: 'reloadWaveSurfer',
    skipSilentRegions: 'refreshRegionInEvent',

    silenceLength: 'recalculateSilentRegions',
    silencePadding: 'addPaddingToSilentRegions',
    silenceSensitivity: 'recalculateSilentRegions',

    removedRegions: {
      handler(newValue, oldValue) {
        const newRemovedRegionsLen = Object.keys(newValue).length;
        const oldRemovedRegionsLen = Object.keys(oldValue).length;
        if (newRemovedRegionsLen < oldRemovedRegionsLen) {
          const region = oldValue[oldRemovedRegionsLen - 1];
          this.waveSurfer.addRegion(region);
        }
      },
    },
  },
};
</script>
