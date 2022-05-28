import { BaseEditor } from "slate"
import { ReactEditor } from "slate-react"
import { HistoryEditor } from "slate-history"
import { Promisable } from "type-fest"
import { UseImageStore } from "../shared/use-store"
import { Entity } from "../shared/types"

/**
 * Entity
 */

export type ImageFileEntityProps = {
  url: string
  maxSize: [number, number] // necessary for when the image is still a BLOB
}

export type ImageEntity = Entity<ImageFileEntityProps>

export type HostedImageOptions = {
  authToken: string | (() => Promisable<string>)
  path: string
  defaultResize: Resize
  minResizeWidth?: number
  maxResizeWidth?: number
  initialEntities: Record<string, ImageEntity>
}

export type HostedImageEditorProp = {
  authToken: string | (() => Promisable<string>)
  path: string
  defaultResize: Resize
  minResizeWidth: number
  maxResizeWidth: number
  // useStore: UseStore // store of entities. `initialEntities` is put into here initially.
  useStore: UseImageStore
  uploadHostedImage: (file: File) => string
}

export type PortiveHostedImageEditor = {
  hostedImage: HostedImageEditorProp
}

export type FullPortivedHostedImageEditor = BaseEditor &
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
