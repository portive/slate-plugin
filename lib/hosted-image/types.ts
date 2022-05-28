import { BaseEditor } from "slate"
import { ReactEditor } from "slate-react"
import { HistoryEditor } from "slate-history"
import { Promisable } from "type-fest"
import { UseImageStore } from "../shared/use-store"

export type UploadOptions = {
  authToken: string | (() => Promisable<string>)
  defaultResize: Resize
  minResizeWidth?: number
  maxResizeWidth?: number
  initialEntities: Record<string, Entity<ImageFileEntityProps>>
}

export type PortiveHostedImageOptions = {
  authToken: string | (() => Promisable<string>)
  defaultResize: Resize
  minResizeWidth: number
  maxResizeWidth: number
  // useStore: UseStore // store of entities. `initialEntities` is put into here initially.
  useStore: UseImageStore
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

export type ImageFileEntityProps = {
  url: string
  maxSize: [number, number] // necessary for when the image is still a BLOB
}

export type FileLoadingEntity<T> = {
  type: "loading"
  sentBytes: number
  totalBytes: number
} & T

export type FileUploadedEntity<T> = {
  type: "uploaded"
} & T

export type FileErrorEntity<T> = {
  type: "error"
  message: string
} & T

export type Entity<T> =
  | FileLoadingEntity<T>
  | FileUploadedEntity<T>
  | FileErrorEntity<T>

export type EntityState<T> = {
  entities: Record<string, Entity<T>>
  setEntity: (id: string, entity: Entity<T>) => void
  getEntity: (id: string) => Entity<T>
}

export type UploadPolicy = {
  status: "success"
  data: {
    apiUrl: string
    fileUrl: string
    formFields: Record<string, string>
  }
}
