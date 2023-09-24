<template>
  <div class="main">
    <a-tabs default-active-key="2">
      <a-tab-pane key="1" title="文件"> Content of Tab Panel 1 </a-tab-pane>
      <a-tab-pane key="2" title="大纲">
        <md-catalog class="catalog" :editor-id="textObj.id"></md-catalog>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ItextObj } from "../types/text";
const props = defineProps<{
  textObj: ItextObj;
}>();
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
}
:deep(.md-editor-catalog-link) {
  padding: 6px 30px;
  display: flex;
}
// 修改md-catalog的默认样式
:deep(.md-editor-catalog-active) {
  span {
    color: #000;
    font-size: large;
    font-weight: bolder;
  }
}

:deep(.md-editor-catalog-link):hover {
  span {
    color: #000;
  }
  background-color: rgb(208, 213, 218);
}

// 修改arco-tabs 的默认样式
:deep(.arco-tabs) {
  width: 100%;
}
:deep(.arco-tabs-nav-tab) {
  width: 100%;
}
:deep(.arco-tabs-nav-tab-list) {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
</style>
