export interface IElectron {
  saveFile: () => string;
}
declare global {
  interface Window {
    electron: IElectron;
  }
}
