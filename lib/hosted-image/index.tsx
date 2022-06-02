import { createOriginStore } from "../shared/origin-store"
import { FullPortiveEditor, HostedImageOptions } from "./types"
import { upload } from "./upload-hosted-image"
import {
  handleChangeInputFile,
  handlePasteFile,
  handleDropFile,
} from "./handlers"
export * from "./types"
export * from "../shared/origin-store"
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
    defaultResize,
    initialEntities,
    createImageFile,
    createGenericFile,
  }: HostedImageOptions,
  editor: T
): T {
  editor.portive = {
    authToken,
    path,
    minResizeWidth,
    maxResizeWidth,
    defaultResize,
    useStore: createOriginStore({ origins: initialEntities }),
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
  }
  return editor
}
