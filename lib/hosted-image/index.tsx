import { nanoid } from "nanoid"
import { Element } from "slate"
import { createStore, Entity } from "./use-store"
import { FullHostedEditor, Resize } from "./types"
import { uploadHostedImage } from "./upload-hosted-image"
export * from "./types"
export * from "./use-store"
export * from "./render"

export function withHostedImage<T extends FullHostedEditor>(
  {
    defaultResize,
    initialEntities,
  }: { defaultResize: Resize; initialEntities: Record<string, Entity> },
  editor: T
): T {
  const isVoid = editor.isVoid
  editor.isVoid = (element: Element): boolean => {
    if (element.type === "hosted-image") return true
    return isVoid(element)
  }
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
