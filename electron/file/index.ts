import { BrowserWindow, dialog, ipcMain } from "electron";
import fs from "fs";

// 读取文件
export function openFile(win: BrowserWindow) {
  const file = dialog.showOpenDialogSync({
    properties: ["openFile"],
  });
  let res: string = "";
  if (file) {
    const rs = fs.createReadStream(file[0], {
      encoding: "utf8",
    });

    rs.on("data", (chunk) => {
      res += chunk;
    });

    rs.on("error", (err) => {
      console.log(err);
    });

    rs.on("end", () => {
      win.webContents.send("open-file", res);
      rs.close()
    });
  }
}

// 保存文件
export function saveFile(win: BrowserWindow) {
  const file = dialog.showSaveDialogSync({});

  if (file) {

    const ws = fs.createWriteStream(file, {
        encoding: "utf8",
        flags: 'w'
      }); 
    ipcMain.on('save-file', (event:Electron.IpcMainInvokeEvent, text:string)=>{
        ws.write(text)
    })
    ws.on('end', ()=>{
        console.log("保存成功！")
        ws.close()
    })

    ws.on('error', (err:Error)=>{
        console.log(err)
    })


  
    win.webContents.send('open-save-dialog')
    


    
  }
}
