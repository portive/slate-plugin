import { createOriginStore } from "./origin-store"
import {
  FullPortiveEditor,
  HostedImageOptions,
  UploadFileOptions,
} from "./types"
import { upload } from "./upload-file"
import {
  handleInputFileChange,
  handlePasteFile,
  handleDropFile,
} from "./handlers"
import { normalizeOrigins, save } from "./save"
import { getOrigins } from "./save/get-origins"
export * from "./types"
export * from "./origin-store"
export * from "./render-image"
export * from "./handlers"

export function withPortive<T extends FullPortiveEditor>(
  editor: T,
  {
    authToken,
    path,
    // images can only be resized as low as this value.
    // If the source image is less than this number, it cannot be resized
    minResizeWidth = 100,
    maxResizeWidth = 1280,
    initialMaxSize,
    initialOrigins,
    createElement,
  }: HostedImageOptions
): T {
  const useStore = createOriginStore({ origins: initialOrigins })
  editor.portive = {
    authToken,
    path,
    minResizeWidth,
    maxResizeWidth,
    initialMaxSize,
    useStore,
    uploadFile(file: File, options?: UploadFileOptions): string {
      return upload(editor, file, options)
    },
    createElement,
    handleDrop(e) {
      return handleDropFile(editor, e)
    },
    handlePaste(e) {
      return handlePasteFile(editor, e)
    },
    handleInputFileChange(e) {
      return handleInputFileChange(editor, e)
    },
    async save(timeoutInMs: number) {
      if (typeof timeoutInMs !== "number") {
        throw new Error(`Please provide a timeout argument that is a number`)
      }
      return await save(editor, timeoutInMs)
    },
    normalize() {
      const origins = getOrigins(editor)
      return normalizeOrigins(editor.children, origins)
    },
  }
  return editor
}
