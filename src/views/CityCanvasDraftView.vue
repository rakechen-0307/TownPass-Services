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

const isIntroduceExpand = ref(false);
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
      <div class="grid grid-cols-9 my-2">
        <img src="@/assets/images/calendar-icon.svg" />
        <div class="col-span-8">
          <p class="font-bold">草稿投遞時間</p>
          <p>{{ activeItem?.start }}</p>
          </div>
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
