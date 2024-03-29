import React, { useCallback, useState } from "react"
import { ReactEditor, useSlateStatic } from "slate-react"
import { ImageFileInterface } from "../types"
import { Element, Transforms } from "slate"
import { useHostedImageContext } from "./hosted-image-context"
import { resizeInWidth } from "@portive/client"

export function ResizeControls({ element }: { element: ImageFileInterface }) {
  const { size, setSize } = useHostedImageContext()
  const editor = useSlateStatic()
  const [isResizing, setIsResizing] = useState(false)

  if (element.width < editor.cloud.minResizeWidth) return null

  let currentSize = size

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsResizing(true)
      const startX = e.clientX
      const startWidth = size.width
      const minWidth = editor.cloud.minResizeWidth
      const maxWidth = Math.min(element.maxWidth, editor.cloud.maxResizeWidth)
      /**
       * Handle resize dragging through an event handler on mouseMove on the
       * document.
       */
      function onDocumentMouseMove(e: MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        /**
         * Calculate the proposed width based on drag position
         */
        const proposedWidth = startWidth + e.clientX - startX

        /**
         * Constrain the proposed with between min, max and original width
         */
        const nextWidth = Math.min(maxWidth, Math.max(minWidth, proposedWidth))

        currentSize = resizeInWidth(
          { width: element.maxWidth, height: element.maxHeight },
          nextWidth
        )

        setSize(currentSize)
      }

      const originalCursor = document.body.style.cursor

      /**
       * When the user releases the mouse, remove all the event handlers
       */
      function onDocumentMouseUp() {
        setIsResizing(false)
        document.removeEventListener("mousemove", onDocumentMouseMove)
        document.removeEventListener("mouseup", onDocumentMouseUp)
        // setMode({ type: "ready" })
        document.body.style.cursor = originalCursor

        const at = ReactEditor.findPath(editor, element as Element)

        Transforms.setNodes(
          editor,
          { width: currentSize.width, height: currentSize.height },
          { at }
        )
      }

      /**
       * Attach document event listeners
       */
      document.addEventListener("mousemove", onDocumentMouseMove)
      document.addEventListener("mouseup", onDocumentMouseUp)

      /**
       * While dragging, we want the cursor to be `ew-resize` (left-right arrow)
       * even if the cursor happens to not be exactly on the handle at the moment
       * due to a delay in the cursor moving to a location and the image resizing
       * to it.
       *
       * Also, image has max width/height and the cursor can fall outside of it.
       */
      document.body.style.cursor = "ew-resize"
    },
    [editor, size.width, size.height]
  )
  return (
    <>
      {isResizing ? <ResizeLabel size={size} /> : null}
      <ResizeHandles onMouseDown={onMouseDown} />
    </>
  )
}

/**
 * The resize label that shows the width/height of the image
 */
function ResizeLabel({ size }: { size: { width: number; height: number } }) {
  const isBelow = size.width < 100 || size.height < 100
  const bottom = isBelow ? -24 : 4
  return (
    <div
      style={{
        position: "absolute",
        bottom,
        left: 4,
        font: "10px/20px sans-serif",
        color: "white",
        background: "#404040",
        minWidth: 50,
        padding: "0 7px",
        borderRadius: 3,
        textAlign: "center",
        boxShadow: "0px 0px 2px 1px rgba(255, 255, 255, 0.5)",
        zIndex: 100,
        transition: "bottom 250ms",
      }}
    >
      {size.width} &times; {size.height}
    </div>
  )
}

/**
 * The handle used to drag resize an image
 */
function ResizeHandles({
  onMouseDown,
}: {
  onMouseDown: React.MouseEventHandler
}) {
  return (
    <>
      {/* Invisible Handle */}
      <div
        onMouseDown={onMouseDown}
        style={{
          position: "absolute",
          cursor: "ew-resize",
          width: 16,
          right: -8,
          top: 0,
          bottom: 0,
          background: "rgba(127,127,127,0.01)",
        }}
      >
        {/* Visible Handle */}
        <div
          style={{
            position: "absolute",
            width: 16,
            height: 32,
            background: "DodgerBlue",
            borderRadius: 4,
            left: 0,
            top: "50%",
            marginTop: -16,
          }}
        >
          <div style={{ ...barStyle, left: 3.5 }} />
          <div style={{ ...barStyle, left: 7.5 }} />
          <div style={{ ...barStyle, left: 11.5 }} />
        </div>
      </div>
    </>
  )
}

/**
 * The little divets on the resize handle bar.
 */
const barStyle = {
  position: "absolute",
  top: 8,
  width: 1,
  height: 16,
  background: "rgba(255,255,255,0.75)",
} as const
