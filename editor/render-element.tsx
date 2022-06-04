import { RenderElementProps } from "slate-react"
import React from "react"
import { AttachmentBlock } from "~/lib/portive/element-presets/attachment-block"
import { ImageBlock } from "~/lib/portive/element-presets/image-block"
import { ImageInline } from "~/lib/portive/element-presets/image-inline"

export function renderElement(props: RenderElementProps) {
  const element = props.element
  switch (element.type) {
    case "attachment-block":
      return <AttachmentBlock {...props} element={element} />
    case "image-block":
      return <ImageBlock {...props} element={element} />
    case "image-inline":
      return <ImageInline {...props} element={element} />
    case "paragraph":
      return <p {...props.attributes}>{props.children}</p>
    default:
      throw new Error("Unexpected type")
  }
}
