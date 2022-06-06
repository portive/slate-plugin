import { RenderElementProps } from "slate-react"
import React from "react"
import { AttachmentBlock } from "~/src/element-presets/attachment-block"
import { ImageBlock } from "~/src/element-presets/image-block"
import { TitledImageBlock } from "~/src/element-presets/titled-image-block"
import { ImageInline } from "~/src/element-presets/image-inline"

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
