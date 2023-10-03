import { BrowserWindow, dialog, ipcMain } from "electron";
import fs from "fs";
import createDirTree from "../utils/createDirTree";
import IDirTree from "../types/dirTree";
import { IMdText } from "../types/MdText";
import createWindow from "../app/createWindow";
import path from "path";

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
    try {
      file[0] = file[0].replaceAll("\\", "/");
      const newWin = await createWindow();
      const res = fs.readFileSync(file[0], {
        encoding: "utf8",
      });
      const mdText: IMdText = {
        id: file[0],
        baseDir: path.dirname(file[0]),
        name: path.basename(file[0]),
        text: res,
        mode: "edit",
        isChanged: false,
      };

      const tree: IDirTree[] = createDirTree(
        [mdText.baseDir],
        0,
        ["node_modules"],
        filters[0].extensions
      );

      newWin.webContents.send("open-file", mdText, tree);
    } catch (error) {
      console.log(error);
    }
  }
}

// 保存文件
export function saveFile(win: BrowserWindow) {
  ipcMain.handleOnce(
    "save-file",
    (e: Electron.IpcMainInvokeEvent, mdText: IMdText) => {
      if (mdText.id) {
        try {
          fs.writeFileSync(mdText.id, mdText.text);
        } catch (error) {
          console.log(error);
        }
      } else {
        const file = dialog.showSaveDialogSync({})?.replaceAll("\\", "/");
        if (file) {
          try {
            fs.writeFileSync(file, mdText.text);
            (mdText.id = file), (mdText.name = path.basename(file));
            mdText.baseDir = path.dirname(file);
            mdText.isChanged = false;
          } catch (error) {
            console.log(error);
          }
        }
      }

      return mdText;
    }
  );

  win.webContents.send("is-has-path");
}

// 打开文件夹
export async function openDir(win: BrowserWindow) {
  const files = dialog.showOpenDialogSync({
    properties: ["openDirectory"],
  });
  if (files) {
    // 打开一个新窗口
    files[0] = files[0].replaceAll("\\", "/");
    const newWin = await createWindow();
    const tree: IDirTree[] = createDirTree(
      files,
      0,
      ["node_modules"],
      filters[0].extensions
    );

    newWin.webContents.send("open-dir", tree);

    try {
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
    } catch (error) {
      console.log(error);
    }
    // 侦听目录变化
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

// 保存文件提示弹窗
// export function saveFileTip() {
//   ipcMain.handle(
//     "save-file-tip",
//     (e: Electron.IpcMainInvokeEvent, mdText: IMdText) => {
//       const index = dialog.showMessageBoxSync(
//         BrowserWindow.getFocusedWindow()!,
//         {
//           message: "是否保存内容？",
//           type: "question",
//           buttons: ["保存", "放弃更改", "取消"],
//         }
//       );

//       if (index === 0) {
//         if (mdText.id) {
//           try {
//             fs.writeFileSync(mdText.id, mdText.text);
//           } catch (error) {
//             console.log(error);
//           }
//         } else {
//           const file = dialog.showSaveDialogSync({})?.replaceAll("\\", "/");
//           if (file) {
//             try {
//               fs.writeFileSync(file, mdText.text);
//               (mdText.id = file), (mdText.name = path.basename(file));
//               mdText.baseDir = path.dirname(file);
//               mdText.isChanged = false;
//             } catch (error) {
//               console.log(error);
//             }
//           }
//         }
//       } 

//       return mdText;
//     }
//   );
// }
