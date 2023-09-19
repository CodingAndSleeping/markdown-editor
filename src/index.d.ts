
import { IpcRendererEvent } from "electron";  


declare global {
  interface IElectron {
    readFile: (
      callback: (event: IpcRendererEvent, value: string) => void
    ) => Electron.IpcRenderer;
  }
  interface Window {
    electron: IElectron;
  }
}
