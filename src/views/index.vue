<template>
  <md-editor v-if="type === 'edit'" v-model="text"  @onUploadImg="onUploadImg"></md-editor>
  <md-preview v-if="type === 'preview'" v-model="text"></md-preview>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { IpcRendererEvent } from "electron";

const text = ref<string>("# aaa");
const type = ref<"edit" | "preview">("edit");
window.electron.openFile((event: IpcRendererEvent, value: string) => {
  type.value = "edit";
  text.value = value;
  console.log(value)
});

window.electron.openSaveDialog(async (event: IpcRendererEvent)=>{
  
  // 把文本传给主进程
  window.electron.saveFile(text.value)

})

async function onUploadImg(files, cb){
  console.log(files)

  cb(files.map(file=>{
     return 'src/assets/a.png'
  }))
}
</script>

<style scoped lang="scss"></style>
