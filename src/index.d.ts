import { IpcRendererEvent } from "electron";

export interface IDirTree {
  basedir: string;
  name: string;
  type: "dir" | "file";
  deep: number;
  path: string;
  edit:boolean,
  children?: IDirTree[];
}

export interface IFileApi {
  openFile: (
    callback: (event: IpcRendererEvent, value: string) => void
  ) => Electron.IpcRenderer;

  openSaveDialog: (
    callback: (event: IpcRendererEvent) => void
  ) => Electron.IpcRenderer;

  // saveFile: (text: string) => void;

  openDir: (
    callback: (event: IpcRendererEvent, tree:IDirTree[]) => void
  ) => Electron.IpcRenderer;

  changeInvoke: (
    callback: (event: IpcRendererEvent, tree:IDirTree[]) => void
  ) => Electron.IpcRenderer;

  selectFile: (path:string)=> Promise<string>


  createFile: (path:string)=> Promise<any>
}

export interface IViewApi {
  isShowSidebar: (callback: () => void) => Electron.IpcRenderer;
}
declare global {
  export interface Window {
    fileApi: IFileApi;
    viewApi: IViewApi;
  }
}
