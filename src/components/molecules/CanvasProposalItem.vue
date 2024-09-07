<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  name: string;
  introduction: string;
  img_url: string;
}>();
</script>

<template>
  <div class="grid grid-cols-4">
    <img :src="props.img_url" :alt="props.name" class="rounded-full w-20 h-20 object-cover" />
    <div class="col-span-3 pl-1">
      <p class="font-bold">{{ props.name }}</p>
      <p class="text-ellipsis overflow-hidden whitespace-nowrap">{{ props.introduction }}</p>
    </div>
  </div>
</template>
