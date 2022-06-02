import { BaseEditor } from "slate"
import { ReactEditor } from "slate-react"
import { PortiveEditor } from "~/lib/portive"
import { HistoryEditor } from "slate-history"
import { AttachmentBlockElement } from "~/editor/render/attachment-block"

type CustomText = { text: string }
type ParagraphElement = {
  type: "paragraph"
  children: (CustomText | InlineImageElement)[]
}
type BlockImageElement = {
  type: "block-image"
  /**
   * Must include originKey and originSize
   */
  originKey: string
  originSize: [number, number]
  /**
   * Must include `size` (consider switching to `mods.size`)
   */
  size: [number, number]
  children: [{ text: "" }]
}
type InlineImageElement = {
  type: "inline-image"
  /**
   * Must include originKey and originSize
   */
  originKey: string
  originSize: [number, number]
  /**
   * Must include `size` (consider switching to `mods.size`)
   */
  size: [number, number]
  children: [{ text: "" }]
}
export type CustomElement =
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
