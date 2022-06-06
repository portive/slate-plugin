import { AssertType } from "@thesunny/assert-type"
import { AttachmentBlockElement } from "./types"

export { AttachmentBlock } from "./render-attachment-block"
export type { AttachmentBlockElement } from "./types"
export { createAttachmentBlock } from "./create-attachment-block"

export const ATTACHMENT_BLOCK_TYPE = "attachment-block"

AssertType.Equal<typeof ATTACHMENT_BLOCK_TYPE, AttachmentBlockElement["type"]>(
  true
)
