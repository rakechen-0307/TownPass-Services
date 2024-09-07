<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCanvasStore } from '@/stores/canvas';
import CanvasDraftItem from '../molecules/CanvasDraftItem.vue';

const store = useCanvasStore();
const { canvasDraftList } = storeToRefs(store);
</script>

<template>
  <ul class="grid grid-cols-2 gap-y-3">
    <li v-for="item in canvasDraftList" :key="item.id" class="border-gray-200 border-b pb-2">
      <RouterLink :to="{ name: 'draft', params: { id: item.id } }">
        <CanvasDraftItem
          :name="item.name"
          :img_url="item.img_url"
          :introduction="item.introduction"
          :likes="item.likes"
          :start="item.start"
        />
      </RouterLink>
    </li>
  </ul>
</template>
