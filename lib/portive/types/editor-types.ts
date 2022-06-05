import { BaseEditor, Descendant, Element, Location } from "slate"
import { ReactEditor } from "slate-react"
import { HistoryEditor } from "slate-history"
import { Promisable } from "type-fest"
import { createOriginStore } from "../origin-store"
import { Origin } from "./origin-types"

export type SaveResult =
  | { status: "timeout"; value: Descendant[]; finishes: Promise<Origin>[] }
  | { status: "complete"; value: Descendant[] }

export type CreateImageFileElementProps = {
  type: "image"
  originKey: string
  originSize: [number, number]
  initialSize: [number, number]
  file: File
}

export type CreateGenericFileElementProps = {
  type: "generic"
  originKey: string
  file: File
}

export type CreateElementProps =
  | CreateImageFileElementProps
  | CreateGenericFileElementProps

export type HostedImageOptions = {
  authToken: string | (() => Promisable<string>)
  path: string
  initialMaxSize: [number, number]
  minResizeWidth?: number
  maxResizeWidth?: number
  initialOrigins: Record<string, Origin>
  createElement: (e: CreateElementProps) => Element & { originKey: string }
}

export type UploadFileOptions = { at?: Location }

export type PortiveObject = {
  authToken: string | (() => Promisable<string>)
  path: string
  initialMaxSize: [number, number]
  minResizeWidth: number
  maxResizeWidth: number
  useStore: ReturnType<typeof createOriginStore>
  uploadFile: (file: File, options?: UploadFileOptions) => string
  createElement: (e: CreateElementProps) => Element & { originKey: string }
  handlePaste: (e: React.ClipboardEvent) => boolean
  handleDrop: (e: React.DragEvent) => boolean
  handleInputFileChange: (e: React.ChangeEvent<HTMLInputElement>) => boolean
  save: (timeoutInMs: number) => Promise<SaveResult>
  normalize: () => Descendant[]
}

export type PortiveEditor = {
  portive: PortiveObject
}

export type FullPortiveEditor = BaseEditor &
  ReactEditor &
  HistoryEditor &
  PortiveEditor
