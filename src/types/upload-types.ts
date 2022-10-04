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
export type UploadProgress = {
  url: string
  status: "uploading"
  sentBytes: number
  totalBytes: number
  eventEmitter: EventEmitter<OriginEventTypes>
  finishPromise: Promise<Upload>
}

/**
 * Indicates an `Origin` that has completed uploading
 */
export type UploadComplete = {
  url: string
  status: "complete"
}

/**
 * Indicates an `Origin` that has an error during uploading and the Error
 * message
 */
export type UploadError = {
  url: string
  status: "error"
  message: string
}

export type Upload = UploadProgress | UploadComplete | UploadError

/**
 * `OriginState`
 *
 * Types related to the `zustand` state-management library which we use to
 * store the state of uploads.
 */

export type GetUpload = (id: string) => Upload
export type SetUpload = (id: string, upload: Upload) => void

export type UploadState = {
  uploads: Record<string, Upload>
  getUpload: GetUpload
  setUpload: SetUpload
}
