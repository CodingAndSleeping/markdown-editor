<template>
  <div class="main">
    <a-split
      :style="{
        height: '100%',
        width: '100%',
        '--resizeTrrigerWidth': resizeTrrigerWidth,
      }"
      v-model:size="size"
      :min="minSize"
      :max="maxSize"
      @move-end="handleMoveEnd"
    >
      <template #first>
        <SideBar :mdText="mdText"></SideBar>
      </template>

      <template #resize-trigger>
        <div class="resize-triger"></div>
      </template>
      <template #second>
        <Editor :mdText="mdText" v-if="mdText.mode === 'edit'"></Editor>
        <Preview :mdText="mdText" v-if="mdText.mode === 'preview'"></Preview>
      </template>
    </a-split>
  </div>
</template>

<script setup lang="ts">
import SideBar from "@/views/components/SideBar.vue";
import Editor from "@/views/components/Editor.vue";
import Preview from "@/views/components/Preview.vue";
import { IMdText } from "@/types/MdText";
import { ref } from "vue";
const { viewApi } = window;
const mdText = ref<IMdText>({
  id: "",
  text: "",
  name: "",
  baseDir: "",
  mode: "edit",
  isChanged: false,
});

// 是否显示侧边栏
const showSideBar = ref<boolean>(true);
// 侧边栏尺寸
const size = ref<number>(0.2);
const minSize = ref<number>(0.1);
const maxSize = ref<number>(0.4);
// 拖动器宽度
const resizeTrrigerWidth = ref<string>("5px");
// 侧边栏当前尺寸
const curSize = ref<number>(0.2);
function handleMoveEnd() {
  curSize.value = size.value;
}
viewApi.isShowSidebar(() => {
  showSideBar.value = !showSideBar.value;
  if (showSideBar.value) {
    size.value = curSize.value;
    minSize.value = 0.1;
    resizeTrrigerWidth.value = "5px";
  } else {
    size.value = 0;
    minSize.value = 0;
    resizeTrrigerWidth.value = "0";
  }
});
</script>

<style scoped lang="scss">
.main {
  height: 100%;
  width: 100%;
  display: flex;
  .resize-triger {
    height: 100%;
    width: var(--resizeTrrigerWidth);
    background-color: #e6e6e6;
  }
}
</style>
