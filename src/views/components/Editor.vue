<template>
  <div class="main">
    <md-editor class="editor" :editor-id="mdText.id" v-model="mdText.text">
    </md-editor>
  </div>
</template>

<script setup lang="ts">
import { IMdText } from "@/types/MdText";
const props = defineProps<{
  mdText: IMdText;
}>();
</script>

<style lang="scss">
.main {
  height: 100%;
  .editor {
    height: 100%;
  }
}
</style>
