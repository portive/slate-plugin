import { HostedFileInterface } from "~/lib/portive"

export type AttachmentBlockElement = {
  type: "attachment-block"
  filename: string
  bytes: number
} & HostedFileInterface
