<template>
  <div class="border h-full">
    <div class="flex place-items-center justify-around h-full">
      <div class="text-3xl font-bold">
        <div v-if="percent === 100" class="flex flex-col space-y-2">
          <div>Export Complete!</div>
          <div class="flex place-items-center space-x-2">
            <div>Go back</div>
            <button
              class="
                text-3xl
                font-bold
                hover:text-primary-hover
                focus:outline-none
              "
              @click="hideExportingUI"
            >
              <fa icon="check-square" />
            </button>
          </div>
        </div>
        <div v-else>Exporting... {{ percent }}%</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'ExportingUI',
  data() {
    return {
      percent: 0,
    };
  },
  mounted() {
    window.ipc.on('EXPORT_PROGRESS', (payload) => {
      this.percent = Math.round(payload.percent);
    });
    window.ipc.on('EXPORT_COMPLETE', () => {
      this.percent = 100;
    });
    console.log('mounted');
  },
  methods: {
    ...mapMutations(['setShowExportingUI']),

    hideExportingUI() {
      this.setShowExportingUI(false);
    },
  },
};
</script>

