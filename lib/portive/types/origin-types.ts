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
  finishPromise: Promise<Origin>
}

export type OriginComplete = {
  url: string
  status: "complete"
}

export type OriginError = {
  url: string
  status: "error"
  message: string
}

export type Origin = OriginUploading | OriginComplete | OriginError

export type GetOrigin = (originKey: string) => Origin
export type SetOrigin = (originKey: string, origin: Origin) => void

export type OriginState = {
  origins: Record<string, Origin>
  getOrigin: GetOrigin
  setOrigin: SetOrigin
}
