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

const canvasDraftDataJson = {
  "data": {
    "canvas_draft_list": [
        {
            "id": "t-1",
            "name": "臺北市立美術館圖1",
            "introduction": "我的美麗作品",
            "proposal": "t-1",
            "img_url": "https://plus.unsplash.com/premium_photo-1686741733157-1d7863a7a04e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "start": "2020:01:06",
            "author": "someone else",
            "likes": 0
        },
        {
            "id": "t-1",
            "name": "臺北市立美術館圖2",
            "introduction": "我的美麗作品",
            "proposal": "t-1",
            "img_url": "https://plus.unsplash.com/premium_photo-1686741733157-1d7863a7a04e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "start": "2020:01:07",
            "author": "someone else",
            "likes": 3
        },
    ]
  }
};

export interface CanvasDraft {
    id: string;
    name: string;
    introduction: string;
    proposal: string;
    likes: number;
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

const isMapDialogOpen = ref(false);
const isDraftDialogOpen = ref(false);

const handleLaunchMap = (event: { data: string }) => {
  const result: { name: string; data: boolean } = JSON.parse(event.data);

  if (!result.data) {
    window.open(activeItem.value?.address.map, '_blank', 'noopener,noreferrer');
  }
};

useHandleConnectionData(handleLaunchMap);

const onMapOpenClick = () => {
  useConnectionMessage('launch_map', activeItem.value?.address.map);
};

const isIntroduceExpand = ref(false);

const { canvasDraftList } = storeToRefs(store);
canvasDraftList.value = canvasDraftDataJson.data.canvas_draft_list;

const onDraftSubmission = () => {
    
};

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
    <img
      :src="activeItem?.img_url"
      :alt="activeItem?.name"
      class="rounded-md w-full h-48 mt-3 object-cover"
    />
    <div class="flex flex-row justify-between items-center">
        <h1 class="font-bold text-2xl mt-2 mb-4">{{ activeItem?.name }}</h1>
        <p style="color: #50B0C0; padding: 1px;">{{ activeItem?.author }}</p>
    </div>
    <section>
      <div class="grid grid-cols-9">
        <img src="@/assets/images/location-icon.svg" />
        <a
          :href="activeItem?.address.map"
          class="col-span-8 underline"
          @click.prevent="isMapDialogOpen = true"
        >
          {{ activeItem?.address.text }}
        </a>
      </div>
      <div class="grid grid-cols-9 my-2">
        <img src="@/assets/images/calendar-icon.svg" />
        <div class="col-span-8">
          <p class="font-bold">提案時間</p>
          <p>{{ activeItem?.start }}</p>
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
        <CanvasDraftList />
      </div>
      <BaseButton class="fixed bottom-4 right-4" @click="isDraftDialogOpen = true">
        我要投稿
    </BaseButton>
    </section>  
    <BaseDialog
      v-model="isMapDialogOpen"
      title="是否要開啟 Google Map"
      content="開啟 Google Maps APP 導航?"
      :isAlert="true"
      positiveText="開啟"
      negativeText="取消"
      @onPositiveClick="onMapOpenClick"
    />
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
