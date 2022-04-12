import { BaseEditor, Element } from "slate"
import { ReactEditor, RenderElementProps } from "slate-react"
import { UseStore } from "./use-store"

export type HostedEditor = {
  defaultResize: Resize
  useStore: UseStore
  hostedImageLookup: Record<string, string>
  uploadHostedImage: (file: File) => string
}

export type FullHostedEditor = BaseEditor & ReactEditor & HostedEditor

type VoidChildren = [{ text: "" }]

export type HostedImageElement = {
  type: "hosted-image"
  id: string
  children: VoidChildren
}

export type Resize = {
  type: "inside"
  width: number
  height: number
}

/**
 * Take one type and narrows it using a second type, usually on a type field
 * like:
 *
 * { type: "cat", ... } or { type: "dog", ... }
 *
 * This is typically referred to as a Discriminated Union in TypeScript.
 */
export type Discriminate<T, N> = T extends N ? T : never

export type DiscriminatedRenderElementProps<T extends Element["type"]> =
  // Remote `element`
  Omit<RenderElementProps, "element"> & {
    // Add `element` back after having discriminated it
    element: Discriminate<Element, { type: T }>
  }

export type UploadPolicy = {
  status: "success"
  data: {
    apiUrl: string
    fileUrl: string
    formFields: Record<string, string>
  }
}
