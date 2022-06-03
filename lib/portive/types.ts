import { BaseEditor, Descendant, Element } from "slate"
import { ReactEditor } from "slate-react"
import { HistoryEditor } from "slate-history"
import { Promisable } from "type-fest"
import { createOriginStore } from "./origin-store"
import { ClientGenericFile, ClientImageFile } from "@portive/api-types"

/**
 * Origin
 */

export type OriginUploading = {
  url: string
  status: "uploading"
  sentBytes: number
  totalBytes: number
}

export type OriginUploaded = {
  url: string
  status: "uploaded"
}

export type OriginError = {
  url: string
  status: "error"
  message: string
}

export type Origin = OriginUploading | OriginUploaded | OriginError

export type OriginState = {
  origins: Record<string, Origin>
  setOrigin: (originKey: string, origin: Origin) => void
  getOrigin: (originKey: string) => Origin
}

export type HostedImageOptions = {
  authToken: string | (() => Promisable<string>)
  path: string
  initialMaxSize: [number, number]
  minResizeWidth?: number
  maxResizeWidth?: number
  initialOrigins: Record<string, Origin>
  createImageFile: (e: CreateImageFileProps) => Element
  createGenericFile: (e: CreateGenericFileProps) => Element
}

export type SaveResult = {
  status: "success"
  value: Descendant[]
}

export type PortiveEditorProp = {
  authToken: string | (() => Promisable<string>)
  path: string
  initialMaxSize: [number, number]
  minResizeWidth: number
  maxResizeWidth: number
  useStore: ReturnType<typeof createOriginStore>
  uploadFile: (file: File) => string
  createImageFile: (e: CreateImageFileProps) => Element
  createGenericFile: (e: CreateGenericFileProps) => Element
  handlePaste: (e: React.ClipboardEvent) => boolean
  handleDrop: (e: React.DragEvent) => boolean
  handleChangeInputFile: (e: React.ChangeEvent<HTMLInputElement>) => boolean
  save: () => Promise<SaveResult>
  normalize: () => Descendant[]
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
  originKey: string
  originSize: [number, number]
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
  originKey: string
  children: VoidChildren
}

export type CreateImageFileProps = {
  originKey: string
  originSize: [number, number]
  initialSize: [number, number]
  file: File
  clientFile: ClientImageFile
}

export type CreateGenericFileProps = {
  originKey: string
  file: File
  clientFile: ClientGenericFile
}
