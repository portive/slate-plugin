import EventEmitter from "eventemitter3"

/**
 * `Origin`
 */

export type OriginEventTypes =
  | "progress" // event to update the progress of an Origin that is `uploading`
  | "complete" // event when an `Origin` status changes to `complete`
  | "error" // event when an `Origin` status changes to `error`

/**
 * Indicates an `Origin` that is uploading and the state of the Upload
 */
export type OriginUploading = {
  url: string
  status: "uploading"
  sentBytes: number
  totalBytes: number
  eventEmitter: EventEmitter<OriginEventTypes>
  finishPromise: Promise<Origin>
}

/**
 * Indicates an `Origin` that has completed uploading
 */
export type OriginComplete = {
  url: string
  status: "complete"
}

/**
 * Indicates an `Origin` that has an error during uploading and the Error
 * message
 */
export type OriginError = {
  url: string
  status: "error"
  message: string
}

export type Origin = OriginUploading | OriginComplete | OriginError

/**
 * `OriginState`
 *
 * Types related to the `zustand` state-management library which we use to
 * store the state of uploads.
 */

export type GetOrigin = (originKey: string) => Origin
export type SetOrigin = (originKey: string, origin: Origin) => void

export type OriginState = {
  origins: Record<string, Origin>
  getOrigin: GetOrigin
  setOrigin: SetOrigin
}
