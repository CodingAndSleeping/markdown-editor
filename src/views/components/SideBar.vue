<template>
  <div class="main">
    <a-tabs v-model:active-key="activeTab" :justify="true">
      <a-tab-pane key="1" title="文件">
        <a-tree
          ref="treeRef"
          :field-names="{
            title: 'name',
            key: 'path',
          }"
          action-on-node-click="expand"
          :data="treeData"
          :selectable="selectFn"
        >
          <template #icon="{ node }">
            <svg-icon name="file" v-if="node.type === 'file'"></svg-icon>
            <svg-icon name="folder" v-if="node.type === 'dir'"></svg-icon>
          </template>

          <template #title="node: IDirTree">
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
              :ref="(el) => getInputRef(el as InputInstance, node)"
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
        <md-catalog
          class="catalog"
          :editor-id="store.id || 'editor1'"
        ></md-catalog>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { IMdText } from "@/types/MdText";
import { ref, nextTick, watchEffect, watch, toRaw, WatchStopHandle, toRef } from "vue";
import IDirTree from "@/types/DirTree";
import { IpcRendererEvent } from "electron";
import SvgIcon from "@/components/SvgIcon.vue";
import { InputInstance, TreeInstance } from "@arco-design/web-vue";
import { useMdTextStore } from "@/store/mdText";
// import saveFileTip from "@/utils/saveFileTip";

const { fileApi, windowApi } = window;
// const props = defineProps<{
//   mdText: IMdText;
// }>();
const store = useMdTextStore();

const activeTab = ref<string>("2");
const treeRef = ref<TreeInstance | null>(null);
const treeData = ref<IDirTree[]>([]);

// 打开文件回调函数
fileApi.openFile(
  (event: IpcRendererEvent, mdText: IMdText, tree: IDirTree[]) => {
    store.$patch(mdText);
    activeTab.value = "1";
    treeData.value = tree;
    nextTick(() => {
      treeRef.value!.expandNode(store.baseDir, true);
      treeRef.value!.selectNode(store.id, true);
    });
  }
);

fileApi.isHasPath(async (event: IpcRendererEvent) => {
  // 保存
  const newMdText = await event.sender.invoke("save-file", toRaw(store.$state));
  windowApi.setTitle(newMdText.name || "new file");
  store.$patch(newMdText);
});

// 打开文件夹执行的回调函数
fileApi.openDir((e: IpcRendererEvent, tree: IDirTree[]) => {
  activeTab.value = "1";
  treeData.value = tree;

  store.$patch({
    id: "",
    name: "",
    mode: "edit",
    text: "",
    isChanged: false,
  });

  nextTick(() => {
    treeRef.value!.expandNode(treeData.value[0].path, true);
  });
});
// 文件夹或文件内容改变执行回调函数
fileApi.changeInvoke((e: IpcRendererEvent, tree: IDirTree[]) => {
  activeTab.value = "1";
  treeData.value = tree;
});

function selectFn(node: IDirTree) {
  // 只有文件才能被选择
  return node.type === "file" ? true : false;
}

// 选择文件
async function handleSelect(node: IDirTree) {
  if (node.type === "file") {
    // saveFileTip(store.$state) // 提示保存！


    const res = await fileApi.selectFile(node.path);

    store.$patch({
      text: res,
      id: node.path,
      isChanged: false,
      name: node.name,
      baseDir: node.basedir,
    });


  }
}

// 右键菜单
function handleContextMenu(e: MouseEvent, node: IDirTree) {
  console.log(e, node);
  //
}

function handleFocus(e: any) {
  e.currentTarget!.select();
}
function handleBlur(node: IDirTree) {
  node.edit = false;
  // 主进程创建文件
  fileApi.createFile(node.basedir + "/" + node.name);
}

// 收集输入框元素
const inputRefDict = ref<Record<string, Record<string, InputInstance>>>({});
function getInputRef(el: InputInstance, node: any) {
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
    path: node.basedir + "/" + node.name + "/" + "Untitled" + max + ".md",
    basedir: node.basedir + "/" + node.name,
  };

  node.children!.push(newFIle);

  nextTick(() => {
    inputRefDict.value[newFIle.name].el.focus();
  });
}

// 侦听文件变化
let unWatch: WatchStopHandle;
watch(
  () => store.isChanged,
  (newVal) => {
    if (newVal) {
      unWatch && unWatch();
    } else {
      unWatch = watch(
        () => store.text,
        (newVal) => {
          const title = store.name ? store.name + "*" : "new file";
          console.log(title);
          windowApi.setTitle(title);

          store.isChanged = true;
        }
      );
    }
  },
  {
    immediate: true,
  }
);
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
