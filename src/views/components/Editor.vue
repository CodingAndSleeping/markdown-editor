<template>
  <div class="main">
    <md-editor
      class="editor"
      :editor-id="store.id || 'editor'"
      v-model="store.text"
      :toolbars="toolBars"
      @onSave="handleSave"
      @onUploadImg="handleUploadImg"
    >
    </md-editor>
  </div>
</template>

<script setup lang="ts">
import { useMdTextStore } from "@/store/mdText";
import { toRaw ,ref} from "vue";
const store = useMdTextStore();
const { fileApi, windowApi } = window;

const toolBars = ref([
  "bold",
  "underline",
  "italic",
  "-",
  "title",
  "strikeThrough",
  "sub",
  "sup",
  "quote",
  "unorderedList",
  "orderedList",
  "task",
  "-",
  "codeRow",
  "code",
  "link",
  "image",
  "table",
  "mermaid",
  "katex",
]);

async function handleSave() {
  const newMdText = await fileApi.saveFile(toRaw(store.$state));
  windowApi.setTitle(newMdText.name || "new file");
  store.$patch(newMdText);
}

function handleUploadImg(
  files: Array<File>,
  cb: (urls: Array<string>) => void
): void {
  cb(files.map((file) => file.path.replaceAll("\\", "/")));
}
</script>

<style lang="scss">
.main {
  height: 100%;
  .editor {
    height: 100%;
  }
}
</style>
