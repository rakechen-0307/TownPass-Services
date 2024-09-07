<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, RouterLink } from 'vue-router';
import BaseButton from '@/components/atoms/BaseButton.vue';
import BaseDialog from '@/components/atoms/BaseDialog.vue';
import ServiceTabsView from '@/components/organisms/ServiceTabsView.vue';
import { useCanvasStore } from '@/stores/canvas';
import CityCanvasProposalView from './CityCanvasProposalView.vue';
import CanvasProposalList from '@/components/organisms/CanvasProposalList.vue';

const canvasDataJson = {
  "data": {
    "canvas_proposal_list": [
        {
            "id": "t-1",
            "name": "臺北市立美術館",
            "introduction": "臺北市立美術館成立於1983年，回應當時方興未艾的現在藝術運動而成立，是台灣首座公立美術館。",
            "address": {
                "text": "臺北市中山區圓山里8鄰中山北路三段181號",
                "map": "https://maps.app.goo.gl/sQKx4n3WctXuS5Bw8",
                "longitude": "123",
                "latitude": "132"
            },
            "img_url": "https://plus.unsplash.com/premium_photo-1686741733157-1d7863a7a04e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "start": "2020:01:04",
            "status": "approved",
            "author": "someone"
        },
        {
            "id": "t222",
            "name": "臺北市立美術館222222",
            "introduction": "回應當時方興未艾的現在藝術運動而成立，是台灣首座公立美術館。",
            "address": {
                "text": "臺北市中山區圓山里8鄰中山北路三段181號",
                "map": "https://maps.app.goo.gl/sQKx4n3WctXuS5Bw8",
                "longitude": "123",
                "latitude": "132"
            },
            "img_url": "https://plus.unsplash.com/premium_photo-1686741733157-1d7863a7a04e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "start": "2020:01:04",
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
canvasList.value = canvasDataJson.data.canvas_proposal_list;

</script>

<template>
    <section class="flex flex-col items-center p-4">
        <CanvasProposalList />
        <BaseButton class="fixed bottom-4 right-4">
            我要提案
        </BaseButton>
    </section>
</template>