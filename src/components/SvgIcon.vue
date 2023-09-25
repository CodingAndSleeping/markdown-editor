<template>
  <svg aria-hidden="true" class="svg-icon" :style="{
    height:svgSize,
    width:svgSize
  }">
    <use :href="`#icon-${name}`" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    name: string;
    color?: string;
    size?: number | string;
  }>(),
  {
    color: "#333",
    size: 1,
  }
);

const svgSize = computed(() => props.size + 'em') 
</script>
<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
}
</style>
