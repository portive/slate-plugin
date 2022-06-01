import { createEditor, Descendant, Editor } from "slate"
import { FileEntity } from "~/lib/hosted-image"
import { Slate, Editable, withReact } from "slate-react"
import React, { useCallback, useState } from "react"
import {
  handlePasteFile,
  handleDropFile,
  withPortive,
} from "~/lib/hosted-image"
import { withHistory } from "slate-history"
import { renderElement } from "./render"
import "./types"

export function MyEditor({
  authToken,
  initialValue,
  initialEntities = {},
}: {
  authToken: string
  initialValue: Descendant[]
  initialEntities: Record<string, FileEntity>
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
        initialEntities,
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

  const [isReadOnly, setIsReadOnly] = useState(false)

  return (
    <div style={{ marginLeft: 240 }}>
      <h1 style={{ font: "bold 36px sans-serif" }}>
        Slate Hosted Upload Plugin Demo
      </h1>
      <p>
        <input
          id="readOnly"
          type="checkbox"
          checked={isReadOnly}
          onClick={() => setIsReadOnly(!isReadOnly)}
        />
        <label htmlFor="readOnly">Read Only Mode</label>
      </p>
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
    </div>
  )
}
