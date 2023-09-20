import { IpcRendererEvent } from "electron";

declare global {
  export interface IElectron {
    openFile: (
      callback: (event: IpcRendererEvent, value: string) => void
    ) => Electron.IpcRenderer;

    openSaveDialog: (
      callback: (event: IpcRendererEvent) => void
    ) => Electron.IpcRenderer;

    saveFile: (text: string) => void;
  }
  export interface Window {
    electron: IElectron;
  }
}
