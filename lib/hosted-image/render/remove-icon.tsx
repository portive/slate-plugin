import { useCallback } from "react"
import { ReactEditor, useSlateStatic } from "slate-react"
import { HostedImageElement } from "../types"
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

export function RemoveIcon({ element }: { element: HostedImageElement }) {
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
