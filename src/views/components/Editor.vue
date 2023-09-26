<template>
  <div class="main">
    <md-editor class="editor" :editor-id="textObj.id" v-model="textObj.text">
    </md-editor>
  </div>
</template>

<script setup lang="ts">
import { IMdText } from "@/types/text";
const props = defineProps<{
  textObj: IMdText;
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
