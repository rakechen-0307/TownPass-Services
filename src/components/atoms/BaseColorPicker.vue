<template>
  <div class="color-swatch">
    <div
      v-for="(color, index) in colors"
      :key="index"
      :style="{
        backgroundColor: color,
        border: selectedColor === color ? '3px solid black' : '1px solid #ccc'
      }"
      class="color-box"
      @click="selectColor(color)"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, emit } from 'vue';

export default defineComponent({
  name: 'ColorSwatch',
  emits: ['colorSelected'],
  setup(_, { emit }) {
    const colors = [
      '#fcc02e', '#f67c01', '#d81b43', '#8e24aa', '#2eb6c7', '#05a045',
      '#fed835', '#fb8c00', '#eb1d4e', '#9c28b1', '#71c5d5', '#4cb050',
      '#ffeb3c', '#ffa727', '#eb4165', '#aa47bc', '#93d4df', '#83c683',
      '#fff176', '#ffb74e', '#f1627e', '#b968c7', '#b4e2ea', '#a5d6a7',
      '#fff59c', '#ffcc80', '#fb879e', '#cf93d9', '#dbf1f5', '#c8e6ca',
    ];

    const selectedColor = ref<string | null>(null);

    const selectColor = (color: string) => {
      selectedColor.value = color;
      emit('colorSelected', color); // Emit the selected color to the parent
    };

    return {
      colors,
      selectedColor,
      selectColor
    };
  }
});
</script>

<style scoped>
.color-swatch {
  display: grid;
  grid-template-columns: repeat(6, 50px);
  grid-template-rows: repeat(5, 30px);
  gap: 5px;
}

.color-box {
  width: 50px;
  height: 30px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
