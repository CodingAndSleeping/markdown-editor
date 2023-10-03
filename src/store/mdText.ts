import type { IMdText } from "@/types/MdText";
import { defineStore } from "pinia";

export const useMdTextStore = defineStore("mdText", {
  state: (): IMdText => ({
    id: "",
    text: "",
    name: "",
    baseDir: "",
    mode: "edit",
    isChanged: false,
  }),
});
