<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useTourStore } from '@/stores/tour';
import TourItem from '../molecules/TourItem.vue';

const store = useTourStore();
const { tourList } = storeToRefs(store);
</script>

<template>
  <ul class="grid grid-cols-2 gap-y-3">
    <li v-for="item in tourList" :key="item.id" class="border-gray-200 border-b pb-2">
      <TourItem
          :id="item.id"
          :img_url="item.img_url"
          :location="item.location"
          :taken="item.visitedAt"
      />
    </li>
  </ul>
</template>
