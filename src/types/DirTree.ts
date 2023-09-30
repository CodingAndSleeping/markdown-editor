export default interface IDirTree {
  basedir: string;
  name: string;
  type: "dir" | "file";
  deep: number;
  path: string;
  edit:boolean,
  children?: IDirTree[];
}
