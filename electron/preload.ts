import { IpcRendererEvent,contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld('electron', {
    openFile: (callback: (event:IpcRendererEvent, value:string)=>void) => ipcRenderer.on('open-file', callback),
    openSaveDialog:(callback: (event:IpcRendererEvent)=> void) => ipcRenderer.on('open-save-dialog', callback),
    saveFile:(text:string)=> ipcRenderer.send('save-file', text)


})