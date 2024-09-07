<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useConnectionMessage } from '@/composables/useConnectionMessage';
import BaseButton from '@/components/atoms/BaseButton.vue';
import { useHandleConnectionData } from '@/composables/useHandleConnectionData';

const router = useRouter();
const recordText = ref('');

// 接收 APP 回傳資料
const handleRecordText = (event: { data: string }) => {
    const result: { name: string; data: string } = JSON.parse(event.data);
    recordText.value = result.data;
}
useHandleConnectionData(handleRecordText);

// 雙向溝通發生的地方
const onRecordClick = () => {
    useConnectionMessage('voice_record', 'start');
};
</script>

<template>
    <div class="px-4 pt-10">
        <div class="flex justify-center">
            <h4>{{ recordText }}</h4>
        </div>
        <div class="fixed bottom-0 left-0 w-screen p-4 bg-white flex justify-center">
            <BaseButton class="w-full" @click="onRecordClick">
                Start Recording
            </BaseButton>
        </div>
    </div>
</template>