import { RenderElementProps } from "slate-react"
import React from "react"
import { HostedImage } from "~/lib/portive"
import { DiscriminatedRenderElementProps } from "~/lib/portive/type-utils"
import { AttachmentBlock } from "./attachment-block"

export function renderElement(props: RenderElementProps) {
  const element = props.element
  switch (element.type) {
    case "attachment-block":
      return <AttachmentBlock {...props} element={element} />
    case "block-image":
      return <BlockImage {...props} element={element} />
    case "inline-image":
      return <InlineImage {...props} element={element} />
    case "paragraph":
      return <p {...props.attributes}>{props.children}</p>
    default:
      throw new Error("Unexpected type")
  }
}

export function BlockImage({
  attributes,
  element,
  children,
}: DiscriminatedRenderElementProps<"block-image">) {
  return (
    <div {...attributes} style={{ margin: "8px 0" }}>
      <HostedImage
        element={element}
        style={{ borderRadius: element.size[0] < 100 ? 0 : 4 }}
      />
      {children}
    </div>
  )
}

export function InlineImage({
  attributes,
  element,
  children,
}: DiscriminatedRenderElementProps<"inline-image">) {
  return (
    <span {...attributes}>
      <HostedImage
        element={element}
        style={{ borderRadius: element.size[0] < 100 ? 0 : 4 }}
      />
      {children}
    </span>
  )
}
