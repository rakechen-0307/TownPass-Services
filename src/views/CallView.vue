<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useConnectionMessage } from '@/composables/useConnectionMessage';
import BaseButton from '@/components/atoms/BaseButton.vue';

const router = useRouter();
const phoneNumber = ref('');

const isValidPhoneNumber = computed(() => {
    // Add your phone number validation logic here
    return phoneNumber.value.length >= 1;
});

const onCallClick = () => {
    // 雙向溝通發生的地方
    useConnectionMessage('phone_call', phoneNumber.value);
};
</script>

<template>
    <div class="px-4 pt-10">
        <section class="fixed top-0 left-0 z-10 w-screen bg-white p-4 flex justify-between">
            <button @click="router.back()">
                <img src="@/assets/images/down-icon.svg" class="rotate-90" />
            </button>
            <span class="font-bold text-gray-700">Make a Call</span>
            <div />
        </section>

        <section class="mt-4">
            <div class="bg-primary-50 p-4 rounded-lg">
                <h2 class="text-primary-500 font-semibold text-xl mb-2">Enter Phone Number</h2>
                <input v-model="phoneNumber" type="tel" placeholder="Enter phone number"
                    class="w-full p-2 border border-primary-200 rounded" />
            </div>
        </section>

        <div class="fixed bottom-0 left-0 w-screen p-4 bg-white flex justify-center">
            <BaseButton :disabled="!isValidPhoneNumber" class="w-full" @click="onCallClick">
                Make Call
            </BaseButton>
        </div>
    </div>
</template>