import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";
import IDirTree from "./types/dirTree";
import { IMdText } from "./types/MdText";
contextBridge.exposeInMainWorld("fileApi", {
  // 打开文件
  openFile: (
    callback: (
      event: IpcRendererEvent,
      mdText: IMdText,
      tree: IDirTree[]
    ) => void
  ) => ipcRenderer.on("open-file", callback),

  // 当保存文件
  openSaveDialog: (callback: (event: IpcRendererEvent) => void) =>
    ipcRenderer.on("open-save-dialog", callback),

  // // 保存文件
  // saveFile: (text: string) => ipcRenderer.send("save-file", text),

  // 判断当前是否是已打开的文件
  isHasPath: (callback: (event: IpcRendererEvent) => void) =>
    ipcRenderer.on("is-has-path", callback),

  // 打开文件夹
  openDir: (callback: (event: IpcRendererEvent, tree: IDirTree[]) => void) =>
    ipcRenderer.on("open-dir", callback),

  // 侦听文件夹或文件变化触发事件
  changeInvoke: (
    callback: (event: IpcRendererEvent, tree: IDirTree[]) => void
  ) => ipcRenderer.on("change-invoke", callback),

  // 选择文件
  selectFile: (path: string) => ipcRenderer.invoke("select-file", path),

  // 新建文件
  createFile: (path: string) => ipcRenderer.invoke("create-file", path),

  // 保存文件提示弹窗
  // saveFileTip: (mdText: IMdText) => ipcRenderer.invoke("save-file-tip", mdText),
});

contextBridge.exposeInMainWorld("viewApi", {
  // 显示/隐藏侧边栏
  isShowSidebar: (callback: () => void) =>
    ipcRenderer.on("is-show-sidebar", callback),
});

contextBridge.exposeInMainWorld("windowApi", {
  setTitle: (title: string) => ipcRenderer.send("set-title", title),
});
