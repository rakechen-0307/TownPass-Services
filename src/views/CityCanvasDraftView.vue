<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCanvasStore } from '@/stores/canvas';
import { useConnectionMessage } from '@/composables/useConnectionMessage';
import { useHandleConnectionData } from '@/composables/useHandleConnectionData';
import BaseButton from '@/components/atoms/BaseButton.vue';
const store = useCanvasStore();
const route = useRoute();
const router = useRouter();

const { canvasDraftListMap } = storeToRefs(store);
const activeItem = computed(() => canvasDraftListMap.value.get(route.params.id as string));

if (!activeItem.value?.id) {
  router.push({
    name: 'city-canvas'
  });
}

const isIntroduceExpand = ref(true);

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

</script>

<template>
  <div class="py-2 px-4">
    <div class="flex justify-between">
      <RouterLink
        :to="{
            path: '/city-canvas/proposal/' + activeItem?.proposal
        }"
      >
        <img src="@/assets/images/down-icon.svg" class="rotate-90" />
      </RouterLink>
      <h2 class="font-bold text-lg">{{ activeItem?.name }}</h2>
      <div />
    </div>
    <div class="image-container">
        <img
            :src="activeItem?.img_url"
            :alt="activeItem?.name"
            class="rounded-md h-full object-cover"
        />
    </div>
    <div class="flex flex-row justify-between items-center">
        <div class="flex flex-row justify-between items-center">
            <img src="@/assets/images/heart-icon.svg" class="m-1" />
            <h1 class="font-bold text-2xl mt-3 mb-3">{{ activeItem?.name }}</h1>
        </div>
        <p style="color: #50B0C0; padding: 1px;">{{ activeItem?.author }}</p>
    </div>
    <section>
      <div class="grid grid-cols-9 my-2">
        <img src="@/assets/images/calendar-icon.svg" />
        <div class="col-span-8">
          <p class="font-bold">草稿投遞時間</p>
          <p v-if="activeItem">{{ formattedTime(activeItem?.start) }}</p>
          </div>
      </div>
      <div class="grid grid-cols-9">
        <img src="@/assets/images/heart-black-outline-icon.svg" />
        <div class="col-span-8">
            <span class="font-bold">喜歡人數</span>
          <div
            class="grid grid-rows-[0fr] transition-all"
            :class="{
              'grid-rows-[1fr]': isIntroduceExpand
            }"
          >
            <p class="overflow-hidden">{{ activeItem?.likes }}</p>
          </div>
        </div>
      </div>
      <div style="padding-top: 20px;">
        <CanvasDraftList />
      </div>
      <div class="grid grid-cols-9">
        <img src="@/assets/images/introduce-icon.svg" />
        <div class="col-span-8">
          <div class="flex justify-between">
            <span class="font-bold">創作理念</span>
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
    </section>
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
  opacity: 80%;
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
</style>