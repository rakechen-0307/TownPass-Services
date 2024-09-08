<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCanvasStore } from '@/stores/canvas';
import { useConnectionMessage } from '@/composables/useConnectionMessage';
import { useHandleConnectionData } from '@/composables/useHandleConnectionData';
import BaseDialog from '@/components/atoms/BaseDialog.vue';
import DraftDialog from './DraftDialog.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import CanvasDraftList from '@/components/organisms/CanvasDraftList.vue';
import axios from 'axios';

// const canvasDraftDataJson = {
//   "data": {
//     "canvas_draft_list": [
//         {
//             "id": "t-1",
//             "name": "橘色櫃櫃",
//             "introduction": "長草了",
//             "proposal": "t-1",
//             "img_url": "https://plus.unsplash.com/premium_photo-1686741733157-1d7863a7a04e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//             "start": "2024-09-08T06:30:00+08:00",
//             "author": "someone else",
//             "likes": 0
//         },
//         {
//             "id": "t-2",
//             "name": "棋盤櫃櫃",
//             "introduction": "綠豆糕。",
//             "proposal": "t-1",
//             "img_url": "https://plus.unsplash.com/premium_photo-1686741733157-1d7863a7a04e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//             "start": "2024-09-08T06:40:00+08:00",
//             "author": "someone else",
//             "likes": 3
//         },
//         {
//             "id": "t-3",
//             "name": "rericha",
//             "introduction": "沒有人會念。",
//             "proposal": "t-1",
//             "img_url": "https://plus.unsplash.com/premium_photo-1686741733157-1d7863a7a04e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//             "start": "2024-09-08T06:50:00+08:00",
//             "author": "someone else",
//             "likes": 4
//         },
//     ]
//   }
// };

export interface CanvasDraft {
    id: string;
    name: string;
    introduction: string;
    proposal: string;
    likes: number;
    liked: boolean;
    img_url: string;
    start: string;
    author: string;
}

const store = useCanvasStore();
const route = useRoute();
const router = useRouter();

const { canvasListMap } = storeToRefs(store);
const activeItem = computed(() => canvasListMap.value.get(route.params.id as string));

if (!activeItem.value?.id) {
  router.push({
    name: 'city-canvas'
  });
}

const isDraftDialogOpen = ref(false);
const isCreationDialogOpen = ref(false);

const isIntroduceExpand = ref(true);

const { canvasDraftList } = storeToRefs(store);

const getDrafts = async () => {
    try {
        const response = await axios.get('https://express-vercel-template-five.vercel.app/fetchPosts',{
            params: {
                "userId": "9cc0a534-3828-45e6-bce1-9505dae780f9",
                "proposalId": activeItem.value?.id
            }
        });
        console.log('Drafts fetched successfully:', response.data.posts);
        canvasDraftList.value = response.data.posts;
        console.log(canvasDraftList.value);
    } catch (error) {
        console.error('Error fetching proposal:', error);
    }
}
onMounted(() => {getDrafts()})
// canvasDraftList.value = canvasDraftDataJson.data.canvas_draft_list;

const formattedTime = (start: string) => {
  const inputDate = new Date(start);

  const taiwanYear = inputDate.getFullYear() - 1911;
  const month = inputDate.getMonth() + 1;
  const day = inputDate.getDate();
  const hours = inputDate.getHours();
  const minutes = inputDate.getMinutes().toString().padStart(2, '0');

  const period = hours < 12 ? '早上' : hours < 18 ? '下午' : '晚上';
  const formattedHours = hours % 12 || 12;

  return `${taiwanYear}年 ${month}月${day}日 ${period}${formattedHours}:${minutes}`;
};


const onDraftSubmission = () => {
    
};

const openCanvas = (url: string) => {
  console.log(url);
  const img = new Image();
  img.src = url;
  console.log(url);
  img.onload = () => {
    console.log(img.naturalWidth, img.naturalHeight);
  };

  router.push({
    name: 'canvas',
    params: {
      link: url,
      width: img.naturalWidth,
      height: img.naturalHeight,
      pid: window.location.pathname.replace("/city-canvas/proposal/", "")
    }
  })
}

</script>

<template>
  <div class="py-2 px-4">
    <div class="flex justify-between">
      <RouterLink
        :to="{
          name: 'city-canvas',
        }"
      >
        <img src="@/assets/images/down-icon.svg" class="rotate-90" />
      </RouterLink>
      <h2 class="font-bold text-lg">{{ activeItem?.name }}</h2>
      <div />
    </div>
    <!-- <img
      :src="activeItem?.img_url"
      :alt="activeItem?.name"
      class="rounded-md h-full mt-3 object-cover"
    /> -->
    <div class="image-container">
        <img
            :src="activeItem?.img_url"
            :alt="activeItem?.name"
            class="rounded-md h-full object-cover"
        />
        <button class="icon-button">
            <img
                class="icon"
                src="@/assets/images/download-icon.svg"
            />
        </button>
    </div>
    <div class="flex flex-row justify-between items-center">
        <h1 class="font-bold text-2xl mt-2 mb-4">{{ activeItem?.name }}</h1>
        <p style="color: #50B0C0; padding: 1px;">{{ activeItem?.author }}</p>
    </div>
    <section>
      <!-- <div class="grid grid-cols-9">
        <img src="@/assets/images/location-icon.svg" />
        <a
          :href="activeItem?.address.map"
          class="col-span-8 underline"
          @click.prevent="isMapDialogOpen = true"
        >
          {{ activeItem?.address.text }}
        </a>
      </div> -->
      <div class="grid grid-cols-9 my-2">
        <img src="@/assets/images/calendar-icon.svg" />
        <div class="col-span-8">
          <p class="font-bold">提案時間</p>
          <p v-if="activeItem" >{{ formattedTime(activeItem?.start) }}</p>
          </div>
      </div>
      <div class="grid grid-cols-9">
        <img src="@/assets/images/introduce-icon.svg" />
        <div class="col-span-8">
          <div class="flex justify-between">
            <span class="font-bold">說明</span>
            <button @click="isIntroduceExpand = !isIntroduceExpand">
              <img
                src="@/assets/images/down-icon.svg"
                class="transition-transform"
                :class="{
                  'rotate-180': isIntroduceExpand
                }"
              />
            </button>
          </div>
          <div
            class="grid grid-rows-[0fr] transition-all"
            :class="{
              'grid-rows-[1fr]': isIntroduceExpand
            }"
          >
            <p class="overflow-hidden">{{ activeItem?.introduction }}</p>
          </div>
        </div>
      </div>
      <div style="padding-top: 20px;">
        <h1 class="font-bold text-lg m-4" style="color: #50B0C0;">市民作品</h1>
        <CanvasDraftList />
      </div>
      <div  class="fixed bottom-4 right-4">
        <div class="flex flex-col gap-3">
            <!-- <button class="draftBut" @click="isCreationDialogOpen = true"> -->
            <button class="draftBut" @click="openCanvas(activeItem?.img_url ?? '')">
                <img src="@/assets/images/draw-icon.svg">
                開始創作
            </button>
            <button class="draftBut" @click="isDraftDialogOpen = true">
                <img src="@/assets/images/add-photo-icon.svg">
                上傳作品
            </button>
        </div>        
      </div>
    </section>
    <DraftDialog
      v-model="isDraftDialogOpen"
      title="上傳新稿件"
      content=""
      :isAlert="false"
      positiveText="提交"
      negativeText="取消"
      @onPositiveClick="onDraftSubmission"
    />
  </div>
</template>
  
<style scoped>
.image-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: fit-content;
  margin-top: 1%;
  margin-bottom: 1%;
}

.icon-button {
  position: absolute;
  opacity: 70%;
  bottom: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  background-color: #50b0c0;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1; /* Ensure the button is above the image */
}

.icon-button .icon {
  width: 70%;
  height: 70%;
  color: white;
}

.draftBut {
    display: flex;
    flex-direction: row;
    gap: 8px;
    background-color: #50b0c0;
    color: white;
    border-radius: 10rem;
    padding: 8px;
    padding-left: 15px;
    padding-right: 20px;
}
</style>