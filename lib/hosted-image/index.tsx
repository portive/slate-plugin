import { createStore } from "../shared/use-store"
import { FullPortiveEditor, FileEntityProps, HostedImageOptions } from "./types"
import { upload } from "./upload-hosted-image"
export * from "./types"
export * from "../shared/use-store"
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
    useStore: createStore<FileEntityProps>({ entities: initialEntities }),
    uploadFile(file: File): string {
      return upload(editor, file)
    },
    createImageFile,
    createGenericFile,
  }
  return editor
}
