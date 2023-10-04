import { Menu, MenuItemConstructorOptions } from "electron";
import { openFile, saveFile, openDir } from "../file/index";
import createWindow from "./createWindow";
import path from "path";
export default function () {
  const template: MenuItemConstructorOptions[] = [
    {
      label: "文件",
      submenu: [
        //子菜单
        {
          label: "新建",
          accelerator: "CmdOrCtrl+N",
          click(menuItem, win, e) {
            createWindow();
          },
        },
        {
          label: "新建窗口",
          accelerator: "CmdOrCtrl+Shift+N",
          click(menuItem, win, e) {
            createWindow();
          },
        },
        {
          type: "separator",
        },
        {
          label: "打开",
          accelerator: "CmdOrCtrl+O",
          click(menuItem, win, e) {
            openFile(win!);
          },
        },
        {
          label: "打开文件夹",
          click(menuItem, win, e) {
            // 打开文件夹
            openDir(win!);
          },
        },
        {
          type: "separator",
        },
        {
          label: "保存",
          accelerator: "CmdOrCtrl+S",
          click(menuItem, win, e) {
            saveFile(win!);
          },
        },
      ],
    },
    {
      label: "编辑",
      submenu: [
        //子菜单
        {
          label: "编辑",
          type: "radio",
          accelerator: "CmdOrCtrl+E",
          click(menuItem, win, e) {
            if (win) win.webContents.send("enable-edit");
          },
        },
        {
          label: "预览",
          type: "radio",
          accelerator: "CmdOrCtrl+P",
          click(menuItem, win, e) {
            if (win) win.webContents.send("enable-preview");
          },
        },
      ],
    },
    {
      label: "视图",
      submenu: [
        {
          label: "显示/隐藏侧边栏",
          accelerator: "CmdOrCtrl+Shift+L",
          click(menuItem, win, e) {
            if (win) win.webContents.send("is-show-sidebar");
          },
        },
        {
          label: "开发者工具",
          accelerator: "CmdOrCtrl+Shift+D",
          click(menuItem, win, e) {
            if (win)
              win.webContents.isDevToolsOpened()
                ? win.webContents.closeDevTools()
                : win.webContents.openDevTools();
          },
        },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
