export default interface IDirTree {
  path: string;
  name: string;
  type: "dir" | "file";
  deep: number;
  // key: string;
  children?: IDirTree[];
}
