import { IpcRendererEvent } from "electron"

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
    readFile: (callback: (event:IpcRendererEvent, value:string)=>void) => ipcRenderer.on('read-file', callback)
})