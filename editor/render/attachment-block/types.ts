import { HostedFileInterface } from "~/lib/hosted-image"

export type AttachmentBlockElement = {
  type: "block-file"
  filename: string
  bytes: number
} & HostedFileInterface
