import { Menu } from "electron";
import saveFile from '../file/saveFile';
const template = [
  {
    label: "文件", //父菜单
    submenu: [
      //子菜单
      {
        label: "打开",
        click: () => {
            const file =  saveFile() 
            console.log(file)
        },
      },
      {
        label: "保存",
        click: () => {
          console.log("save");
        },
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
export default function () {
  return Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
