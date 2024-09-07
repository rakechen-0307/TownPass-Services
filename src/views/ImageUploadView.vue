<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useImageUpload } from '@/composables/useImageUpload';
import BaseButton from '@/components/atoms/BaseButton.vue';
import { getStorage } from 'firebase/storage';
import { app } from '@/firebaseConfig';

// app is the firebase app
const storage = getStorage(app, 'gs://codefest-test-0825.appspot.com');

const { downloadUrl, hasFailed, state, progressInPercentage, uploadFile } = useImageUpload();
const file = ref<File>();
const previewUrl = ref<string>('');
const imageSize = ref({ width: 0, height: 0 });

const MAX_SIZE = 300; // Maximum width or height in pixels

const scaledImageSize = computed(() => {
  if (imageSize.value.width === 0 || imageSize.value.height === 0) {
    return { width: 'auto', height: 'auto' };
  }
  
  const aspectRatio = imageSize.value.width / imageSize.value.height;
  
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
      data: file.value as Blob
    });
  }
};

const onInputChange = (event: Event) => {
  const { files } = event.target as HTMLInputElement;

  if (files) {
    file.value = files[0];
    previewUrl.value = URL.createObjectURL(files[0]);
    
    // Get image dimensions
    const img = new Image();
    img.onload = () => {
      imageSize.value = { width: img.width, height: img.height };
    };
    img.src = previewUrl.value;
  }
};

watch(downloadUrl, (newUrl) => {
  if (newUrl) {
    previewUrl.value = newUrl;
  }
});
</script>

<template>
  <div class="p-5 upload-wrapper">
    <h5 class="text-primary-500 mb-10 text-[32px] font-bold title">Image Upload</h5>
    
    <div class="mb-4">
      <input type="file" @change="onInputChange" accept="image/*" class="mb-2" />
      <BaseButton @click="onUploadClick" :disabled="!file || state === 'running'" class="ml-2">
        <template v-if="state === 'running'"> Uploading: {{ progressInPercentage }} </template>
        <template v-else> Upload! </template>
      </BaseButton>
    </div>

    <div v-if="previewUrl" class="mt-4 mb-4">
      <h6 class="text-primary-500 mb-2 text-[18px] font-bold">Image Preview:</h6>
      <img 
        :src="previewUrl" 
        alt="Preview" 
        class="border border-gray-300 rounded object-contain"
        :style="{ width: scaledImageSize.width, height: scaledImageSize.height }"
      />
    </div>

    <p v-if="hasFailed" class="text-red-500 mb-2">Upload Failed!</p>

    <div v-if="!!downloadUrl" class="mt-4">
      <h6 class="text-primary-500 mb-2 text-[18px] font-bold">Download URL:</h6>
      <a :href="downloadUrl" target="_blank" class="text-blue-500 hover:underline break-all">
        {{ downloadUrl }}
      </a>
    </div>
  </div>
</template>