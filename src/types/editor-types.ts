import { BaseEditor, Descendant, Location } from "slate"
import { ReactEditor } from "slate-react"
import { HistoryEditor } from "slate-history"
import { createOriginStore } from "../origin-store"
import { Origin } from "./origin-types"
import { Client } from "@portive/client"

export type OnUploadImageEvent = {
  type: "image"
  originKey: string
  originSize: [number, number]
  initialSize: [number, number]
  file: File
  at: Location
}

export type OnUploadGenericEvent = {
  type: "generic"
  originKey: string
  file: File
  at: Location
}

export type OnUploadEvent = OnUploadImageEvent | OnUploadGenericEvent

export type CreateFileElementEvent = OnUploadImageEvent | OnUploadGenericEvent

/**
 * The Options object passed into `@portive/client`
 */
type PortiveClientOptions = ConstructorParameters<typeof Client>[0]

export type OnUpload = (e: OnUploadEvent) => void

export type WithCloudEditorOptions = {
  apiOriginUrl?: string
  apiKey?: PortiveClientOptions["apiKey"]
  authToken?: PortiveClientOptions["authToken"]
  initialMaxSize?: [number, number]
  minResizeWidth?: number
  maxResizeWidth?: number
  initialOrigins?: Record<string, Origin>
  onUpload?: OnUpload
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

export type CloudObject = {
  client: Client
  initialMaxSize: [number, number]
  minResizeWidth: number
  maxResizeWidth: number
  useStore: ReturnType<typeof createOriginStore>
  uploadFile: (file: File, options?: UploadFileOptions) => string
  handlePaste: (e: React.ClipboardEvent) => boolean
  handleDrop: (e: React.DragEvent) => boolean
  handleInputFileChange: (e: React.ChangeEvent<HTMLInputElement>) => boolean
  save: (options?: SaveOptions) => Promise<SaveResult>
  normalize: () => Descendant[]
  onUpload: (e: OnUploadEvent) => void
}

export type CloudEditor = {
  cloud: CloudObject
}

export type FullCloudEditor = BaseEditor &
  ReactEditor &
  HistoryEditor &
  CloudEditor
