import { BaseEditor, Descendant, Element, Location } from "slate"
import { ReactEditor } from "slate-react"
import { HistoryEditor } from "slate-history"
import { createOriginStore } from "../origin-store"
import { Origin } from "./origin-types"
import { Client } from "@portive/client"

export type CreateImageFileElementEvent = {
  type: "image"
  originKey: string
  originSize: [number, number]
  initialSize: [number, number]
  file: File
}

export type CreateGenericFileElementEvent = {
  type: "generic"
  originKey: string
  file: File
}

export type CreateFileElementEvent =
  | CreateImageFileElementEvent
  | CreateGenericFileElementEvent

export type CreateFileElement = (
  e: CreateFileElementEvent
) => Element & { originKey: string }

export type CreateImageFileElement = (
  e: CreateImageFileElementEvent
) => Element & { originKey: string }

/**
 * The Options object passed into `@portive/client`
 */
type PortiveClientOptions = ConstructorParameters<typeof Client>[0]

export type WithPortiveOptions = {
  apiOriginUrl?: string
  apiKey?: PortiveClientOptions["apiKey"]
  authToken?: PortiveClientOptions["authToken"]
  initialMaxSize?: [number, number]
  minResizeWidth?: number
  maxResizeWidth?: number
  initialOrigins?: Record<string, Origin>
  createImageFileElement?: CreateImageFileElement
  createFileElement: CreateFileElement
}

/**
 * Upload File Options
 */
export type UploadFileOptions = { at?: Location }

/**
 * Save
 */
export type SaveOptions = { maxTimeoutInMs?: number }
export type SaveResult =
  | { status: "timeout"; value: Descendant[]; finishes: Promise<Origin>[] }
  | { status: "complete"; value: Descendant[] }

export type PortiveObject = {
  client: Client
  initialMaxSize: [number, number]
  minResizeWidth: number
  maxResizeWidth: number
  useStore: ReturnType<typeof createOriginStore>
  uploadFile: (file: File, options?: UploadFileOptions) => string
  createImageFileElement?: CreateImageFileElement
  createFileElement: CreateFileElement
  handlePaste: (e: React.ClipboardEvent) => boolean
  handleDrop: (e: React.DragEvent) => boolean
  handleInputFileChange: (e: React.ChangeEvent<HTMLInputElement>) => boolean
  save: (options?: SaveOptions) => Promise<SaveResult>
  normalize: () => Descendant[]
}

export type PortiveEditor = {
  portive: PortiveObject
}

export type FullPortiveEditor = BaseEditor &
  ReactEditor &
  HistoryEditor &
  PortiveEditor
