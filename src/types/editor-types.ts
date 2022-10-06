import { BaseEditor, Descendant } from "slate"
import { ReactEditor } from "slate-react"
import { HistoryEditor } from "slate-history"
import { createUploadStore } from "../editor/upload-store"
import { Upload } from "./upload-types"
import { Client } from "@portive/client"

/**
 * `OnUpload` related types
 */

export type OnUploadImageEvent = {
  type: "image"
  id: string
  initialWidth: number
  initialHeight: number
  maxWidth: number
  maxHeight: number
  file: File
}

export type OnUploadGenericEvent = {
  type: "generic"
  id: string
  file: File
}

export type OnUploadEvent = OnUploadImageEvent | OnUploadGenericEvent

export type OnUpload = (e: OnUploadEvent) => void

/**
 * The Options object passed into `@portive/client`
 */

type PortiveClientOptions = ConstructorParameters<typeof Client>[0]

export type WithCloudEditorOptions = {
  apiOriginUrl?: string
  apiKey?: PortiveClientOptions["apiKey"]
  authToken?: PortiveClientOptions["authToken"]
  initialMaxSize?: { width: number; height: number }
  minResizeWidth?: number
  maxResizeWidth?: number
  initialOrigins?: Record<string, Upload>
  onUpload?: OnUpload
}

/**
 * Save
 */
export type SaveOptions = { maxTimeoutInMs?: number }
export type SaveResult =
  | { status: "timeout"; value: Descendant[]; finishes: Promise<Upload>[] }
  | { status: "complete"; value: Descendant[] }

export type EditorCloudObject = {
  client: Client
  initialMaxSize: { width: number; height: number }
  minResizeWidth: number
  maxResizeWidth: number
  useStore: ReturnType<typeof createUploadStore>
  uploadFile: (file: File) => void
  handlePaste: (e: React.ClipboardEvent) => boolean
  handleDrop: (e: React.DragEvent) => boolean
  handleInputFileChange: (e: React.ChangeEvent<HTMLInputElement>) => boolean
  save: (options?: SaveOptions) => Promise<SaveResult>
  normalize: () => Descendant[]
  onUpload: (e: OnUploadEvent) => void
}

export type CloudEditor = {
  cloud: EditorCloudObject
}

export type FullCloudEditor = BaseEditor &
  ReactEditor &
  HistoryEditor &
  CloudEditor
