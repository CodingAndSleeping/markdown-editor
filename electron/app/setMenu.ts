import { BrowserWindow, Menu } from "electron";
import {openFile, saveFile} from "../file/index";
export default function (win: BrowserWindow) {
  const template = [
    {
      label: "文件", //父菜单
      submenu: [
        //子菜单
        {
          label: "打开",
          click: () => openFile(win),
        },
        {
          label: "保存",
          click: () => saveFile(win),
        },
      ],
    },
    {
      label: "编辑", //父菜单
      submenu: [
        //子菜单
        { label: "复制" },
        { label: "粘贴" },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
