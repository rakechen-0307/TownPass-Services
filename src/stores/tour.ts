import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { Tour } from '@/views/TourAlbumView.vue';

export const useTourStore = defineStore('coupon', () => {
    const tourList = ref<Tour[] | []>();
  
    const tourListMap = computed(() => new Map(tourList.value?.map((item) => [item.id, item])));
   
    return { tourList, tourListMap };
  });