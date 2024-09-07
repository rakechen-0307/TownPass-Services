<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  name: string;
  introduction: string;
  img_url: string;
  likes: number
}>();
</script>

<!-- 在收起時顯示 -->
<template>
    <div class="flex flex-col items-center w-[95%] mx-auto">
        <img :src="props.img_url" :alt="props.name" :likes="props.likes" class="w-full h-[75%] object-cover rounded-md mb-2.5" />
        <div class="w-full pl-1">
        <div class="flex justify-between items-center">
            <p class="font-bold text-left truncate">{{ props.name }}</p>
            <div class="flex items-center space-x-1">
            <img url="@/assets/images/heart-icon.svg" class="w-5 h-5">
            <p class="text-sm">{{ props.likes }}</p>
            </div>
        </div>
        <p class="text-ellipsis overflow-hidden whitespace-nowrap text-left">{{ props.introduction }}</p>
        </div>
    </div>
</template>
