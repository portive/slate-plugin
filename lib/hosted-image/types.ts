import { BaseEditor, Element } from "slate"
import { ReactEditor, RenderElementProps } from "slate-react"
import { HistoryEditor } from "slate-history"
import { UseStore } from "./use-store"

export type HostedEditor = {
  defaultResize: Resize
  useStore: UseStore
  hostedImageLookup: Record<string, string>
  uploadHostedImage: (file: File) => string
  minResizeWidth: number
}

export type FullHostedEditor = BaseEditor &
  ReactEditor &
  HistoryEditor &
  HostedEditor

type VoidChildren = [{ text: "" }]

export type HostedImageElement = {
  type: "hosted-image"
  id: string
  size: [number, number]
  children: VoidChildren
}

export type Resize = {
  type: "inside"
  width: number
  height: number
}

/**
 * Entity
 */

export type FileLoadingEntity = {
  type: "loading"
  url: string
  sentBytes: number
  totalBytes: number
}

export type FileUploadedEntity = {
  type: "uploaded"
  url: string
}

export type FileErrorEntity = {
  type: "error"
  url: string
  message: string
}

export type Entity = FileLoadingEntity | FileUploadedEntity | FileErrorEntity

export type EntityState = {
  entities: Record<string, Entity>
  setImage: (id: string, entity: Entity) => void
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
