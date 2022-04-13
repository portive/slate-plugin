import { nanoid } from "nanoid"
import { createStore } from "./use-store"
import { Entity, FullHostedEditor, Resize } from "./types"
import { uploadHostedImage } from "./upload-hosted-image"
export * from "./types"
export * from "./use-store"
export * from "./render"
export * from "./handlers"

export function withHostedImage<T extends FullHostedEditor>(
  {
    // images can only be resized as low as this value.
    // If the source image is less than this number, it cannot be resized
    minResizeWidth = 100,
    maxResizeWidth = 1280,
    defaultResize,
    initialEntities,
  }: {
    minResizeWidth?: number
    maxResizeWidth?: number
    defaultResize: Resize
    initialEntities: Record<string, Entity>
  },
  editor: T
): T {
  editor.minResizeWidth = minResizeWidth
  editor.maxResizeWidth = maxResizeWidth
  editor.useStore = createStore({ entities: initialEntities })
  editor.defaultResize = defaultResize
  editor.uploadHostedImage = (file: File) => {
    const id = nanoid()
    // NOTE: Executed without `await` on purpose
    uploadHostedImage(editor, id, file)
    return id
  }
  return editor
}
