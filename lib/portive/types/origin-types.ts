import EventEmitter from "eventemitter3"

/**
 * Origin
 */

export type OriginEventTypes = "progress" | "complete" | "error"

export type OriginUploading = {
  url: string
  status: "uploading"
  sentBytes: number
  totalBytes: number
  eventEmitter: EventEmitter<OriginEventTypes>
  finish: Promise<Origin>
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

export type GetOrigin = (originKey: string) => Origin
export type SetOrigin = (originKey: string, origin: Origin) => void

export type OriginState = {
  origins: Record<string, Origin>
  getOrigin: GetOrigin
  setOrigin: SetOrigin
}