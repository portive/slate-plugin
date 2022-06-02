import { CreateGenericFileProps } from "~/lib/hosted-image"
import { AttachmentBlockElement } from "./types"

export function createGenericFile(
  e: CreateGenericFileProps
): AttachmentBlockElement {
  return {
    id: e.id,
    type: "block-file",
    filename: e.clientFile.filename,
    bytes: e.clientFile.bytes,
    children: [{ text: "" }],
  }
}
