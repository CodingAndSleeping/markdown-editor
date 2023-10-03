<template>
  <div class="preview">
    <md-preview :editor-id="store.id || 'editor'" v-model="store.text"> </md-preview>
  </div>
</template>

<script setup lang="ts">
import { IMdText } from "@/types/MdText";
// const props = defineProps<{
//   mdText: IMdText;
// }>();
import { useMdTextStore } from "@/store/mdText";
const store = useMdTextStore();
</script>

<style lang="scss"></style>
