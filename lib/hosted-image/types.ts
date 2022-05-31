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
  /**
   * id is either a URL to the image which will contain at least one `/` or it
   * is a string `id` to find an `ImageEntity` with the target of the
   * `imageEntity` being a `url` or an Object URL to the image on the
   * local computer of the browser.
   */
  id: string
  /**
   * The `size` is required to know what dimensions to display the image at.
   * Remember that during the user doing a resize, the size of the displayed
   * image may not match with the size of the image on the server and that is
   * okay.
   */
  size: [number, number]
  children: VoidChildren
}

export type Resize = {
  type: "inside"
  width: number
  height: number
}
