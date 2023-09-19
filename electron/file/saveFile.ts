import { BrowserWindow, dialog } from "electron";
import fs from "fs";

export default function (win: BrowserWindow) {
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
      console.log("res=>", res);
      win.webContents.send("read-file", res);
    });
  }
}
