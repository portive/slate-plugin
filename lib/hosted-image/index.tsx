import { createStore } from "../shared/use-store"
import { FullHostedEditor, ImageFileEntityProps, UploadOptions } from "./types"
import { uploadHostedImage } from "./upload-hosted-image"
export * from "./types"
export * from "../shared/use-store"
export * from "./render"
export * from "./handlers"

export function withHostedImage<T extends FullHostedEditor>(
  {
    authToken,
    // images can only be resized as low as this value.
    // If the source image is less than this number, it cannot be resized
    minResizeWidth = 100,
    maxResizeWidth = 1280,
    defaultResize,
    initialEntities,
  }: UploadOptions,
  editor: T
): T {
  editor.portiveHostedImageOptions = {
    authToken,
    minResizeWidth,
    maxResizeWidth,
    defaultResize,
    useStore: createStore<ImageFileEntityProps>({ entities: initialEntities }),
    uploadHostedImage(file: File): string {
      return uploadHostedImage(editor, file)
    },
  }
  return editor
}
