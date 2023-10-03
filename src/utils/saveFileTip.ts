import { useMdTextStore } from "@/store/mdText";
import { IMdText } from "@/types/MdText";
import { toRaw } from "vue";

const { fileApi } = window;

export default async function saveFileTip(mdText: IMdText) {
  const store = useMdTextStore();
  if (mdText.isChanged) {
    // const newMdText = await fileApi.saveFileTip(toRaw(mdText));

    // store.$patch(newMdText);
  }
}
