<template>
  <div class="preview">
    <md-preview :editor-id="mdText.id" v-model="mdText.text"> </md-preview>
  </div>
</template>

<script setup lang="ts">
import { IMdText } from "@/types/MdText";
const props = defineProps<{
  mdText: IMdText;
}>();
</script>

<style lang="scss"></style>
