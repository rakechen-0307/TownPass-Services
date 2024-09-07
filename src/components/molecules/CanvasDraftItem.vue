<script setup lang="ts">
import { defineProps, computed, ref, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps<{
    id: string;
  name: string;
  introduction: string;
  img_url: string;
  likes: number;
  liked: boolean;
  start: string;
}>();

const liked = ref(false);

const toggleLiked = async() => {
    liked.value = !liked.value;
    await axios.post('https://express-vercel-template-five.vercel.app/like', {
        userId: "9cc0a534-3828-45e6-bce1-9505dae780f9",
        postId: props.id
    })
}

const formattedTime = computed(() => {
  const inputDate = new Date(props.start);
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

onMounted(() => {liked.value = props.liked})
</script>

<!-- 在收起時顯示 -->
<template>
    <div class="flex flex-col items-center w-[95%] mx-auto">
        <img :src="props.img_url" :alt="props.name" :likes="props.likes" :liked="props.liked" class="w-full h-[75%] object-cover rounded-md mb-2.5" />
        <div class="w-full pl-1">
            <div class="flex justify-between items-center">
                <p class="font-bold text-left truncate">{{ props.name }}</p>
                <div class="flex items-center space-x-1 mr-2">
                    <!-- HEART -->
                     <!-- props.id -->
                    <img v-if="liked" src="@/assets/images/heart-filled-icon.svg" class="m-1" @click="toggleLiked" />
                    <img v-else src="@/assets/images/heart-icon.svg" class="m-1" @click="toggleLiked" />  
                    <p class="text-sm">{{ props.likes }}</p>
                </div>
            </div>
            <p class="text-ellipsis overflow-hidden whitespace-nowrap text-left">{{ props.introduction }}</p>
            <p class="text-right text-[11px] text-gray-500">
                {{ formattedTime }}
            </p>
        </div>
    </div>
</template>
