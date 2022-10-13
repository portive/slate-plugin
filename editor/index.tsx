import { createEditor, Descendant, Editor } from "slate"
import { Slate, Editable, withReact } from "slate-react"
import React, { useCallback, useState } from "react"
import { Upload, withCloud } from "../src"
import { withHistory } from "slate-history"
import { renderElement } from "./render-element"
import { ImageBlock } from "../src/components/image-block"
import { ImageInline } from "../src/components/image-inline"
import { TitledImageBlock } from "../src/components/titled-image-block"
import { AttachmentBlock } from "../src/components/attachment-block"
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
  initialOrigins: Record<string, Upload>
  isReadOnly: boolean
}) {
  const [editor] = useState<Editor>(() => {
    const reactEditor = withReact(withHistory(createEditor()))
    const editor = withCloud(reactEditor, {
      apiKey,
      authToken,
      apiOriginUrl,
      minResizeWidth: 100,
      maxResizeWidth: 640,
      initialOrigins,
    })
    AttachmentBlock.withEditor(editor)
    ImageInline.withEditor(editor)
    TitledImageBlock.withEditor(editor)
    ImageBlock.withEditor(editor)
    return editor
  })

  const [saveState, setSaveState] = useState<"ready" | "saving" | "saved">(
    "ready"
  )

  const save = useCallback(async () => {
    setSaveState("saving")
    console.log("children", editor.children)
    const result = await editor.cloud.save({ maxTimeoutInMs: 1000 })
    console.log("value", result.value)
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
