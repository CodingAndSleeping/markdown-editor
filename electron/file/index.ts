import { BrowserWindow, dialog, ipcMain } from "electron";
import fs from "fs";
import createDirTree from "../utils/createDirTree";
import IDirTree from "../types/dirTree";

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
export function openFile(win: BrowserWindow) {
  const file = dialog.showOpenDialogSync({
    filters,
    properties: ["openFile"],
  });

  if (file) {
    let res: string = "";
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
      rs.close();
    });
  }
}

// 保存文件
export function saveFile(win: BrowserWindow) {
  const file = dialog.showSaveDialogSync({});

  if (file) {
    const ws = fs.createWriteStream(file, {
      encoding: "utf8",
      flags: "w",
    });
    ipcMain.on(
      "save-file",
      (event: Electron.IpcMainInvokeEvent, text: string) => {
        ws.write(text);
      }
    );
    ws.on("finish", () => {
      console.log("保存成功！");
      ws.close();
    });

    ws.on("error", (err: Error) => {
      console.log(err);
    });
    win.webContents.send("open-save-dialog");
  }
}

// 打开文件夹
export function openDir(win: BrowserWindow) {
  const files = dialog.showOpenDialogSync({
    properties: ["openDirectory"],
  });

  if (files) {
    const tree: IDirTree[] = createDirTree(
      files,
      0,
      ["node_modules"],
      filters[0].extensions
    );
    win.webContents.send("open-dir", tree);
  }
}

// 选择文件
export function selectFile() {
  ipcMain.handle(
    "select-file",
    (event: Electron.IpcMainInvokeEvent, path: string) => {
      let res: string = "";
      if (path) {
        res = fs.readFileSync(path, {
          encoding: "utf8",
        });
      }
      return res;
    }
  );
}
