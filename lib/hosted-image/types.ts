import { BaseEditor } from "slate"
import { ReactEditor } from "slate-react"
import { HistoryEditor } from "slate-history"
import { UseStore } from "./use-store"
import { Promisable } from "type-fest"

export type UploadOptions = {
  authToken: string | (() => Promisable<string>)
  defaultResize: Resize
  minResizeWidth?: number
  maxResizeWidth?: number
  initialEntities: Record<string, Entity>
}

export type PortiveHostedImageOptions = {
  authToken: string | (() => Promisable<string>)
  defaultResize: Resize
  minResizeWidth: number
  maxResizeWidth: number
  useStore: UseStore // store of entities. `initialEntities` is put into here initially.
  uploadHostedImage: (file: File) => string
}

export type PortiveHostedImageEditor = {
  portiveHostedImageOptions: PortiveHostedImageOptions
}

export type FullHostedEditor = BaseEditor &
  ReactEditor &
  HistoryEditor &
  PortiveHostedImageEditor

type VoidChildren = [{ text: "" }]

export interface HostedImageInterface {
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

type FileSharedEntity = {
  url: string
  maxSize: [number, number]
}

export type FileLoadingEntity = {
  type: "loading"
  sentBytes: number
  totalBytes: number
} & FileSharedEntity

export type FileUploadedEntity = {
  type: "uploaded"
} & FileSharedEntity

export type FileErrorEntity = {
  type: "error"
  message: string
} & FileSharedEntity

export type Entity = FileLoadingEntity | FileUploadedEntity | FileErrorEntity

export type EntityState = {
  entities: Record<string, Entity>
  setEntity: (id: string, entity: Entity) => void
  getEntity: (id: string) => Entity
}

// /**
//  * Take one type and narrows it using a second type, usually on a type field
//  * like:
//  *
//  * { type: "cat", ... } or { type: "dog", ... }
//  *
//  * This is typically referred to as a Discriminated Union in TypeScript.
//  */
// export type Discriminate<T, N> = T extends N ? T : never

// export type DiscriminatedRenderElementProps<T extends Element["type"]> =
//   // Remote `element`
//   Omit<RenderElementProps, "element"> & {
//     // Add `element` back after having discriminated it
//     element: Discriminate<Element, { type: T }>
//   }

// export type RenderElementPropsFor<T> = Omit<RenderElementProps, "element"> & {
//   element: T
// }

export type UploadPolicy = {
  status: "success"
  data: {
    apiUrl: string
    fileUrl: string
    formFields: Record<string, string>
  }
}
