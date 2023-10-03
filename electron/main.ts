// 控制应用生命周期和创建原生浏览器窗口的模组
import { app, BrowserWindow, ipcMain } from "electron";
import createWindow from "./app/createWindow";
import setMenu from "./app/setMenu";
import { selectFile, createFile } from "./file/index";
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true"; // 去掉警告

app.whenReady().then(() => {
  createWindow(); // 创建窗口
  setMenu(); // 设置菜单
  selectFile(); // 注册选择文件监听事件
  createFile(); // 注册创建文件监听事件
  // saveFileTip() // 注册保存文件提示弹窗监听事件
  app.on("activate", function () {
    // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
    // 打开的窗口，那么程序会重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  ipcMain.on("set-title", (e: Electron.IpcMainInvokeEvent, title: string) => {
    BrowserWindow.getFocusedWindow()?.setTitle(title);
  });
});

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
