<script setup lang="ts">
import { defineProps, computed } from 'vue';

const props = defineProps<{
  name: string;
  introduction: string;
  img_url: string;
  time: string; 
}>();

const formattedTime = computed(() => {
  const inputDate = new Date(props.time);
  const now = new Date();

  const isToday = inputDate.toDateString() === now.toDateString();

  if (isToday) {
    const hours = inputDate.getHours();
    const minutes = inputDate.getMinutes().toString().padStart(2, '0');
    const period = hours < 12 ? '早上' : '下午';
    return `今天${period} ${hours}:${minutes}`;
  } else {
    const taiwanYear = inputDate.getFullYear() - 1911;
    const month = inputDate.getMonth() + 1;
    const day = inputDate.getDate();
    return `${taiwanYear}年 ${month}月${day}日`;
  }
});

    const downloadImage = () => {
        const url = 'https://example.com/file.pdf'; // Replace with your file URL
        const link = document.createElement('a');
        link.href = url;
        link.download = 'file.pdf'; // Optional: specify the default file name
        link.click();
    }
</script>

<template>
    <div class="flex w-[95%] mx-auto">
    <!-- Image Section -->
    <img :src="props.img_url" :alt="props.name" class="w-[40%] h-auto object-cover rounded-md" />

    <!-- Text Content Section -->
    <div class="flex flex-col justify-between w-[60%] pl-3">
        <div>
        <!-- Name and Description -->
        <p class="font-bold text-left truncate">{{ props.name }}</p>
        <p class="text-ellipsis overflow-hidden text-left" style="-webkit-line-clamp: 3; display: -webkit-box; -webkit-box-orient: vertical;">
            {{ props.introduction }}
        </p>
        </div>

        <!-- Time Formatting -->
        <p class="text-right text-sm text-gray-500">
            {{ formattedTime }}
        </p>
    </div>
    </div>
</template>
