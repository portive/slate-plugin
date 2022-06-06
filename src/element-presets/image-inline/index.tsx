import { DiscriminatedRenderElementProps } from "~/src/types/type-utils"
import { AssertType } from "@thesunny/assert-type"
import { HostedImage } from "~/src"
import { ImageFileInterface } from "../../types"

export const ELEMENT_TYPE = "image-inline"

export type ImageInlineElement = {
  type: "image-inline"
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

AssertType.Equal<typeof ELEMENT_TYPE, ImageInlineElement["type"]>(true)
AssertType.Extends<ImageInlineElement, ImageFileInterface>(true)

export function ImageInline({
  attributes,
  element,
  children,
}: DiscriminatedRenderElementProps<"image-inline">) {
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
