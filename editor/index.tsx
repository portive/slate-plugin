import { createEditor, Descendant, Editor } from "slate"
import { FileOrigin } from "~/lib/hosted-image"
import { Slate, Editable, withReact } from "slate-react"
import React, { useState } from "react"
import { withPortive } from "~/lib/hosted-image"
import { withHistory } from "slate-history"
import { renderElement } from "./render"
import "./types"

export function MyEditor({
  authToken,
  initialValue,
  initialOrigins = {},
  isReadOnly,
}: {
  authToken: string
  initialValue: Descendant[]
  initialOrigins: Record<string, FileOrigin>
  isReadOnly: boolean
}) {
  const [editor] = useState<Editor>(() => {
    const reactEditor = withReact(withHistory(createEditor()))
    const editor = withPortive(
      {
        authToken,
        path: "demo",
        defaultResize: { type: "inside", width: 320, height: 320 },
        minResizeWidth: 100,
        maxResizeWidth: 640,
        initialOrigins: initialOrigins,
        createImageFile(e) {
          return {
            type: "block-image",
            id: e.id,
            size: e.clientFile.size,
            children: [{ text: "" }],
          }
        },
        createGenericFile(e) {
          return {
            id: e.id,
            type: "block-file",
            filename: e.clientFile.filename,
            bytes: e.clientFile.bytes,
            children: [{ text: "" }],
          }
        },
      },
      reactEditor
    )
    editor.isVoid = (element) => {
      return ["block-file", "block-image", "inline-image"].includes(
        element.type
      )
    }
    editor.isInline = (element) => {
      return element.type === "inline-image"
    }
    return editor
  })

  return (
    <>
      <p>
        <input
          type="file"
          onChange={editor.portive.handleChangeInputFile}
          multiple
        />
      </p>
      <Slate editor={editor} value={initialValue}>
        <Editable
          readOnly={isReadOnly}
          renderElement={renderElement}
          onPaste={editor.portive.handlePaste}
          onDrop={editor.portive.handleDrop}
          style={{
            font: "16px sans-serif",
            border: "1px solid #c0c0c0",
            borderRadius: 8,
            padding: "0 16px",
            width: 800,
          }}
        />
      </Slate>
    </>
  )
}
