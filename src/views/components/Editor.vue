<template>
  <div class="main">
    <md-editor class="editor" :editor-id="store.id || 'editor'" v-model="store.text">
    </md-editor>
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

<style lang="scss">
.main {
  height: 100%;
  .editor {
    height: 100%;
  }
}
</style>
