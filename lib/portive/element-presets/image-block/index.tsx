import { DiscriminatedRenderElementProps } from "~/lib/portive/types/type-utils"
import { HostedImage } from "~/lib/portive"

export function ImageBlock({
  attributes,
  element,
  children,
}: DiscriminatedRenderElementProps<"image-block">) {
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
