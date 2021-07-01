<template>
  <div class="h-full">
    <div class="text-3xl font-bold pb-4">Atomic Edits</div>
    <div class="flex flex-col space-y-2">
      <div
        v-for="booleanSetting in booleanSettings"
        :key="booleanSetting.text"
        class="flex text-xl justify-between place-items-center"
      >
        <div>
          {{ booleanSetting.text }}
        </div>

        <button
          @click="this[booleanSetting.methodName]()"
          class="focus:outline-none hover:text-primary-hover"
        >
          <fa v-if="this[booleanSetting.name]" icon="toggle-on" />
          <fa v-else icon="toggle-off" />
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
          name: 'normalizeAudio',
          methodName: 'toggleNormalizeAudio',
          text: 'Normalize Audio',
          icon: 'toggle-on',
        },
        {
          name: 'skipSilentRegions',
          methodName: 'toggleSkipSilentRegions',
          text: 'Skip Silent Regions',
          icon: 'toggle-on',
        },
      ],
    };
  },
  methods: {
    ...mapMutations(['toggleNormalizeAudio', 'toggleSkipSilentRegions']),
  },
  computed: {
    ...mapGetters(['normalizeAudio', 'skipSilentRegions']),
  },
};
</script>
