import { Menu, MenuItemConstructorOptions } from "electron";
import { openFile, saveFile } from "../file/index";
import createWindow from "./createWindow";
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
            openFile(win!);
          },
        },
        {
          type: "separator",
        },
        {
          label: "保存",
          accelerator: "CmdOrCtrl+S",
          click: (menuItem, win, e) => saveFile(win!),
        }
      ],
    },
    {
      label: "编辑", 
      submenu: [
        //子菜单
        {
          label: "复制",
          accelerator: "CmdOrCtrl+C",
          role: "copy",
        },
        {
          label: "粘贴",
          role: "paste",
        },
      ],
    },
    {
      label:"视图", 
      submenu:[
        {
          label:"显示/隐藏侧边栏",
          accelerator:"CmdOrCtrl+Shift+L",
          click(menuItem,win,e){
            
          }
        }
      ]
      
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
