import { createStore } from "../shared/use-store"
import {
  FullPortivedHostedImageEditor,
  ImageFileEntityProps,
  HostedImageOptions,
} from "./types"
import { uploadHostedImage } from "./upload-hosted-image"
export * from "./types"
export * from "../shared/use-store"
export * from "./render"
export * from "./handlers"

export function withHostedImage<T extends FullPortivedHostedImageEditor>(
  {
    authToken,
    path,
    // images can only be resized as low as this value.
    // If the source image is less than this number, it cannot be resized
    minResizeWidth = 100,
    maxResizeWidth = 1280,
    defaultResize,
    initialEntities,
  }: HostedImageOptions,
  editor: T
): T {
  editor.hostedImage = {
    authToken,
    path,
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
