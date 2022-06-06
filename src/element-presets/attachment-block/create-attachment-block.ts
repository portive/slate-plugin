import { CreateFileElementEvent } from "../../../src"
import { AttachmentBlockElement } from "./types"

export function createAttachmentBlock(
  e: CreateFileElementEvent
): AttachmentBlockElement {
  return {
    originKey: e.originKey,
    type: "attachment-block",
    filename: e.file.name,
    bytes: e.file.size,
    children: [{ text: "" }],
  }
}
