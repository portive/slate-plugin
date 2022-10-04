import { createEditor, Descendant, Editor } from "slate"
import { Slate, Editable, withReact } from "slate-react"
import React, { useCallback, useState } from "react"
import {
  Origin,
  withCloud,
  createAttachmentBlock,
  createImageBlock,
} from "~/src"
import { withHistory } from "slate-history"
import { renderElement } from "./render-element"
import delay from "delay"
import "./types"

export function MyEditor({
  apiKey,
  authToken,
  apiOriginUrl,
  initialValue,
  initialOrigins = {},
  isReadOnly,
}: {
  apiKey?: string
  authToken?: string
  apiOriginUrl?: string
  initialValue: Descendant[]
  initialOrigins: Record<string, Origin>
  isReadOnly: boolean
}) {
  const [editor] = useState<Editor>(() => {
    const reactEditor = withReact(withHistory(createEditor()))
    const editor = withCloud(reactEditor, {
      apiKey,
      authToken,
      apiOriginUrl,
      initialMaxSize: [320, 320],
      minResizeWidth: 100,
      maxResizeWidth: 640,
      initialOrigins,
      createImageFileElement: createImageBlock,
      createFileElement: createAttachmentBlock,
    })
    editor.isVoid = (element) => {
      return ["attachment-block", "image-block", "image-inline"].includes(
        element.type
      )
    }
    editor.isInline = (element) => {
      return element.type === "image-inline"
    }
    return editor
  })

  const [saveState, setSaveState] = useState<"ready" | "saving" | "saved">(
    "ready"
  )

  const save = useCallback(async () => {
    setSaveState("saving")
    const result = await editor.cloud.save()
    console.log(result.value)
    setSaveState("saved")
    await delay(1000)
    setSaveState("ready")
  }, [editor])

  return (
    <div>
      <div>
        <p>
          <button onClick={save}>Save Document</button>{" "}
          <span style={{ font: "12px sans-serif" }}>
            {saveState === "saving" ? "Saving" : null}
            {saveState === "saved" ? "Saved! Document value in console" : null}
          </span>
        </p>
        <p>
          <input
            type="file"
            onChange={editor.cloud.handleInputFileChange}
            multiple
          />
        </p>
      </div>
      <Slate editor={editor} value={initialValue}>
        <Editable
          readOnly={isReadOnly}
          renderElement={renderElement}
          onPaste={editor.cloud.handlePaste}
          onDrop={editor.cloud.handleDrop}
          style={{
            font: "16px sans-serif",
            border: "1px solid #c0c0c0",
            borderRadius: 8,
            padding: "0 16px",
            width: 480,
          }}
        />
      </Slate>
    </div>
  )
}
