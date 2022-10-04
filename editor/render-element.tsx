import { RenderElementProps } from "slate-react"
import React from "react"
import { ImageInline, TitledImageBlock } from "~/src"
import { ImageBlock } from "~/src/components/image-block"
import { AttachmentBlock } from "~/src/components/attachment-block"

export const renderElement = AttachmentBlock.withRenderElement(
  ImageBlock.withRenderElement((props: RenderElementProps) => {
    const element = props.element
    switch (element.type) {
      case "titled-image-block":
        return <TitledImageBlock {...props} element={element} />
      case "image-inline":
        return <ImageInline {...props} element={element} />
      case "paragraph":
        return <p {...props.attributes}>{props.children}</p>
      default:
        throw new Error("Unexpected type")
    }
  })
)
