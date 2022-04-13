import { DiscriminatedRenderElementProps, HostedImageElement } from "../types"
import { useSlateStatic, useSelected, useFocused } from "slate-react"
import { Entity } from "../types"
import { ImageControls } from "./image-controls"
import { CSSProperties, useEffect, useState } from "react"

export function RenderHostedImage({
  attributes,
  element,
  children,
}: DiscriminatedRenderElementProps<"hosted-image">) {
  return (
    <div {...attributes} style={{ margin: "8px 0" }}>
      <RenderImage
        element={element}
        style={{ borderRadius: element.size[0] < 100 ? 0 : 4 }}
      />
      {children}
    </div>
  )
}

function useHighlightedStyle() {
  const selected = useSelected()
  const focused = useFocused()
  const highlighted = selected && focused
  const boxShadow = highlighted ? "0 0 0 3px DodgerBlue" : "none"
  return { boxShadow }
}

function RenderImage({
  element,
  className,
  style,
}: {
  element: HostedImageElement
  className?: string
  style?: CSSProperties
}) {
  const editor = useSlateStatic()
  const entity = editor.useStore((state) => state.entities[element.id])
  const [size, setSize] = useState(element.size)
  useEffect(() => {
    setSize(element.size)
  }, [element.size[0], element.size[1]])
  const highlightedStyle = useHighlightedStyle()
  return (
    <ImageControls element={element} size={size} setSize={setSize}>
      <img
        src={entity.url}
        width={size[0]}
        height={size[1]}
        className={className}
        style={{ ...highlightedStyle, ...style }}
      />
    </ImageControls>
  )
}
