import { BaseEditor } from "slate"
import { ReactEditor } from "slate-react"
import { HostedImageInterface, PortiveEditor } from "~/lib/portive"
import { HistoryEditor } from "slate-history"
import { AttachmentBlockElement } from "~/editor/render/attachment-block"

type CustomText = { text: string }
type ParagraphElement = {
  type: "paragraph"
  children: (CustomText | InlineImageElement)[]
}
type BlockImageElement = { type: "block-image" } & HostedImageInterface
type InlineImageElement = { type: "inline-image" } & HostedImageInterface
type CustomElement =
  | ParagraphElement
  | AttachmentBlockElement
  | BlockImageElement
  | InlineImageElement

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor & PortiveEditor
    Element: CustomElement
    Text: CustomText
  }
}
