import {
  nativeSuccess,
  nativeUnavailable,
  type NativeServiceResult,
} from "./native-service-result";
import { Platform, Share } from "react-native";

export type ShareDocumentInput = {
  title: string;
  filename: string;
  text: string;
  url?: string;
};

export const shareService = {
  async shareDocument(
    input: ShareDocumentInput,
  ): Promise<NativeServiceResult<{ shared: boolean }>> {
    if (Platform.OS !== "web") {
      const result = await Share.share({
        title: input.title,
        message: `${input.text}${input.url ? `\n${input.url}` : ""}`,
      });
      return nativeSuccess({ shared: result.action === Share.sharedAction });
    }
    if (typeof navigator !== "undefined" && "share" in navigator && input.url) {
      await navigator.share({
        title: input.title,
        text: input.text,
        url: input.url,
      });
      return nativeSuccess({ shared: true });
    }
    return nativeUnavailable(
      "browser-preview",
      "Native sharing is not available here. The app can still show a copy or download option.",
    );
  },
};
