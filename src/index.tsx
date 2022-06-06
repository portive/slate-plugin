import { createOriginStore } from "./origin-store"
import {
  FullPortiveEditor,
  WithPortiveOptions,
  SaveOptions,
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
export * from "./element-presets/attachment-block"
export * from "./element-presets/image-block"
export * from "./element-presets/image-inline"
export * from "./element-presets/titled-image-block"

export function withPortive<T extends FullPortiveEditor>(
  editor: T,
  {
    authToken,
    apiOriginUrl,
    path,
    // images can only be resized as low as this value.
    // If the source image is less than this number, it cannot be resized
    minResizeWidth = 100,
    maxResizeWidth = 1280,
    initialMaxSize,
    initialOrigins,
    createImageFileElement,
    createFileElement,
  }: WithPortiveOptions
): T {
  const useStore = createOriginStore({ origins: initialOrigins })
  editor.portive = {
    authToken,
    apiOriginUrl,
    path,
    minResizeWidth,
    maxResizeWidth,
    initialMaxSize,
    useStore,
    uploadFile(file: File, options?: UploadFileOptions): string {
      return upload(editor, file, options)
    },
    createImageFileElement,
    createFileElement,
    handleDrop(e) {
      return handleDropFile(editor, e)
    },
    handlePaste(e) {
      return handlePasteFile(editor, e)
    },
    handleInputFileChange(e) {
      return handleInputFileChange(editor, e)
    },
    async save(options: SaveOptions = {}) {
      return await save(editor, options)
    },
    normalize() {
      const origins = getOrigins(editor)
      return normalizeOrigins(editor.children, origins)
    },
  }
  return editor
}
