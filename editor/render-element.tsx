import { RenderElementProps } from "slate-react"
import React from "react"
import { TitledImageBlock } from "~/src/components/titled-image-block"
import { ImageBlock } from "~/src/components/image-block"
import { ImageInline } from "~/src/components/image-inline"
import { AttachmentBlock } from "~/src/components/attachment-block"

export const renderElement = AttachmentBlock.withRenderElement(
  ImageInline.withRenderElement(
    TitledImageBlock.withRenderElement(
      ImageBlock.withRenderElement((props: RenderElementProps) => {
        const element = props.element
        switch (element.type) {
          case "paragraph":
            return <p {...props.attributes}>{props.children}</p>
          default:
            throw new Error(`Unexpected type ${element.type}`)
        }
      })
    )
  )
)
