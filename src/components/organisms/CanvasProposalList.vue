<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCanvasStore } from '@/stores/canvas';
import CanvasProposalItem from '../molecules/CanvasProposalItem.vue';

const store = useCanvasStore();
const { canvasList } = storeToRefs(store);
</script>

<template>
  <ul class="grid grid-cols-1 gap-y-5">
    <li v-for="item in canvasList" :key="item.id" class="border-gray-200 border-b pb-2">
      <RouterLink :to="{ name: 'proposal', params: { id: item.id } }">
        <CanvasProposalItem
          :name="item.name"
          :img_url="item.img_url"
          :introduction="item.introduction"
          :time="item.start"
        />
      </RouterLink>
    </li>
  </ul>
</template>
