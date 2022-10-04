import { useCallback } from "react"
import { ReactEditor, useSlateStatic } from "slate-react"
import { ImageFileInterface } from "../types"
import { Element, Transforms } from "slate"
import { CircleX } from "../icons/circle-x-icon"

export function RemoveIcon({ element }: { element: ImageFileInterface }) {
  const editor = useSlateStatic()
  const onMouseDown = useCallback(() => {
    const at = ReactEditor.findPath(editor, element as Element)
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
