<template>
  <div class="h-full">
    <div class="text-3xl font-bold pb-4">Atomic Edits</div>
    <div class="flex flex-col space-y-2">
      <div
        v-for="silenceSetting in silenceSettings"
        :key="silenceSetting.text"
        class="flex justify-between place-items-center"
      >
        <div class="w-60 flex place-items-center">
          {{ silenceSetting.text }}
        </div>
        <div class="flex space-x-4">
          <button
            class="focus:outline-none"
            @click="silenceSetting.decrement()"
          >
            <fa icon="minus-square" class="hover:text-primary-hover" />
          </button>
          <div class="w-8 text-center">
            {{ this[silenceSetting.name] }}
          </div>
          <button
            class="focus:outline-none"
            @click="silenceSetting.increment()"
          >
            <fa icon="plus-square" class="hover:text-primary-hover" />
          </button>
        </div>
      </div>
      <div
        v-for="booleanSetting in booleanSettings"
        :key="booleanSetting.text"
        class="flex justify-between place-items-center"
      >
        <div>
          {{ booleanSetting.text }}
        </div>

        <button
          @click="this[booleanSetting.methodName]()"
          class="focus:outline-none hover:text-primary-hover"
        >
          <fa v-if="this[booleanSetting.name]" icon="check-square" />
          <fa v-else icon="square" />
        </button>
      </div>
      <div
        v-for="miscSetting in miscSettings"
        :key="miscSetting.text"
        class="flex justify-between place-items-center"
      >
        <div>
          {{ miscSetting.text }}
        </div>

        <button
          @click="this[miscSetting.methodName]()"
          class="focus:outline-none hover:text-primary-hover"
        >
          <fa :icon="miscSetting.icon" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'WaveSurferSettings',
  data() {
    return {
      booleanSettings: [
        {
          name: 'skipSilentRegions',
          methodName: 'toggleSkipSilentRegions',
          text: 'Skip Silent Regions',
          icon: 'toggle-on',
        },
        // TODO: Maybe add this in for v0.2
        // {
        //   name: 'normalizeAudio',
        //   methodName: 'toggleNormalizeAudio',
        //   text: 'Normalize Audio',
        //   icon: 'toggle-on',
        // },
      ],
      miscSettings: [
        {
          methodName: 'restoreRemovedRegion',
          text: 'Restore Removed Region',
          icon: 'caret-square-left',
        },
      ],
      silenceSettings: [
        {
          name: 'silenceLength',
          decrement: () => {
            let delta = 0.5;
            if (this.silenceLength <= 4.1) {
              delta = 0.2;
            }
            if (this.silenceLength <= 1.1) {
              delta = 0.1;
            }
            this.setSilenceLength(this.silenceLength - delta);
          },
          increment: () => {
            let delta = 0.5;
            if (this.silenceLength <= 3.9) {
              delta = 0.2;
            }
            if (this.silenceLength <= 0.9) {
              delta = 0.1;
            }
            this.setSilenceLength(this.silenceLength + delta);
          },
          text: 'Min. Length of Silence',
          help: 'Indicates how long each silent region will be.',
        },
        {
          name: 'silenceSensitivity',
          decrement: () => {
            this.setSilenceSensitivity(this.silenceSensitivity - 0.05);
          },
          increment: () => {
            this.setSilenceSensitivity(this.silenceSensitivity + 0.05);
          },
          text: 'Silence Sensitivity',
          help: 'Indicates how much random noise will be part of the silence detection algorithm.',
        },
        {
          name: 'silencePadding',
          decrement: () => {
            this.setSilencePadding(this.silencePadding - 0.2);
          },
          increment: () => {
            this.setSilencePadding(this.silencePadding + 0.2);
          },
          text: 'Silence Padding',
        },
      ],
    };
  },
  methods: {
    ...mapMutations([
      'toggleNormalizeAudio',
      'toggleSkipSilentRegions',
      'setSilenceLength',
      'setSilencePadding',
      'setSilenceSensitivity',
      'restoreRemovedRegion',
    ]),
  },
  computed: {
    ...mapGetters([
      'normalizeAudio',
      'skipSilentRegions',
      'silenceLength',
      'silencePadding',
      'silenceSensitivity',
    ]),
  },
};
</script>
