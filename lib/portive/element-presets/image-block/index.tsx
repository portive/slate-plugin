import { RenderElementPropsFor } from "~/lib/portive/types/type-utils"
import { HostedImage } from "~/lib/portive"
import { AssertType } from "@thesunny/assert-type"
import { CreateImageFileElementProps, ImageFileInterface } from "../../types"

export const ELEMENT_TYPE = "image-block"

export type ImageBlockElement = {
  type: "image-block"
  /**
   * Must include originKey and originSize
   */
  originKey: string
  originSize: [number, number]
  /**
   * Must include `size` (consider switching to `mods.size`)
   */
  size: [number, number]
  children: [{ text: "" }]
}

AssertType.Equal<typeof ELEMENT_TYPE, ImageBlockElement["type"]>(true)
AssertType.Extends<ImageBlockElement, ImageFileInterface>(true)

export function ImageBlock({
  attributes,
  element,
  children,
}: RenderElementPropsFor<ImageBlockElement>) {
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

export function createImageBlock(
  e: CreateImageFileElementProps
): ImageBlockElement {
  return {
    type: "image-block",
    originKey: e.originKey,
    originSize: e.originSize,
    size: e.initialSize,
    children: [{ text: "" }],
  }
}
