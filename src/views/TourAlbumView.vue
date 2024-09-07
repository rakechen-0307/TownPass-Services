<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useTourStore } from '@/stores/tour';
import { useConnectionMessage } from '@/composables/useConnectionMessage';
import { useHandleConnectionData } from '@/composables/useHandleConnectionData';
import BaseDialog from '@/components/atoms/BaseDialog.vue';
import TourDialog from './TourDialog.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import TourList from '@/components/organisms/TourList.vue';
import axios from 'axios';

export interface Tour {
    id: string;
    location: string;
    img_url: string;
    taken: string;
}

const store = useTourStore();
const route = useRoute();
const router = useRouter();

const { tourListMap } = storeToRefs(store);
const activeItem = computed(() => tourListMap.value.get(route.params.id as string));

const isTourDialogOpen = ref(false);

const { tourList } = storeToRefs(store);

const getTours = async () => {
    // try {
    //     const response = await axios.get('https://express-vercel-template-five.vercel.app/fetchPosts',{
    //         params: {
    //             "userId": "9cc0a534-3828-45e6-bce1-9505dae780f9",
    //             "proposalId": activeItem.value?.id
    //         }
    //     });
    //     console.log('Drafts fetched successfully:', response.data.posts);
    //     canvasDraftList.value = response.data.posts;
    //     console.log(canvasDraftList.value);
    // } catch (error) {
    //     console.error('Error fetching proposal:', error);
    // }
    tourList.value = [
      {id: '1', location: 'here', img_url: 'none', taken: 'today'}
    ]
}
onMounted(() => {getTours()})

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
      <div style="padding-top: 20px;">
        <TourList />
      </div>
      <div  class="fixed bottom-4 right-4">
        <div class="flex flex-col gap-3">
            <button class="draftBut" @click="isTourDialogOpen = true">
                <img src="@/assets/images/image-icon.svg">
                上傳照片紀念
            </button>
        </div>        
      </div>
        
    <TourDialog
      v-model="isTourDialogOpen"
      title="+"
      content=""
      :isAlert="false"
      positiveText="提交"
      negativeText="取消"
      @onPositiveClick=""
    />
  </div>
</template>
  
<style scoped>
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