import { BrowserWindow, dialog, ipcMain } from "electron";
import fs from "fs";
import createDirTree from "../utils/createDirTree";
import IDirTree from "../types/dirTree";
import createWindow from "../app/createWindow";

const filters: Electron.FileFilter[] = [
  {
    name: "Markdown File",
    extensions: [
      "",
      "mdtxt",
      "mdtext",
      "apib",
      "rmarkdown",
      "rmd",
      "qmd",
      "txt",
      "text",
      "md",
      "markdown",
      "mmd",
      "mkd",
      "mdwn",
      "mdown",
      "mdx",
    ],
  },
  { name: "All Files", extensions: ["*"] },
];

// 打开文件
export async function openFile(win: BrowserWindow) {
  const file = dialog.showOpenDialogSync({
    filters,
    properties: ["openFile"],
  });

  if (file) {
    // let res: string = "";
    // const rs = fs.createReadStream(file[0], {
    //   encoding: "utf8",
    // });

    // rs.on("data", (chunk) => {
    //   res += chunk;
    // });

    // rs.on("error", (err) => {
    //   console.log(err);
    // });

    // rs.on("end", () => {
    //   win.webContents.send("open-file", res);
    //   rs.close();
    // });
    try {
      const newWin = await createWindow();
      const res = fs.readFileSync(file[0], {
        encoding: "utf8",
      });
      newWin.webContents.send("open-file", res);
    } catch (error) {
      console.log(error);
    }
  }
}

// 保存文件
export function saveFile(win: BrowserWindow) {
  const file = dialog.showSaveDialogSync({});

  if (file) {

    // const ws = fs.createWriteStream(file, {
    //   encoding: "utf8",
    //   flags: "w",
    // });
    ipcMain.on(
      "save-file",
      (event: Electron.IpcMainInvokeEvent, text: string) => {
        // ws.write(text);
        try {
          fs.writeFileSync(file, text);
        } catch (error) {
          console.log(error)
        }
 
      }
    );

    win.webContents.send("open-save-dialog");
    // ws.on("finish", () => {
    //   console.log("保存成功！");
    //   ws.close();
    // });

    // ws.on("error", (err: Error) => {
    //   console.log(err);
    // });

  }
}

// 打开文件夹
export async function openDir(win: BrowserWindow) {
  const files = dialog.showOpenDialogSync({
    properties: ["openDirectory"],
  });
  if (files) {
    // 打开一个新窗口
    const newWin = await createWindow();
    const tree: IDirTree[] = createDirTree(
      files,
      0,
      ["node_modules"],
      filters[0].extensions
    );

    newWin.webContents.send("open-dir", tree);

    // 侦听目录变化
    fs.watch(
      files[0],
      null,
      (eventType: fs.WatchEventType, filename: string | null) => {
        const tree: IDirTree[] = createDirTree(
          files,
          0,
          ["node_modules"],
          filters[0].extensions
        );
        newWin.webContents.send("change-invoke", tree);
      }
    );
  }
}

// 选择文件
export function selectFile() {
  ipcMain.handle(
    "select-file",
    (event: Electron.IpcMainInvokeEvent, path: string) => {
      let res: string = "";
      if (path) {
        try {
          res = fs.readFileSync(path, {
            encoding: "utf8",
          });
        } catch (error) {
          console.log(error);
        }
      }
      return res;
    }
  );
}

// 新建文件
export function createFile() {
  ipcMain.handle(
    "create-file",
    (e: Electron.IpcMainInvokeEvent, path: string) => {
      try {
        if (!fs.existsSync(path)) {
          fs.writeFileSync(path, "");
        }
      } catch (error) {
        console.log(error);
      }
    }
  );
}
