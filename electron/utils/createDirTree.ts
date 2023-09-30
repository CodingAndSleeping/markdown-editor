import path from "path";
import fs from "fs";
import IDirTree from "../types/dirTree";
/**
 *
 * @param dirs 目标文件夹数组，如只有一项，则为长度为1的文件夹数组
 * @param deep 文件夹的起始深度，默认为 0
 * @param filter 要过滤的文件夹或文件，默认为空数组
 * @param destinationExtName 要遍历的目标格式文件，以拓展格式组成的字符串数组,不包含 . ，默认为空数组
 * @returns 目录树
 *
 */
export default function createDirTree(
  dirs: string[],
  deep: number = 0,
  filter: string[] = [],
  destinationExtName: string[] = []
): IDirTree[] {
  // 过滤文件夹或文件
  dirs = dirs.filter((dir) => {
    return !filter.includes(path.basename(dir));
  });
  // 筛选目标格式文件
  if (destinationExtName.length !== 0) {
    dirs = dirs.filter((dir) => {
      const stat = fs.statSync(dir);
      return (
        stat.isDirectory() ||
        destinationExtName.includes(path.extname(dir).substring(1))
      );
    });
  }

  let res: IDirTree[] = [];
  try {
    res = dirs.map((dir, index) => {
      const basedir = path.dirname(dir);
      const name = path.basename(dir);
      const stat = fs.statSync(dir);
      if (stat.isDirectory()) {
        const subDirs = fs.readdirSync(dir).map((item) => path.join(dir, item)); // 拼接子文件路径
        return {
          basedir: basedir,
          name: name,
          type: "dir",
          deep: deep,
          path: basedir + "/" + name,
          edit: false,
          children: createDirTree( // 递归调用
            subDirs,
            deep + 1,
            filter,
            destinationExtName
          ),
        };
      }

      return {
        basedir: basedir,
        name: name,
        type: "file",
        deep: deep,
        edit: false,
        path: basedir + "/" + name,
      };
    });
  } catch (error) {
    console.log(error);
  }

  return res;
}
