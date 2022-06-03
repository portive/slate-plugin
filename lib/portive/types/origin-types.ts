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
