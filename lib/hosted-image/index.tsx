import { nanoid } from "nanoid"
import { createStore } from "./use-store"
import { FullHostedEditor, UploadOptions } from "./types"
import { uploadHostedImage } from "./upload-hosted-image"
export * from "./types"
export * from "./use-store"
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
  editor.hostedUpload = {
    authToken,
    minResizeWidth,
    maxResizeWidth,
    defaultResize,
    useStore: createStore({ entities: initialEntities }),
    uploadHostedImage(file: File) {
      const id = nanoid()
      // NOTE: Executed without `await` on purpose because this method
      // starts the `uploadHostedImage` but doesn't wait for it to finish
      // before returning
      uploadHostedImage(editor, id, file)
      return id
    },
  }
  return editor
}
