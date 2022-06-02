import { HostedFileInterface } from "~/lib/hosted-image"

export type AttachmentBlockElement = {
  type: "attachment-block"
  filename: string
  bytes: number
} & HostedFileInterface
