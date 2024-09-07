<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue';

import BaseInput from '@/components/atoms/BaseInput.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';

import { ref } from 'vue';

const props = defineProps<{
  title?: string;
  content: string;
  negativeText?: string;
  positiveText?: string;
  isAlert?: boolean;
  isCheck?: boolean;
}>();

const emit = defineEmits(['onPositiveClick', 'onNegativeClick']);

const isOpen = defineModel({ default: false });

const setIsOpen = () => {
  isOpen.value = true;
};

const onPositiveClick = () => {
  isOpen.value = false;
  emit('onPositiveClick');
};

const onNegativeClick = () => {
  isOpen.value = false;
  emit('onNegativeClick');
};

const introductionInput = ref("");

const fileInput = ref<HTMLInputElement | null>(null);
const imageUrl = ref<string | null>(null);

const handleImageUpload = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    // You can handle the file upload here, e.g., send it to a server
    // For now, we'll just display the image locally
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) {
        imageUrl.value = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  }
};
</script>

<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" :open="isOpen" @close="setIsOpen" class="relative z-30">
      <div class="fixed inset-0 bg-black/25">
        <div class="min-h-full flex justify-center items-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-4/5 max-w-screen-md flex flex-col transform overflow-y-auto bg-white transition-all rounded pt-4"
            >
              <div v-if="props.isAlert" class="flex justify-center">
                <img src="@/assets/images/alert-icon.svg" class="w-24" />
              </div>
              <div v-else-if="props.isCheck" class="flex justify-center">
                <img src="@/assets/images/check-icon.svg" class="w-24" />
              </div>
              <DialogTitle v-if="props.title" class="text-xl text-center font-extrabold">
                {{ title }}
              </DialogTitle>

              <div class="px-4 my-5">
                <p class="text-center font-bold">{{ props.content }}</p>
              </div>

              <!-- content -->
                <div class="image-container">
                    <img v-if="imageUrl" :src="imageUrl" class="uploaded-image" />
                    <img v-else src="@/assets/images/image-icon.svg" class="placeholder-image" />
                    <button class="round-button" @click="handleImageUpload">
                     <p>+</p>
                    </button>
                    <input type="file" ref="fileInput" @change="handleFileChange" class="hidden" />
                </div>
                <BaseInput placeholder="請輸入創作理念..." readonly class="input-field w-full" />

              <div
                class="mt-auto py-1 border-t-gray-200 border-t"
                :class="{ 'grid grid-cols-2': negativeText }"
              >
                <button
                  v-if="props.negativeText"
                  type="button"
                  class="flex justify-center text-gray-500 font-bold w-full py-1 outline-none"
                  @click="onNegativeClick"
                >
                  {{ negativeText }}
                </button>
                <button
                  type="button"
                  class="flex justify-center text-primary-500 font-bold w-full py-1 outline-none"
                  @click="onPositiveClick"
                >
                  {{ positiveText || '確認' }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style lang="postcss">
.image-container {
    position: relative;
    width: 100%; /* Adjust as needed */
    height: 200px; /* Adjust as needed */
    display: flex;
    justify-content: center;
    align-items: center;
}

.uploaded-image,
.placeholder-image {
    width: 100%;
    height: 100%;
}

.placeholder-image {
    color: #F1F3F4; /* Placeholder icon color */
    opacity: 20%;
}

.round-button {
    position: absolute;
    bottom: 5px;
    right: 30px;
    width: 40px;
    color: white;
    font-size: x-large;
    height: 40px;
    background-color: #F0C87C;
    border-radius: 50%;
    padding: 10px;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
}

.icon {
    width: 24px; 
    height: 24px;
}

.input-field {
    margin-top: 20px;
    height: 100px;
}
</style>
