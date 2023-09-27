import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";
import IDirTree from "./types/dirTree";
contextBridge.exposeInMainWorld("fileApi", {
  // 打开文件
  openFile: (callback: (event: IpcRendererEvent, value: string) => void) =>
    ipcRenderer.on("open-file", callback),

  // 当保存文件
  openSaveDialog: (callback: (event: IpcRendererEvent) => void) =>
    ipcRenderer.on("open-save-dialog", callback),

  // // 保存文件
  // saveFile: (text: string) => ipcRenderer.send("save-file", text),

  // 打开文件夹
  openDir: (callback: (event: IpcRendererEvent, tree: IDirTree[]) => void) =>
    ipcRenderer.on("open-dir", callback),

  // 选择文件
  selectFile: (path: string) => ipcRenderer.invoke("select-file", path),

  // 新建文件
  createFile:(path:string)=>ipcRenderer.invoke("create-file", path)
});

contextBridge.exposeInMainWorld("viewApi", {
  // 显示/隐藏侧边栏
  isShowSidebar: (callback: () => void) =>
    ipcRenderer.on("is-show-sidebar", callback),
});
