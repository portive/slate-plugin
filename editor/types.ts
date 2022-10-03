import { BaseEditor, BaseText } from "slate"
import { ReactEditor } from "slate-react"
import {
  TitledImageBlockElement,
  ImageInlineElement,
  ImageBlockElement,
  AttachmentBlockElement,
  CloudEditor,
} from "~/src"
import { HistoryEditor } from "slate-history"

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
    Editor: BaseEditor & ReactEditor & HistoryEditor & CloudEditor
    Element: CustomElement
    Text: CustomText
  }
}
