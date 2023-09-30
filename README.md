# Vue 3 + TypeScript + Vite

```js
<template>
  <a-tree
    :data="treeData"
    :field-names="{
      title: 'name',
      key: 'path',
    }"
    :only-check-leaf="true"
    action-on-node-click="expand"
    :selectable="selectFn"
    @select="handleSelect"
  >
    <template #icon="{ node }">
      <icon-drive-file v-if="node.type === 'file'" />
      <icon-folder v-if="node.type === 'dir'" />
    </template>
    <template #title="node">
      <div v-if="!node.edit"  @contextmenu.prevent="handleContextMenu($event, node)">
        {{ node.name }}
      </div>

      <a-input
        type="text"
        v-if="node.edit"
        :ref="(el) => getInputRef(el as HTMLInputElement, node)"
        v-model="node.name"
        @focus="handleFocus"
        @blur="handleBlur(node)"
      />
    </template>
  </a-tree>

  <button @click="createFile">创建文件</button>
  <Menu></Menu>
</template>
<script setup lang="ts">
import { ref, nextTick } from "vue";
import { IconFolder, IconDriveFile } from "@arco-design/web-vue/es/icon";
import Menu from './components/Menu.vue'
interface ItreeData {
  name: string;
  type: "file" | "dir";
  path: string;
  edit: boolean;
  deep: number;
  children?: ItreeData[];
}
const treeData = ref<ItreeData[]>([]);

treeData.value = [
  {
    path: "F:/js_test",
    name: "js_test",
    type: "dir",
    deep: 0,
    edit: false,
    children: [
      {
        path: "F:\\js_test\\.vscode",
        name: ".vscode",
        type: "dir",
        deep: 1,
        edit: false,
        children: [],
      },
      {
        path: "F:\\js_test\\out.md",
        name: "out.md",
        type: "file",
        deep: 1,
        edit: false,
      },
      {
        path: "F:\\js_test\\test",
        name: "test",
        type: "dir",
        deep: 1,
        edit: false,
        children: [
          {
            path: "F:\\js_test\\test\\a.txt",
            name: "a.txt",
            type: "file",
            deep: 2,
            edit: false,
          },
        ],
      },
      {
        path: "F:\\js_test\\test.md",
        name: "test.md",
        type: "file",
        deep: 1,
        edit: false,
      },
    ],
  },
];

function selectFn(node: any) {
  return node.type === "file" ? true : false;
}
function handleSelect(keys: (string | number)[], data: any) {
  const { node } = data;
  if (node.type === "file") {
    console.log(node.path);
  }
}

function handleContextMenu(e: MouseEvent, node: any) {
  // e.preventDefault()
  console.log(e, node)
}

function handleFocus(e: any) {
  e.currentTarget!.select();
}
function handleBlur(node: any) {
  node.edit = false;

  // 主进程创建文件
}
const inputRefList = ref<Record<string, HTMLInputElement>>({});
function getInputRef(el: HTMLInputElement, node: any) {
  if (el) {
    inputRefList.value[node.name] = el;
  }
}

const newFileNum = ref<number>(0);
function createFile() {
  const newFIle: ItreeData = {
    name: "Untitled" + (newFileNum.value ? " " + newFileNum.value : "") + ".md",
    type: "file",
    path:
      treeData.value[0].path +
      "/" +
      "Untitled" +
      (newFileNum.value ? " " + newFileNum.value : "") +
      ".md",
    edit: true,
    deep: 1,
  };
  treeData.value[0].children!.push(newFIle);
  nextTick(() => {
    inputRefList.value[newFIle.name].focus();
  });
  newFileNum.value++;
}
</script>

<style scoped lang="scss">
:deep(.arco-tree-node-selected) {
  span {
    color: #000;
    font-weight: bolder;
  }
}

:deep(.arco-tree-node-title):hover {
  color: #000;
  background-color: #f2f3f5;
}

:deep(.arco-tree-node-disabled-selectable) {
  span {
    color: #000;
    cursor: pointer;
  }
  span:hover {
    color: #000;
    background-color: #f2f3f5;
  }
}
</style>
```