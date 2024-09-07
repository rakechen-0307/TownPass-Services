import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { CanvasProposal } from '@/views/CityCanvasView.vue';
import type { CanvasDraft } from '@/views/CityCanvasProposalView.vue';

export const useCanvasStore = defineStore('coupon', () => {
    const canvasList = ref<CanvasProposal[] | []>();
    const canvasDraftList = ref<CanvasDraft[] | []>();
  
    const canvasListMap = computed(() => new Map(canvasList.value?.map((item) => [item.id, item])));
    const canvasDraftListMap = computed(() => new Map(canvasDraftList.value?.map((item) => [item.id, item])));

    return { canvasList, canvasListMap, canvasDraftList, canvasDraftListMap };
  });