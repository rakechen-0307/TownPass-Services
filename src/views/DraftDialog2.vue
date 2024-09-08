<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import BaseInput from '@/components/atoms/BaseInput.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import { useConnectionMessage } from '@/composables/useConnectionMessage';
import { useHandleConnectionData } from '@/composables/useHandleConnectionData';
import { ref, computed, watch, onMounted } from 'vue';

import { useImageUpload } from '@/composables/useImageUpload';
import { getStorage } from 'firebase/storage';
import { app } from '@/firebaseConfig';
import type { User } from '@/stores/user';
import axios from 'axios';

const props = defineProps<{
  title?: string;
  content: string;
  negativeText?: string;
  positiveText?: string;
  isAlert?: boolean;
  isCheck?: boolean;
  pid?: string;
}>();

const emit = defineEmits(['onPositiveClick', 'onNegativeClick']);

const isOpen = defineModel({ default: false });

const setIsOpen = () => {
  isOpen.value = true;
};

const onPositiveClick = () => {
  sendDataToServer();
  isOpen.value = false;
  emit('onPositiveClick');
};

const onNegativeClick = () => {
  isOpen.value = false;
  emit('onNegativeClick');
};

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const handleUserInfo = (event: { data: string }) => {
  const result: { name: string; data: User } = JSON.parse(event.data);

  user.value = result.data;
};


useConnectionMessage('userinfo', null);

useHandleConnectionData(handleUserInfo);

const nameInput = ref("");
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
    file.value = input.files[0];
    imageUrl.value = URL.createObjectURL(file.value);
    
    // Get image dimensions
    const img = new Image();
    img.onload = () => {
      imageSize.value = { width: img.width, height: img.height };
    };
    img.src = imageUrl.value;
  }
  isUploadSuccess.value = false;  // Reset when a new file is selected
};

const storage = getStorage(app, 'gs://codefest-test-0825.appspot.com');
const { downloadUrl, hasFailed, state, progressInPercentage, uploadFile } = useImageUpload();
const file = ref<File | null>(null);
const imageSize = ref({ width: 0, height: 0 });
const isUploadSuccess = ref(false);

const MAX_SIZE = 200; // Maximum width or height in pixels

const scaledImageSize = computed(() => {
  if (imageSize.value.width === 0 || imageSize.value.height === 0) {
    return { width: 'auto', height: 'auto' };
  }
  
  if (imageSize.value.width > imageSize.value.height) {
    return {
      width: `${Math.min(imageSize.value.width, MAX_SIZE)}px`,
      height: 'auto'
    };
  } else {
    return {
      width: 'auto',
      height: `${Math.min(imageSize.value.height, MAX_SIZE)}px`
    };
  }
});

const onUploadClick = () => {
  if (file.value) {
    uploadFile({
      storage,
      path: file.value.name,
      data: file.value
    });
  }
};

const sendDataToServer = async () => {
  if (downloadUrl.value && introductionInput.value && nameInput.value) {
    console.log(downloadUrl.value);
    try {
      const response = await axios.post('https://express-vercel-template-five.vercel.app/createPost', {
        proposalId: props.pid,
        image: downloadUrl.value,
        name: nameInput.value,
        description: introductionInput.value,
        userId: "8c17fdf1-9cd3-4087-b39f-5d655fb7cb36" // Modify later
      });
      console.log('Data sent successfully:', response.data);
      // Handle successful response (e.g., show a success message)
    } catch (error) {
      console.error('Error sending data:', error);
      // Handle error (e.g., show an error message)
    }
  }
};

watch(downloadUrl, (newUrl) => {
  if (newUrl) {
    imageUrl.value = newUrl;
    isUploadSuccess.value = true;
  }
});
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
                <BaseInput v-model="nameInput" placeholder="請輸入作品名稱" class="input-name-field w-full mb-3" :required="true"/>
                <div class="image-container">
                  <img 
                    v-if="imageUrl" 
                    :src="imageUrl" 
                    class="uploaded-image"
                    :style="{ width: scaledImageSize.width, height: scaledImageSize.height }"
                  />
                  <img v-else src="@/assets/images/image-icon.svg" class="placeholder-image" />
                  <button class="round-button" @click="handleImageUpload">
                    <p>+</p>
                  </button>
                  <input
                    type="file"
                    ref="fileInput"
                    @change="handleFileChange"
                    accept="image/*"
                    class="hidden"
                  />
                </div>
                <BaseButton 
                  @click="onUploadClick" 
                  :disabled="!file || state === 'running' || isUploadSuccess" 
                  class="mt-2"
                  style="background-color: white; color: #50B0C0;"
                >
                  <template v-if="isUploadSuccess">上傳成功！</template>
                  <template v-else-if="state === 'running'">上傳中：{{ progressInPercentage }}</template>
                  <template v-else>點此確認上傳圖片</template>
                </BaseButton>
                <p v-if="hasFailed" class="text-red-500 mt-2">Upload Failed!</p>
                <BaseInput v-model="introductionInput" placeholder="請輸入創作理念..." class="input-field w-full" :required="true"/>

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
                  class="flex justify-center font-bold w-full py-1 outline-none"
                  :class="{
                    'text-primary-500': isUploadSuccess,
                    'text-gray-200': !isUploadSuccess
                    }"
                  :disabled="!isUploadSuccess"
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
