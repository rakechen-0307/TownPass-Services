<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useConnectionMessage } from '@/composables/useConnectionMessage';
import BaseButton from '@/components/atoms/BaseButton.vue';
import { useHandleConnectionData } from '@/composables/useHandleConnectionData';

const router = useRouter();
const text = ref('stop');
const recordText = ref('');

// 接收 APP 回傳資料
const handleRecordText = (event: { data: string }) => {
    const result: { name: string; data: string } = JSON.parse(event.data);
    recordText.value = result.data;
    console.log(result);
}
useHandleConnectionData(handleRecordText);

// 雙向溝通發生的地方
const onRecordClick = () => {
    if (text.value == 'stop') {
        text.value = 'start';
        console.log(text.value);
        useConnectionMessage('voice_record', text.value);
    }
    else if (text.value == 'start') {
        text.value = 'stop';
        console.log(text.value);
        useConnectionMessage('voice_record', text.value);
    }
};
</script>

<template>
    <div class="px-4 pt-10">
        <h4>{{ recordText }}</h4>
        <div class="fixed bottom-0 left-0 w-screen p-4 bg-white flex justify-center">
            <BaseButton class="w-full" @click="onRecordClick">
                {{ text == 'start' ? "Stop Recording" : "Start Recording" }}
            </BaseButton>
        </div>
    </div>
</template>