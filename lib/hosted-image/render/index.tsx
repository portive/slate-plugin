import { Discriminate, DiscriminatedRenderElementProps } from "../types"
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
  switch (entity.type) {
    case "loading":
    case "error":
      return RenderProgressImage({ ...props, entity })
    case "uploaded":
      return RenderFinishedImage({ ...props, entity })
    // case "error":
    //   return RenderErrorImage({ ...props, entity })
  }
}

function useHighlightedStyle() {
  const selected = useSelected()
  const focused = useFocused()
  const highlighted = selected && focused
  const boxShadow = highlighted ? "0 0 0 3px DodgerBlue" : "none"
  return { boxShadow }
}

function RenderErrorImage({
  entity,
  ...props
}: DiscriminatedRenderElementProps<"hosted-image"> & {
  entity: Discriminate<Entity, { type: "error" }>
}) {
  const highlightedStyle = useHighlightedStyle()
  return (
    <div {...props.attributes}>
      <img
        contentEditable={false}
        src={entity.url}
        width={entity.size[0]}
        height={entity.size[1]}
        style={{
          borderRadius: 12,
          ...highlightedStyle,
        }}
      />
      {props.children}
    </div>
  )
}

function RenderFinishedImage({
  entity,
  ...props
}: DiscriminatedRenderElementProps<"hosted-image"> & {
  entity: Discriminate<Entity, { type: "uploaded" }>
}) {
  const highlightedStyle = useHighlightedStyle()
  return (
    <div {...props.attributes}>
      <img
        contentEditable={false}
        src={entity.url}
        width={entity.size[0]}
        height={entity.size[1]}
        style={{
          borderRadius: 12,
          ...highlightedStyle,
        }}
      />
      {props.children}
    </div>
  )
}

function RenderProgressImage({
  entity,
  element,
  attributes,
  children,
}: DiscriminatedRenderElementProps<"hosted-image"> & {
  entity: Discriminate<Entity, { type: "loading" | "error" }>
}) {
  const highlightedStyle = useHighlightedStyle()
  return (
    <div
      {...attributes}
      style={{
        width: entity.viewSize[0],
        height: entity.viewSize[1],
        position: "relative",
        margin: "8px 0",
      }}
    >
      <ImageControls element={element}>
        <img
          src={entity.url}
          width={entity.viewSize[0]}
          height={entity.viewSize[1]}
          style={{ borderRadius: 8, ...highlightedStyle }}
        />
      </ImageControls>
      {children}
    </div>
  )
}
