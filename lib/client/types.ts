import { ClientFile } from "@portive/api-types"

export type UploadProgressEvent = {
  sentBytes: number
  totalBytes: number
  file: File
  clientFile: ClientFile
}
