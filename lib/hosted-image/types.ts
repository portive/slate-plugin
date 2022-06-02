import { BaseEditor, Element } from "slate"
import { ReactEditor } from "slate-react"
import { HistoryEditor } from "slate-history"
import { Promisable } from "type-fest"
import { createOriginStore } from "../shared/origin-store"
import { OriginStatus } from "../shared/types"
import { ClientGenericFile, ClientImageFile } from "@portive/api-types"

/**
 * Origin
 */

export type ImageFileOriginProps = {
  type: "image"
  url: string
  maxSize: [number, number] // necessary for when the image is still a BLOB
}

export type GenericFileOriginProps = {
  type: "generic"
  url: string
}

export type FileOriginProps = GenericFileOriginProps | ImageFileOriginProps

export type ImageFileOrigin = OriginStatus<ImageFileOriginProps>
export type GenericFileOrigin = OriginStatus<GenericFileOriginProps>
export type FileOrigin = OriginStatus<FileOriginProps>

export type HostedImageOptions = {
  authToken: string | (() => Promisable<string>)
  path: string
  defaultResize: Resize
  minResizeWidth?: number
  maxResizeWidth?: number
  initialOrigins: Record<string, FileOrigin>
  createImageFile: (e: CreateImageFileProps) => Element
  createGenericFile: (e: CreateGenericFileProps) => Element
}

export type PortiveEditorProp = {
  authToken: string | (() => Promisable<string>)
  path: string
  defaultResize: Resize
  minResizeWidth: number
  maxResizeWidth: number
  useStore: ReturnType<typeof createOriginStore>
  uploadFile: (file: File) => string
  createImageFile: (e: CreateImageFileProps) => Element
  createGenericFile: (e: CreateGenericFileProps) => Element
  handlePaste: (e: React.ClipboardEvent) => boolean
  handleDrop: (e: React.DragEvent) => boolean
  handleChangeInputFile: (e: React.ChangeEvent<HTMLInputElement>) => boolean
}

export type PortiveEditor = {
  portive: PortiveEditorProp
}

export type FullPortiveEditor = BaseEditor &
  ReactEditor &
  HistoryEditor &
  PortiveEditor

type VoidChildren = [{ text: "" }]

export interface HostedImageInterface {
  /**
   * id is either a URL to the image which will contain at least one `/` or it
   * is a string `id` to find an `ImageOrigin` with the target of the
   * `imageOrigin` being a `url` or an Object URL to the image on the
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

export interface HostedFileInterface {
  /**
   * id is either a URL to the file which will contain at least one `/` or it
   * is a string `id` to find an `ImageOrigin` with the target of the
   * `fileEneity` being a `url` or an Object URL to the file on the
   * local computer of the browser.
   */
  id: string
  children: VoidChildren
}

export type Resize = {
  type: "inside"
  width: number
  height: number
}

export type CreateImageFileProps = {
  id: string
  file: File
  clientFile: ClientImageFile
}

export type CreateGenericFileProps = {
  id: string
  file: File
  clientFile: ClientGenericFile
}
