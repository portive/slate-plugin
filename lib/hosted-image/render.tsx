import { Discriminate, DiscriminatedRenderElementProps } from "./types"
import { useSlateStatic, useSelected, useFocused } from "slate-react"
import { Entity } from "./use-store"
export * from "./types"
export * from "./use-store"

export function RenderHostedImage(
  props: DiscriminatedRenderElementProps<"hosted-image">
) {
  const editor = useSlateStatic()
  const { element } = props
  const entity = editor.useStore((state) => state.entities[element.id])
  if (entity == null) {
    return <div {...props.attributes}>Entry not found{props.children}</div>
  }
  if (entity.type === "loading") {
    return RenderProgressImage({ ...props, entity })
  } else {
    return RenderFinishedImage({ ...props, entity })
  }
}

function useHighlightedStyle() {
  const selected = useSelected()
  const focused = useFocused()
  const highlighted = selected && focused
  const boxShadow = highlighted ? "0 0 0 3px DodgerBlue" : "none"
  return { boxShadow }
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
  ...props
}: DiscriminatedRenderElementProps<"hosted-image"> & {
  entity: Discriminate<Entity, { type: "loading" }>
}) {
  const percent = `${(entity.sentBytes * 100) / entity.totalBytes}%`
  const highlightedStyle = useHighlightedStyle()
  return (
    <div
      {...props.attributes}
      style={{
        width: entity.viewSize[0],
        height: entity.viewSize[1],
        backgroundImage: `url(${entity.url})`,
        backgroundSize: `${entity.viewSize[0]}px ${entity.viewSize[1]}px`,
        position: "relative",
        borderRadius: 8,
        margin: "8px 0",
        ...highlightedStyle,
      }}
    >
      <div
        contentEditable={false}
        style={{
          position: "absolute",
          top: "50%",
          marginTop: -6,
          left: 16,
          right: 16,
          background: "white",
          borderRadius: 12,
          boxShadow: "0 0 3px 0px rgba(0,0,0,1)",
        }}
      >
        <div
          style={{
            background: "DodgerBlue",
            width: percent,
            transition: "width 0.1s",
            height: 16,
            borderRadius: 12,
          }}
        ></div>
      </div>
      {props.children}
    </div>
  )
}
