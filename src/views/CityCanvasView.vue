<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, RouterLink } from 'vue-router';
import BaseButton from '@/components/atoms/BaseButton.vue';
import BaseDialog from '@/components/atoms/BaseDialog.vue';
import ServiceTabsView from '@/components/organisms/ServiceTabsView.vue';
import { useCanvasStore } from '@/stores/canvas';
import CityCanvasProposalView from './CityCanvasProposalView.vue';
import CanvasProposalList from '@/components/organisms/CanvasProposalList.vue';
import ProposalDialog from './ProposalDialog.vue';
import axios from 'axios';

const canvasDataJson = {
  "data": {
    "canvas_proposal_list": [
        {
            "id": "t-1",
            "name": "藍色櫃櫃",
            "introduction": "台大藍色櫃櫃是一個放置在台灣大學校園內的藍色櫃子，為學生提供自由取用或交換物品的空間。櫃子成為了學生們互助分享的象徵，無論是書籍、文具，還是小物件，大家都可以在這裡找到需要的物品或貢獻自己不再使用的東西，營造出一種關懷與共享的氛圍。",
            "address": {
                "text": "臺北市中山區圓山里8鄰中山北路三段181號",
                "map": "https://maps.app.goo.gl/sQKx4n3WctXuS5Bw8",
                "longitude": "123",
                "latitude": "132"
            },
            "img_url": "https://plus.unsplash.com/premium_photo-1686741733157-1d7863a7a04e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "start": "2024-09-07T06:30:00+08:00",
            "status": "approved",
            "author": "someone"
        },
        {
            "id": "t222",
            "name": "黑色椅子",
            "introduction": "今天我心情有一點怪怪的，可是說不出來到底為甚麼。",
            "address": {
                "text": "臺北市中山區圓山里8鄰中山北路三段181號",
                "map": "https://maps.app.goo.gl/sQKx4n3WctXuS5Bw8",
                "longitude": "123",
                "latitude": "132"
            },
            "img_url": "https://plus.unsplash.com/premium_photo-1686741733157-1d7863a7a04e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "start": "2020-09-07T06:30:00+08:00",
            "status": "approved",
            "author": "someone"
        }
    ]
  }
};

export interface CanvasProposal {
    id: string;
    name: string;
    introduction: string;
    address: {
        text: string;
        map: string;
        longitude: string;
        latitude: string;
    };
    img_url: string;
    start: string;
    status: string;
    author: string;
}

const route = useRoute();
const store = useCanvasStore();

const { canvasList } = storeToRefs(store);
const getProposal = async () => {  
    try {
        const response = await axios.get('https://express-vercel-template-five.vercel.app/fetchActivities');
        console.log('Proposal fetched successfully:', response.data);
        canvasList.value = response.data;
        console.log(canvasList);
        // Handle successful response (e.g., show a success message)
    } catch (error) {
        console.error('Error sending proposal:', error);
        // Handle error (e.g., show an error message)
    }
};
// canvasList.value = canvasDataJson.data.canvas_proposal_list;

const isProposalDialogOpen = ref(false);

const onProposalSubmission = () => {
    
};
onMounted(() => {getProposal();});

</script>

<template>
    <section class="flex flex-col items-center p-4">
        <CanvasProposalList />
        <BaseButton class="fixed bottom-4 right-4" @click="isProposalDialogOpen = true">
            我要提案
        </BaseButton>
        <ProposalDialog
            v-model="isProposalDialogOpen"
            :isAlert="false"
            @onPositiveClick="onProposalSubmission"
        />
    </section>
</template>