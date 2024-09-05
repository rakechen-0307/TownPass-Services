import {
  type FirebaseStorage,
  type TaskState,
  getDownloadURL,
  ref as firebaseStorageRef,
  uploadBytesResumable
} from 'firebase/storage';
import { ref, computed } from 'vue';

export const useImageUpload = () => {
  const downloadUrl = ref('');
  const hasFailed = ref(false);
  const state = ref<TaskState>();
  const progress = ref(0);
  const progressInPercentage = computed(() => {
    return `${progress.value}%`;
  });
  const calculatePercentage = (numerator: number, denominator: number): number => {
    if (denominator === 0) {
      return 0;
    }

    return Math.round((numerator / denominator) * 100);
  };
  const uploadFile = ({
    storage,
    path,
    data
  }: {
    storage: FirebaseStorage;
    path: string;
    data: Blob | Uint8Array | ArrayBuffer;
  }) => {
    // reset every time we upload
    hasFailed.value = false;
    progress.value = 0;

    const storageRef = firebaseStorageRef(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, data);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        progress.value = calculatePercentage(snapshot.bytesTransferred, snapshot.totalBytes);
        state.value = snapshot.state;
      },
      () => {
        hasFailed.value = true;
      },
      async () => {
        // upload has completed successfully -> update state & generate download link.
        state.value = 'success';
        downloadUrl.value = await getDownloadURL(uploadTask.snapshot.ref);
      }
    );

    return uploadTask;
  };

  return {
    downloadUrl,
    hasFailed,
    state,
    progress,
    progressInPercentage,
    uploadFile,
  };
};
