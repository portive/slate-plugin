import { BaseEditor, BaseText } from "slate"
import { ReactEditor } from "slate-react"
import { PortiveEditor } from "~/lib/portive"
import { HistoryEditor } from "slate-history"
import { AttachmentBlockElement } from "~/lib/portive/element-presets/attachment-block"
import { ImageBlockElement } from "~/lib/portive/element-presets/image-block"
import { ImageInlineElement } from "~/lib/portive/element-presets/image-inline"
import { TitledImageBlockElement } from "~/lib/portive/element-presets/titled-image-block"

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
