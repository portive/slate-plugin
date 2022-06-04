import { DiscriminatedRenderElementProps } from "~/lib/portive/types/type-utils"
import { HostedImage } from "~/lib/portive"

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
