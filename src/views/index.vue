<template>
  <div class="main">
    <a-split
      :style="{
        height: '100%',
        width: '100%',
        minWidth: '500px',
      }"
      v-model:size="size"
      min="180px"
      max="300px"
    >
      <template #first>
        <SideBar :textObj="textObj" ></SideBar>
      </template>
      <template #second>
        <Editor :textObj="textObj" v-if="type === 'edit'"></Editor>
        <Preview :textObj="textObj" v-if="type === 'preview'"></Preview>
      </template>
    </a-split>
  </div>
</template>

<script setup lang="ts">
import SideBar from "../components/SideBar.vue";
import Editor from "../components/Editor.vue";
import Preview from "../components/Preview.vue";
import {ItextObj} from '../types/text';
import { ref } from "vue";
import { IpcRendererEvent } from "electron";
const textObj = ref<ItextObj>({
  id: "editor1",
  text: "# aaa",
});
const type = ref<"edit" | "preview">("edit");
window.electronAPI.openFile((event: IpcRendererEvent, value: string) => {
  type.value = "edit";
  textObj.value.text = value;
});
window.electronAPI.openSaveDialog(async (event: IpcRendererEvent) => {
  // 把文本传给主进程
  window.electronAPI.saveFile(textObj.value.text);
});

const size = ref<number>(0.2);
</script>

<style scoped lang="scss">
.main {
  height: 100%;
  width: 100%;
  display: flex;
}
</style>
