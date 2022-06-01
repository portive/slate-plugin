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

  const onChangeFile = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      const files = e.target.files
      if (files === null) return
      for (const file of files) {
        editor.portive.uploadFile(file)
      }
    },
    [editor]
  )

  const onPaste = useCallback(
    (e: React.ClipboardEvent) => {
      handlePasteFile(editor, e)
    },
    [editor]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      handleDropFile(editor, e)
    },
    [editor]
  )

  return (
    <div style={{ marginLeft: 240 }}>
      <h1 style={{ font: "bold 36px sans-serif" }}>
        Slate Hosted Upload Plugin Demo
      </h1>
      <p>
        <input type="file" onChange={onChangeFile} multiple />
      </p>
      <Slate editor={editor} value={initialValue}>
        <Editable
          renderElement={renderElement}
          onPaste={onPaste}
          onDrop={onDrop}
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
