import { BaseEditor, Descendant, Element } from "slate"
import { ReactEditor } from "slate-react"
import { HistoryEditor } from "slate-history"
import { Promisable } from "type-fest"
import { createOriginStore } from "../origin-store"
import { ClientGenericFile, ClientImageFile } from "@portive/api-types"
import { Origin } from "./origin-types"

export type SaveResult =
  | { status: "timeout"; value: Descendant[]; finishes: Promise<Origin>[] }
  | { status: "complete"; value: Descendant[] }

export type CreateImageFileProps = {
  originKey: string
  originSize: [number, number]
  initialSize: [number, number]
  file: File
}

export type CreateGenericFileProps = {
  originKey: string
  file: File
}

export type HostedImageOptions = {
  authToken: string | (() => Promisable<string>)
  path: string
  initialMaxSize: [number, number]
  minResizeWidth?: number
  maxResizeWidth?: number
  initialOrigins: Record<string, Origin>
  createImageFile: (e: CreateImageFileProps) => Element & { originKey: string }
  createGenericFile: (
    e: CreateGenericFileProps
  ) => Element & { originKey: string }
}

export type PortiveObject = {
  authToken: string | (() => Promisable<string>)
  path: string
  initialMaxSize: [number, number]
  minResizeWidth: number
  maxResizeWidth: number
  useStore: ReturnType<typeof createOriginStore>
  uploadFile: (file: File) => string
  createImageFile: (e: CreateImageFileProps) => Element & { originKey: string }
  createGenericFile: (
    e: CreateGenericFileProps
  ) => Element & { originKey: string }
  handlePaste: (e: React.ClipboardEvent) => boolean
  handleDrop: (e: React.DragEvent) => boolean
  handleChangeInputFile: (e: React.ChangeEvent<HTMLInputElement>) => boolean
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
