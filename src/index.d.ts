import { IpcRendererEvent } from "electron";
export interface IElectron {
  openFile: (
    callback: (event: IpcRendererEvent, value: string) => void
  ) => Electron.IpcRenderer;

  openSaveDialog: (
    callback: (event: IpcRendererEvent) => void
  ) => Electron.IpcRenderer;

  saveFile: (text: string) => void;
}
declare global {
  export interface Window {
    electronAPI: IElectron;
  }
}
