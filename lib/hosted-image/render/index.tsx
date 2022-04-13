import { DiscriminatedRenderElementProps } from "../types"
import { useSlateStatic, useSelected, useFocused } from "slate-react"
import { Entity } from "../types"
import { ImageControls } from "./image-controls"
export function RenderHostedImage(
  props: DiscriminatedRenderElementProps<"hosted-image">
) {
  const editor = useSlateStatic()
  const { element } = props
  const entity = editor.useStore((state) => state.entities[element.id])
  if (entity == null) {
    return <div {...props.attributes}>Entry not found{props.children}</div>
  }
  return RenderProgressImage({ ...props, entity })
  // switch (entity.type) {
  //   case "loading":
  //   case "error":
  //   case "uploaded":
  //     return RenderFinishedImage({ ...props, entity })
  //   // case "error":
  //   //   return RenderErrorImage({ ...props, entity })
  // }
}

function useHighlightedStyle() {
  const selected = useSelected()
  const focused = useFocused()
  const highlighted = selected && focused
  const boxShadow = highlighted ? "0 0 0 3px DodgerBlue" : "none"
  return { boxShadow }
}

function RenderProgressImage({
  entity,
  element,
  attributes,
  children,
}: DiscriminatedRenderElementProps<"hosted-image"> & {
  entity: Entity //Discriminate<Entity, { type: "loading" | "error" }>
}) {
  const highlightedStyle = useHighlightedStyle()
  return (
    <div
      {...attributes}
      style={{
        width: element.size[0],
        height: element.size[1],
        margin: "8px 0",
      }}
    >
      <ImageControls element={element}>
        <img
          src={entity.url}
          width={element.size[0]}
          height={element.size[1]}
          // style={{ borderRadius: 8, ...highlightedStyle }}
          style={{ ...highlightedStyle }}
        />
      </ImageControls>
      {children}
    </div>
  )
}
