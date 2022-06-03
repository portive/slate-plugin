import { createOriginStore } from "./origin-store"
import { FullPortiveEditor, HostedImageOptions } from "./types"
import { upload } from "./upload-file"
import {
  handleChangeInputFile,
  handlePasteFile,
  handleDropFile,
} from "./handlers"
import { normalizeOrigins } from "./save"
export * from "./types"
export * from "./origin-store"
export * from "./render-image"
export * from "./handlers"

export function withPortive<T extends FullPortiveEditor>(
  {
    authToken,
    path,
    // images can only be resized as low as this value.
    // If the source image is less than this number, it cannot be resized
    minResizeWidth = 100,
    maxResizeWidth = 1280,
    initialMaxSize,
    initialOrigins,
    createImageFile,
    createGenericFile,
  }: HostedImageOptions,
  editor: T
): T {
  const useStore = createOriginStore({ origins: initialOrigins })
  editor.portive = {
    authToken,
    path,
    minResizeWidth,
    maxResizeWidth,
    initialMaxSize,
    useStore,
    uploadFile(file: File): string {
      return upload(editor, file)
    },
    createImageFile,
    createGenericFile,
    handleDrop(e) {
      return handleDropFile(editor, e)
    },
    handlePaste(e) {
      return handlePasteFile(editor, e)
    },
    handleChangeInputFile(e) {
      return handleChangeInputFile(editor, e)
    },
    async save() {
      return { status: "success", value: [] }
    },
    normalize() {
      const origins = editor.portive.useStore.getState().origins
      return normalizeOrigins(editor.children, origins)
    },
  }
  return editor
}
