<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, defineProps } from 'vue';
import p5 from 'p5';

import ServiceTabsView from '@/components/organisms/ServiceTabsView.vue';
import { main } from '@popperjs/core';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import BaseColorPicker from '@/components/atoms/BaseColorPicker.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import DraftDialog2 from './DraftDialog2.vue';
// import { useMeta } from 'vue-meta';

document.addEventListener('gesturestart', function (e) {
  e.preventDefault();
});

// export interface CanvasImage {
//   link: string;
//   width: number;
//   height: number;
// }

interface CanvasImage {
  link?: string;
  width?: number;
  height?: number;
}

// const props = withDefaults(defineProps<CanvasImage>(), {
//   link: 'https://firebasestorage.googleapis.com/v0/b/codefest-test-0825.appspot.com/o/blue.jpg?alt=media&token=2d7c5ddd-6f26-42f6-b3ef-daf139033a91',
//   width: 2942,
//   height: 1961
// })

const props0 = defineProps<{
  link?: string,
  width?: number,
  height?: number,
  pid?: string
}>()

const props = {
  link: props0.link || 'https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  width: props0.width || 2942,
  height: props0.height || 1961,
  pid: props0.pid || ''
}

const canvasRef = ref<HTMLDivElement | null>(null);
let myP5: p5 | null = null;

const img = ref<p5.image | null>(null);
// const imgX = ref(1970);
// const imgY = ref(1484);

const imgOffX = ref(0.0);
const imgOffY = ref(0.0);
const imgZoom = ref(1.0);

const screenX = ref(1.0);
const screenY = ref(1.0);

const imgRatio = computed(() => (img.value ? (img.value.height * 1.0) / img.value.width : 1.0));

const zooming = ref(false);
const zoomX0 = ref(0.0);
const zoomY0 = ref(0.0);
const zoomX1 = ref(0.0);
const zoomY1 = ref(0.0);

const drawing = ref(false);
// const slider = ref<p5.slider | null>(null);

enum BrushType {
  Cover,
  Blend,
  Erase
}

const maskImg = ref<p5.graphics | null>(null);
const tmpImg = ref<p5.graphics | null>(null);
const mainImg = ref<p5.graphics | null>(null);

const stroke: [number, number][] = [];

const screenToImg = (x: number, y: number): [number, number] => {
  const imgx = ((x - imgOffX.value) / (screenX.value * imgZoom.value)) * img.value.width;
  const imgy =
    ((y - imgOffY.value) / (screenX.value * imgRatio.value * imgZoom.value)) * img.value.height;

  return [(imgx - 0.5 * img.value.width) * 0.5, (imgy - 0.5 * img.value.height) * 0.5];
};

const dist = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

const calculateZoom = (
  ori_x1: number,
  ori_y1: number,
  ori_x2: number,
  ori_y2: number,
  new_x1: number,
  new_y1: number,
  new_x2: number,
  new_y2: number
): [number, number, number] => {
  const ori_mid = [(ori_x1 + ori_x2) / 2, (ori_y1 + ori_y2) / 2];
  const new_mid = [(new_x1 + new_x2) / 2, (new_y1 + new_y2) / 2];
  const diff = [new_mid[0] - ori_mid[0], new_mid[1] - ori_mid[1]];

  let tmpx = imgOffX.value + diff[0];
  let tmpy = imgOffY.value + diff[1];
  const scale = dist(new_x1, new_y1, new_x2, new_y2) / dist(ori_x1, ori_y1, ori_x2, ori_y2);
  const vec = [(tmpx - new_mid[0]) * scale, (tmpy - new_mid[1]) * scale];

  return [new_mid[0] + vec[0], new_mid[1] + vec[1], imgZoom.value * scale];
};

const sliderVal1 = ref(50.0);
const sliderVal2 = ref(50.0);
const activeTab = ref(0);
const activeBrush = ref(BrushType.Cover);

const sliderValH = ref(187.0);
const sliderValS = ref(77.0);
const sliderValB = ref(78.0);

const setBrush = (type: BrushType) => {
  activeBrush.value = type;
};

const tabList = [
  { id: 1, title: '筆刷' },
  { id: 2, title: '顏料' },
  { id: 3, title: '調色盤' }
];

const map = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

const drawOnCanvas = (
  canvas: p5.graphics,
  stroke2: [number, number][],
  color: { r: number, g: number, b:number },
  opacity: number,
) => {
  canvas.value.noFill();
  // const rgb = hsbToRgb(sliderValH.value, sliderValS.value, sliderValB.value);
  canvas.value.stroke(color.r, color.g, color.b, opacity);

  const b = map(sliderVal1.value, 0, 100, 2, 40);
  const a = (b - map(sliderVal2.value, 0, 100, b, 0)) / ((stroke2.length - 1) / 2) ** 2;

  stroke2.forEach((point, ind) => {
    if (ind !== 0) {
      canvas.value.strokeWeight(b - a * (ind - (stroke2.length - 1) / 2) ** 2);
      canvas.value.line(stroke2[ind - 1][0], stroke2[ind - 1][1], stroke2[ind][0], stroke2[ind][1]);
    }
  });
};

const shaderProgram = ref<p5.shader | null>(null);

const sketch = (p: p5) => {
  p.preload = () => {
    img.value = p.loadImage(props.link);
    shaderProgram.value = p.loadShader('/shaders/shader.vert', '/shaders/shader.frag');
  };

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight * 0.6);
    screenX.value = p.windowWidth;
    screenY.value = p.windowHeight;

    mainImg.value = p.createGraphics(props.width / 2, props.height / 2, p.WEBGL);
    maskImg.value = p.createGraphics(props.width / 2, props.height / 2, p.WEBGL);
    tmpImg.value = p.createGraphics(props.width / 2, props.height / 2, p.WEBGL);

    mainImg.value.shader(shaderProgram.value);
    maskImg.value.clear();
  };

  p.draw = () => {
    p.background(220);

    // console.log(p.frameCount);
    // maskImg.value.translate(100, 100);

    // console.log(maskImg)
    shaderProgram.value.setUniform('tex0', img.value);
    shaderProgram.value.setUniform('mask', maskImg.value);

    // mainImg.value.shader(shaderProgram.value);
    mainImg.value.rect(0, 0, mainImg.value.width, mainImg.value.height);

    p.image(
      mainImg.value,
      imgOffX.value,
      imgOffY.value,
      screenX.value * imgZoom.value,
      screenX.value * imgZoom.value * (img.value.height / img.value.width)
    );

    p.image(
      tmpImg.value,
      imgOffX.value,
      imgOffY.value,
      screenX.value * imgZoom.value,
      screenX.value * imgZoom.value * (img.value.height / img.value.width)
    );

    tmpImg.value.clear();
    const rgb = hsbToRgb(sliderValH.value, sliderValS.value, sliderValB.value);
    drawOnCanvas(
      tmpImg,
      stroke,
      activeBrush.value === BrushType.Erase ? {r: 255, g: 255, b: 255} : rgb,
      255
    );

    if (p.touches.length !== 2) zooming.value = false;

    if (p.touches.length !== 1 && drawing.value) {
      drawing.value = false;

      if (activeBrush.value === BrushType.Cover) {
        drawOnCanvas(maskImg, stroke, rgb, 255);
        stroke.length = 0;
      } else if (activeBrush.value === BrushType.Blend) {
        console.log("blend");
        drawOnCanvas(maskImg, stroke, rgb, 50);
        stroke.length = 0;
      } else {
        maskImg.value.erase();
        drawOnCanvas(maskImg, stroke, rgb, 255);
        maskImg.value.noErase();
        stroke.length = 0;
      }
    }

    if (p.touches.length === 1) {
      p.ellipse(p.mouseX, p.mouseY, 40, 40);
      const tmp = screenToImg(p.mouseX, p.mouseY);
      if (!drawing.value) {
        drawing.value = true;
        stroke.push([tmp[0], tmp[1]]);
      } else {
        if (
          stroke.length > 0 &&
          dist(tmp[0], tmp[1], stroke[stroke.length - 1][0], stroke[stroke.length - 1][1]) > 5
        ) {
          stroke.push([tmp[0], tmp[1]]);
        }
      }
    } else if (p.touches.length === 2) {
      if (!zooming.value) {
        zooming.value = true;
        // Load initial values
        zoomX0.value = p.touches[0].x;
        zoomY0.value = p.touches[0].y;
        zoomX1.value = p.touches[1].x;
        zoomY1.value = p.touches[1].y;
      } else {
        // load new values
        const newZoomX0 = p.touches[0].x;
        const newZoomY0 = p.touches[0].y;
        const newZoomX1 = p.touches[1].x;
        const newZoomY1 = p.touches[1].y;

        // calculate zoom change
        if (
          p.dist(zoomX0.value, zoomY0.value, newZoomX0, newZoomY0) <=
          p.dist(zoomX0.value, zoomY0.value, newZoomX1, newZoomY1)
        ) {
          const [newOffX, newOffY, newZoom] = calculateZoom(
            zoomX0.value,
            zoomY0.value,
            zoomX1.value,
            zoomY1.value,
            newZoomX0,
            newZoomY0,
            newZoomX1,
            newZoomY1
          );
          imgOffX.value = newOffX;
          imgOffY.value = newOffY;
          imgZoom.value = newZoom;
        } else {
          const [newOffX, newOffY, newZoom] = calculateZoom(
            zoomX0.value,
            zoomY0.value,
            zoomX1.value,
            zoomY1.value,
            newZoomX1,
            newZoomY1,
            newZoomX0,
            newZoomY0
          );
          imgOffX.value = newOffX;
          imgOffY.value = newOffY;
          imgZoom.value = newZoom;
        }

        // replace saved values
        zoomX0.value = newZoomX0;
        zoomY0.value = newZoomY0;
        zoomX1.value = newZoomX1;
        zoomY1.value = newZoomY1;
      }
    }
    p.colorMode(p.HSB);
    p.fill(sliderValH.value, sliderValS.value, sliderValB.value);
    p.ellipse(40, 40, 60, 60);
    p.colorMode(p.RGB);

    if (tmpBool.value) {
      // p.saveCanvas('tmp/tmp.png');
      mainImg.value.save();
      tmpBool.value = false;
    }
  };
};

const rgbToHsb = (r: number, g: number, b: number) => {
  // Convert RGB values from the range [0, 255] to [0, 1]
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  // Calculate Hue
  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  // Calculate Saturation
  const s = max === 0 ? 0 : delta / max;

  // Calculate Brightness
  const v = max;

  // Return HSB values: Hue [0, 360], Saturation and Brightness [0, 100]
  return {
    h: h,
    s: s * 100,
    b: v * 100
  };
};

const hsbToRgb = (h: number, s: number, b: number) => {
  // Normalize S and B from percentages [0, 100] to [0, 1]
  s /= 100;
  b /= 100;

  const c = b * s; // Chroma
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = b - c;

  let r = 0, g = 0, bl = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    bl = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    bl = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    bl = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    bl = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    bl = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    bl = x;
  }

  // Convert RGB from [0, 1] to [0, 255] and add m for brightness
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  bl = Math.round((bl + m) * 255);

  return { r, g, b: bl };
};

const hexToRgb = (hex: string): number[] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ] : [0, 0, 0];
};

// const selectedColor = ref([255, 255, 255]);

const onColorSelected = (color: string) => {
  // selectedColor.value = color;
  const rgb = hexToRgb(color);
  const hsb = rgbToHsb(rgb[0], rgb[1], rgb[2]);

  sliderValH.value = hsb.h;
  sliderValS.value = hsb.s;
  sliderValB.value = hsb.b;
};

const tmpBool = ref(false);
const completeEdit = () => {
  tmpBool.value = true;
  isDraftDialogOpen.value = true
  // resultUrl.value = mainImg.value.elt.toDataURL();
}

const onDraftSubmission = () => {
    
};

const isDraftDialogOpen = ref(false);
const resultUrl = ref('');

onMounted(() => {
  if (canvasRef.value) {
    myP5 = new p5(sketch, canvasRef.value);
  }
});

onUnmounted(() => {
  if (myP5) {
    myP5.remove();
  }
});
</script>

<template>
  <div class="flex justify-between items-center p-2">
    <RouterLink :to="`/city-canvas/proposal/${pid}`">
      <img src="@/assets/images/down-icon.svg" class="rotate-90" />
    </RouterLink>
    <BaseButton @click="completeEdit"><div class="px-1">完成</div></BaseButton>
  </div>

  <div ref="canvasRef"></div>

  <ServiceTabsView v-model="activeTab" :tab-list="tabList">
    <template #tab0>
      <div class="grid grid-cols-7 gap-4 items-center mx-5 mt-5">
        <div class="col-span-1">
          <img src="@/assets/images/brush_thin.svg" />
        </div>
        <div class="col-span-5">
          <input v-model="sliderVal1" type="range" value="50" class="w-full h-6 bg-gray-200 rounded-lg appearance-none my-3">
        </div>
        <div class="col-span-1">
          <img src="@/assets/images/brush_thick.svg" />
        </div>
      </div>

      <div class="grid grid-cols-7 gap-4 items-center mx-5">
        <div class="col-span-1">
          <img src="@/assets/images/brush_fixed.svg" />
        </div>
        <div class="col-span-5">
          <input v-model="sliderVal2" type="range" value="50" class="w-full h-6 bg-gray-200 rounded-lg appearance-none my-3">
        </div>
        <div class="col-span-1">
          <img src="@/assets/images/brush_var.svg" />
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4 items-center mx-5 my-5">
        <div
          class="col-span-1 rounded-2xl"
          :class="activeBrush === BrushType.Cover ? 'bg-primary-100 border-solid border-2 border-primary-500' : 'bg-gray-100'"
          @click="setBrush(BrushType.Cover)"
        >
          <div class="grid grid-cols-3 gap-2 items-center mx-3 my-5">
            <img src="@/assets/images/mode_cover.svg" class="col-span-1" />
            <p class="col-span-2">覆蓋</p>
          </div>
        </div>
        <div
          class="col-span-1 rounded-2xl"
          :class="activeBrush === BrushType.Blend ? 'bg-primary-100 border-solid border-2 border-primary-500' : 'bg-gray-100'"
          @click="setBrush(BrushType.Blend)"
        >
          <div class="grid grid-cols-3 gap-2 items-center mx-3 my-5">
            <img src="@/assets/images/mode_blend.svg" class="col-span-1" />
            <p class="col-span-2">混合</p>
          </div>
        </div>
        <div
          class="col-span-1 rounded-2xl"
          :class="activeBrush === BrushType.Erase ? 'bg-primary-100 border-solid border-2 border-primary-500' : 'bg-gray-100'"
          @click="setBrush(BrushType.Erase)"
        >
          <div class="grid grid-cols-3 gap-2 items-center mx-3 my-5">
            <img src="@/assets/images/mode_erase.svg" class="col-span-1" />
            <p class="col-span-2">擦除</p>
          </div>
        </div>
      </div>
    </template>

    <template #tab1>
      <div class="w-full py-4 flex justify-center">
        <BaseColorPicker @colorSelected="onColorSelected" />
      </div>
    </template>

    <template #tab2>
      <div class="grid grid-cols-7 gap-4 items-center mx-5 mt-5">
        <div class="col-span-1">色相</div>
        <div class="col-span-6">
          <input v-model="sliderValH" type="range" value="50" max="360" class="w-full h-6 bg-gray-200 rounded-lg appearance-none my-3">
        </div>
      </div>

      <div class="grid grid-cols-7 gap-4 items-center mx-5">
        <div class="col-span-1">彩度</div>
        <div class="col-span-6">
          <input v-model="sliderValS" type="range" value="50" class="w-full h-6 bg-gray-200 rounded-lg appearance-none my-3">
        </div>
      </div>

      <div class="grid grid-cols-7 gap-4 items-center mx-5">
        <div class="col-span-1">亮度</div>
        <div class="col-span-6">
          <input v-model="sliderValB" type="range" value="50" class="w-full h-6 bg-gray-200 rounded-lg appearance-none my-3">
        </div>
      </div>

      <!-- <div class="h-6 mx-5 mt-3 bg-red-300 rounded-lg"></div> -->
    </template>
  </ServiceTabsView>

  <DraftDialog2
    v-model="isDraftDialogOpen"
    title="上傳新稿件"
    content=""
    :isAlert="false"
    positiveText="提交"
    negativeText="取消"
    @onPositiveClick="onDraftSubmission"
    :pid="pid"
  />
  
  <!-- <iframe src="/" width="100%" height="100%"></iframe> -->
</template>

<!-- <style>
.mySliders {
  height: 20px;
  color: red;
  /* background-color: transparent; */
  /* Removes some defaults */
  /* -webkit-appearance: none; */
}
</style> -->
