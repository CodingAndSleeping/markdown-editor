<template>
  <div class="main" >
    <a-tabs v-model:active-key="activeTab" :justify="true">
      <a-tab-pane key="1" title="文件">
        <a-tree
          ref="treeRef"
          :field-names="{
            title: 'name',
          }"
          action-on-node-click="expand"
          :data="treeData"
          :selectable="selectFn"
        >
          <template #icon="{ node }">
            <svg-icon name="file" v-if="node.type === 'file'"></svg-icon>
            <svg-icon name="folder" v-if="node.type === 'dir'"></svg-icon>
          </template>

          <template #title="node">
            <div
              v-if="!node.edit"
              @contextmenu.prevent="handleContextMenu($event, node)"
              @click="handleSelect(node)"
            >
              {{ node.name }}
            </div>

            <a-input
              type="text"
              v-if="node.edit"
              :ref="(el:HTMLInputElement) => getInputRef(el as HTMLInputElement, node)"
              v-model="node.name"
              @focus="handleFocus"
              @blur="handleBlur(node)"
            />
          </template>
        </a-tree>
        <div class="footer" v-if="treeData.length !== 0">
          <svg-icon
            class="add-icon"
            name="add"
            :size="1.5"
            @click="createFile(treeData[0])"
          ></svg-icon>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" title="大纲">
        <md-catalog class="catalog" :editor-id="textObj.id"></md-catalog>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { IMdText } from "@/types/text";
import { ref, nextTick } from "vue";
import IDirTree from "@/types/DirTree";
import { IpcRendererEvent } from "electron";
import SvgIcon from "@/components/SvgIcon.vue";
const { fileApi } = window;
const props = defineProps<{
  textObj: IMdText;
}>();
const activeTab = ref<string>('2')
const treeRef = ref<any | null>(null);
const treeData = ref<IDirTree[]>([]);
// 打开文件执行的回调函数
fileApi.openDir((e: IpcRendererEvent, tree: IDirTree[]) => {
  activeTab.value = '1'
  props.textObj.text = ''
  treeData.value = tree;
});

function selectFn(node: any) {
  // 只有文件才能被选择
  return node.type === "file" ? true : false;
}

// 选择文件
async function handleSelect(node: any) {
  if (node.type === "file") {
    treeRef.value.selectNode(node.key, true);
    const res = await fileApi.selectFile(node.path + "/" + node.name);
    props.textObj.text = res;
  }
}

// 右键菜单
function handleContextMenu(e: MouseEvent, node: any) {
  console.log(e, node);
}

function handleFocus(e: any) {
  e.currentTarget!.select();
}
function handleBlur(node: any) {
  node.edit = false;
  // 主进程创建文件
  fileApi.createFile(node.path + "/" + node.name);
}

// 收集输入框元素
const inputRefDict = ref<Record<string, any>>({});
function getInputRef(el: HTMLInputElement, node: any) {
  if (el) {
    inputRefDict.value[node.name] = {
      el,
      node,
    };
  }
}

// 创建文件
async function createFile(node: IDirTree) {
  const arr = node
    .children!.filter((item) => {
      const res = item.name.split(".")[0].split(" ");
      return (
        res[0] === "Untitled" && (res[1] === undefined || /^\d+$/.test(res[1]))
      );
    })
    .map((item) => {
      const res = item.name.split(".")[0].split(" ")[1];
      return res === undefined ? 0 : Number(res);
    });

  const max = arr.length === 0 ? "" : " " + (Math.max(...arr) + 1);
  const newFIle: IDirTree = {
    name: "Untitled" + max + ".md",
    type: "file",
    deep: node.deep + 1,
    edit: true,
    key: node.path + "/" + node.name + "/" + "Untitled" + max + ".md",
    path: node.path + "/" + node.name,
  };

  node.children!.push(newFIle);
  nextTick(() => {
    // inputRefDict.value[newFIle.name].node.edit = true;
    inputRefDict.value[newFIle.name].el.focus();
  });
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  .footer {
    display: flex;
    align-items: center;
    height: 30px;
    width: 100%;
    padding: 1px 3px;
    border: 1px solid #e8e8e8;
    background-color: #fff;
    bottom: 0;
    left: 1;
    position: sticky;
    .add-icon {
      height: 30px;
      width: 30px;
    }
    .add-icon:hover {
      cursor: pointer;
      background-color: #eeeeee;
    }
  }
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
:deep(.arco-tree) {
  overflow: auto;
  height: 100%;
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
:deep(.arco-tabs-pane) {
  overflow: hidden;
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

:deep(.arco-tabs-content) {
  overflow: auto;
  padding-top: 10px;
}
:deep(.arco-tabs-content-item) {
  overflow: auto;
}
</style>
