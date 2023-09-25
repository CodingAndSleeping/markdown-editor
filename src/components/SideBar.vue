<template>
  <div class="main">
    <a-tabs default-active-key="2">
      <a-tab-pane key="1" title="文件">
        <a-tree
          :field-names="{
            title: 'name',
          }"
          action-on-node-click="expand"
          :data="treeData"
          :selectable="selectFn"
          @select="handleSelect"
        >
          <template #icon="{ node }">
            <svg-icon name="file" v-if="node.type === 'file'"></svg-icon>
            <svg-icon name="folder" v-if="node.type === 'dir'"></svg-icon>
          </template>
        </a-tree>
      </a-tab-pane>
      <a-tab-pane key="2" title="大纲">
        <md-catalog class="catalog" :editor-id="textObj.id"></md-catalog>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ItextObj } from "../types/text";
import { ref } from "vue";
import IDirTree from "../types/DirTree";
import { IpcRendererEvent } from "electron";
import SvgIcon from "../components/SvgIcon.vue";
const { fileApi } = window;
const props = defineProps<{
  textObj: ItextObj;
}>();

function selectFn(node: any) {
  return node.type === "file" ? true : false;
}

async function handleSelect(keys: (string | number)[], data: any) {
  // console.log(data.node.path);
  const res = await fileApi.selectFile(data.node.path);
  props.textObj.text = res;
}

const treeData = ref<IDirTree[]>([]);
fileApi.openDir((e: IpcRendererEvent, tree: IDirTree[]) => {
  treeData.value = tree;
});
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
}
// 修改md-catalog的默认样式
:deep(.md-editor-catalog-active) {
  span {
    color: #000;
    font-weight: bolder;
  }
}

:deep(.md-editor-catalog-link) {
  span:hover {
    color: rgb(22, 93, 255);
  }
}

// 修改arco-tree的默认样式
:deep(.arco-tree-node) {
  .arco-tree-node-title {
    cursor: pointer;
  }
}
:deep(.arco-tree-node) {
  .arco-tree-node-title:hover {
    color: #000;
    background-color: #f2f3f5;
  }
}
:deep(.arco-tree-node-selected) {
  .arco-tree-node-title {
    color: #000;
    font-weight: bold;
  }
}
:deep(.arco-tree-node-disabled-selectable) {
  .arco-tree-node-title {
    color: #000;
    cursor: pointer;
  }
}

// 修改arco-tabs 的默认样式
:deep(.arco-tabs) {
  width: 100%;
  height: 100%;
}
:deep(.arco-tabs-nav-tab) {
  height: 100%;
  width: 100%;
}
:deep(.arco-tabs-nav-tab-list) {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
</style>
