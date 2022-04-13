import { MouseEventHandler, useCallback, useState } from "react"
import {
  ReactEditor,
  useFocused,
  useSelected,
  useSlateStatic,
} from "slate-react"
import { Entity, HostedImageElement } from "../types"
import { SVGProps } from "react"
import { Transforms } from "slate"

const CircleX = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={192}
    height={192}
    viewBox="0 0 256 256"
    {...props}
    style={{ filter: "drop-shadow(0 0 2px rgb(0 0 0 / 1))" }}
  >
    <path fill="none" d="M0 0h256v256H0z" />
    <path
      fill="currentColor"
      d="M128 24a104 104 0 1 0 104 104A104.2 104.2 0 0 0 128 24Zm37.7 130.3a8.1 8.1 0 0 1 0 11.4 8.2 8.2 0 0 1-11.4 0L128 139.3l-26.3 26.4a8.2 8.2 0 0 1-11.4 0 8.1 8.1 0 0 1 0-11.4l26.4-26.3-26.4-26.3a8.1 8.1 0 0 1 11.4-11.4l26.3 26.4 26.3-26.4a8.1 8.1 0 0 1 11.4 11.4L139.3 128Z"
    />
  </svg>
)

export function ImageControls({
  element,
  children: image,
}: {
  element: HostedImageElement
  children: React.ReactNode
}) {
  const editor = useSlateStatic()
  const entity = editor.useStore((state) => state.entities[element.id])

  const isFocused = useFocused()
  const isSelected = useSelected()
  const isActive = isFocused && isSelected
  const [isHover, setIsHover] = useState(false)
  const onMouseEnter = useCallback(() => {
    setIsHover(true)
  }, [editor])
  const onMouseLeave = useCallback(() => {
    setIsHover(false)
  }, [editor])

  return (
    <span
      draggable={true}
      contentEditable={false}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "relative",
        display: "inline-block",
        /**
         * This is required so that we don't get an extra gap at the bottom.
         * When display is 'inline-block' we get some extra space at the bottom
         * for the descenders because the content is expected to co-exist with text.
         *
         * Setting vertical-align to top, bottom or middle fixes this because it is
         * no longer baseline which causes the issue.
         *
         * This is usually an issue with 'img' but also affects this scenario.
         *
         * https://stackoverflow.com/questions/5804256/image-inside-div-has-extra-space-below-the-image
         */
        verticalAlign: "top",
        /**
         * Disable user select. We use our own selection display.
         */
        userSelect: "none",
      }}
    >
      {image}
      <ProgressBar entity={entity} />
      <RenderError entity={entity} />
      {isHover || isActive || entity.type === "error" ? (
        <RemoveImage element={element} entity={entity} />
      ) : null}
      {/* Resize Handler */}
      <div
        style={{
          position: "absolute",
          width: 16,
          right: -8,
          top: 0,
          bottom: 0,
          background: "rgba(127,127,127,0.01)",
          cursor: "ew-resize",
        }}
      ></div>
    </span>
  )
}

function RemoveImage({
  entity,
  element,
}: {
  entity: Entity
  element: HostedImageElement
}) {
  const editor = useSlateStatic()
  const onMouseDown = useCallback(() => {
    const at = ReactEditor.findPath(editor, element)
    Transforms.removeNodes(editor, { at })
  }, [editor])
  return (
    <div
      draggable={false}
      onMouseDown={onMouseDown}
      style={{
        position: "absolute",
        width: 24,
        height: 24,
        top: 4,
        right: 4,
        color: "#cc0000",
        cursor: "pointer",
      }}
    >
      <CircleX width={24} height={24} />
    </div>
  )
}

function RenderError({ entity }: { entity: Entity }) {
  if (entity.type !== "error") return null
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        height: 24,
        marginTop: -6,
        padding: "0 1em",
        left: "1em",
        right: "1em",
        color: "white",
        background: "red",
        boxShadow: "0 0 3px 0px rgba(0,0,0,1)",
        textAlign: "center",
        font: "16px/24px sans-serif",
        borderRadius: 12,
      }}
    >
      ⚠️ Upload Failed
    </div>
  )
}

function ProgressBar({ entity }: { entity: Entity }) {
  if (entity.type !== "loading") {
    return null
  }
  const percent = (entity.sentBytes * 100) / entity.totalBytes
  return (
    <div
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
  )
}
