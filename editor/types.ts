import { BaseEditor, BaseText } from "slate"
import { ReactEditor } from "slate-react"
import { PortiveEditor } from "~/src"
import { HistoryEditor } from "slate-history"
import { AttachmentBlockElement } from "~/src/element-presets/attachment-block"
import { ImageBlockElement } from "~/src/element-presets/image-block"
import { ImageInlineElement } from "~/src/element-presets/image-inline"
import { TitledImageBlockElement } from "~/src/element-presets/titled-image-block"

type CustomText = BaseText

type ParagraphElement = {
  type: "paragraph"
  children: (CustomText | ImageInlineElement)[]
}

type BlockQuoteElement = {
  type: "block-quote"
  children: Array<CustomElement>
}

type MinOriginElement = {
  type: "min-origin"
  originKey: string
  children: [{ text: "" }]
}

export type CustomElement =
  | ParagraphElement
  | BlockQuoteElement
  | MinOriginElement
  | AttachmentBlockElement
  | ImageBlockElement
  | TitledImageBlockElement
  | ImageInlineElement

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor & PortiveEditor
    Element: CustomElement
    Text: CustomText
  }
}
