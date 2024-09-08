<script setup lang="ts">
import { defineProps, computed, ref, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps<{
  id: string;
  img_url: string;
  location: string;
  taken: string;
}>();

/*
const formattedTime = computed(() => {
  console.log(props.taken);
  const inputDate = new Date(props.taken);
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
*/

</script>

<!-- 在收起時顯示 -->
<template>
    <div class="flex flex-col items-center w-[95%] mx-auto">
        <img :src="props.img_url" :alt="props.location" class="w-full h-[75%] object-cover rounded-md mb-2.5" />
        <div class="w-full pl-1">
            <div class="flex justify-between items-center">
                <p class="font-bold text-left truncate">{{ props.location }}</p>                
            </div>
            <p class="text-right text-[11px] text-gray-500">
                {{ props.taken }}
            </p>
        </div>
    </div>
</template>
