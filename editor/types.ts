import { BaseEditor } from "slate"
import { ReactEditor } from "slate-react"
import {
  HostedFileInterface,
  HostedImageInterface,
  PortiveEditor,
} from "~/lib/hosted-image"
import { HistoryEditor } from "slate-history"

type CustomText = { text: string }
type ParagraphElement = {
  type: "paragraph"
  children: (CustomText | InlineImageElement)[]
}
type BlockFileElement = {
  type: "block-file"
  filename: string
  bytes: number
} & HostedFileInterface
type BlockImageElement = { type: "block-image" } & HostedImageInterface
type InlineImageElement = { type: "inline-image" } & HostedImageInterface
type CustomElement =
  | ParagraphElement
  | BlockFileElement
  | BlockImageElement
  | InlineImageElement

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor & PortiveEditor
    Element: CustomElement
    Text: CustomText
  }
}
