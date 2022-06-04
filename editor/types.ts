import { BaseEditor } from "slate"
import { ReactEditor } from "slate-react"
import { PortiveEditor } from "~/lib/portive"
import { HistoryEditor } from "slate-history"
import { AttachmentBlockElement } from "~/lib/portive/element-presets/attachment-block"

type CustomText = { text: string }

type ParagraphElement = {
  type: "paragraph"
  children: (CustomText | InlineImageElement)[]
}

type BlockQuoteElement = {
  type: "block-quote"
  children: Array<
    | ParagraphElement
    | BlockQuoteElement
    | MinOriginElement
    | BlockImageElement
    | InlineImageElement
    | AttachmentBlockElement
  >
}

type MinOriginElement = {
  type: "min-origin"
  originKey: string
  children: [{ text: "" }]
}

type BlockImageElement = {
  type: "image-block"
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
  type: "image-inline"
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
  | BlockQuoteElement
  | MinOriginElement
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
