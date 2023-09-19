<template>
  <md-editor v-if="type === 'edit'" v-model="text"></md-editor>
  <md-preview v-if="type === 'preview'" v-model="text"></md-preview>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { IpcRendererEvent } from "electron";

const text = ref<string>("# aaa");
const type = ref<"edit" | "preview">("edit");
window.electron.readFile((event: IpcRendererEvent, value: string) => {
  type.value = "preview";
  text.value = value;
});
</script>

<style scoped lang="scss"></style>
