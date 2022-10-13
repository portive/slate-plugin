import { BaseEditor, BaseText } from "slate"
import { ReactEditor } from "slate-react"
import { CloudEditor } from "../src"
import { ImageBlockElementType } from "../src/components/image-block"
import { AttachmentBlockElementType } from "../src/components/attachment-block"
import { ImageInlineElementType } from "../src/components/image-inline"
import { TitledImageBlockElementType } from "../src/components/titled-image-block"
import { HistoryEditor } from "slate-history"

type CustomText = BaseText

type ParagraphElement = {
  type: "paragraph"
  children: (CustomText | ImageInlineElementType)[]
}

type BlockQuoteElement = {
  type: "block-quote"
  children: Array<CustomElement>
}

type MinOriginElement = {
  type: "min-origin"
  id: string
  children: [{ text: "" }]
}

export type CustomElement =
  | ParagraphElement
  | BlockQuoteElement
  | MinOriginElement
  | AttachmentBlockElementType
  | ImageBlockElementType
  | ImageInlineElementType
  | TitledImageBlockElementType
// | ImageInlineElement

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor & CloudEditor
    Element: CustomElement
    Text: CustomText
  }
}
