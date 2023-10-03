export interface IMdText {
  id: string;
  text: string;
  name: string;
  baseDir: string;
  mode: "edit" | "preview";
  isChanged: boolean;
}
