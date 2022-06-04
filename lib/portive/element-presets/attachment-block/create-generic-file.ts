import { CreateGenericFileProps } from "~/lib/portive"
import { AttachmentBlockElement } from "./types"

export function createGenericFile(
  e: CreateGenericFileProps
): AttachmentBlockElement {
  return {
    originKey: e.originKey,
    type: "attachment-block",
    filename: e.file.name,
    bytes: e.file.size,
    children: [{ text: "" }],
  }
}
