import { IpcRendererEvent } from "electron";

export interface IDirTree {
  basedir: string;
  name: string;
  type: "dir" | "file";
  deep: number;
  path: string;
  edit: boolean;
  children?: IDirTree[];
}
export interface IMdText {
  id: string;
  text: string;
  name: string;
  baseDir: string;
  mode: "edit" | "preview";
  isChanged: boolean;
}

export interface IFileApi {
  openFile: (
    callback: (
      event: IpcRendererEvent,
      mdText: IMdText,
      tree: IDirTree[]
    ) => void
  ) => Electron.IpcRenderer;

  openSaveDialog: (
    callback: (event: IpcRendererEvent) => void
  ) => Electron.IpcRenderer;

  saveFile: (mdText: IMdText) => Promise<IMdText>;

  isHasPath: (
    callback: (event: IpcRendererEvent) => void
  ) => Electron.IpcRenderer;

  openDir: (
    callback: (event: IpcRendererEvent, tree: IDirTree[]) => void
  ) => Electron.IpcRenderer;

  changeInvoke: (
    callback: (event: IpcRendererEvent, tree: IDirTree[]) => void
  ) => Electron.IpcRenderer;

  selectFile: (path: string) => Promise<string>;

  createFile: (path: string) => Promise<any>;
}

export interface IViewApi {
  isShowSidebar: (callback: () => void) => Electron.IpcRenderer;

  enableEdit: (callback: () => void) => Electron.IpcRenderer;

  enablePreview: (callback: () => void) => Electron.IpcRenderer;
}

export interface IWindowApi {
  setTitle: (title: string) => viod;
}
declare global {
  export interface Window {
    fileApi: IFileApi;
    viewApi: IViewApi;
    windowApi: IWindowApi;
  }
}
