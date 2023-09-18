import { BrowserWindow } from "electron";
import path from 'path';


export default function(){
    // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // 引入预加载文件
      preload: path.join(__dirname, "../preload.js"),
    },
  });

  // 判断当前环境是否为开发环境
  if (process.env.NODE_ENV === "development") {
    // 当处于开发环境时，页面加载本地服务，并自动打开开发者工具
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    // 否则页面加载打包后的index.html文件
    mainWindow.loadFile(path.join(__dirname, "./index.html"));
  }

  return mainWindow;
}