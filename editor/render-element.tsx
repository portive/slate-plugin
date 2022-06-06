import { RenderElementProps } from "slate-react"
import React from "react"
import {
  AttachmentBlock,
  ImageBlock,
  ImageInline,
  TitledImageBlock,
} from "~/src"

export function renderElement(props: RenderElementProps) {
  const element = props.element
  switch (element.type) {
    case "attachment-block":
      return <AttachmentBlock {...props} element={element} />
    case "image-block":
      return <ImageBlock {...props} element={element} />
    case "titled-image-block":
      return <TitledImageBlock {...props} element={element} />
    case "image-inline":
      return <ImageInline {...props} element={element} />
    case "paragraph":
      return <p {...props.attributes}>{props.children}</p>
    default:
      throw new Error("Unexpected type")
  }
}
