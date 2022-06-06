import { createEditor, Descendant, Editor } from "slate"
import { Origin } from "~/lib/portive"
import { Slate, Editable, withReact } from "slate-react"
import React, { useCallback, useState } from "react"
import { withPortive } from "~/lib/portive"
import { withHistory } from "slate-history"
import { renderElement } from "./render-element"
import { createAttachmentBlock } from "~/lib/portive/element-presets/attachment-block"
import { createImageBlock } from "~/lib/portive/element-presets/image-block"
import { createTitledImageBlock } from "~/lib/portive/element-presets/titled-image-block"
import delay from "delay"
import { css } from "emotion"
import "./types"

const $myEditor = css`
  font-family: 14px sans-serif;
`

const $saveButton = css`
  background-color: #0095ff;
  border: 1px solid transparent;
  border-radius: 3px;
  box-shadow: rgba(255, 255, 255, 0.4) 0 1px 0 0 inset;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-family: -apple-system, system-ui, "Segoe UI", "Liberation Sans",
    sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.15385;
  margin: 0;
  outline: none;
  padding: 8px 0.8em;
  position: relative;
  text-align: center;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: baseline;
  white-space: nowrap;

  &:hover,
  &:focus {
    background-color: #07c;
  }

  &:focus {
    box-shadow: 0 0 0 4px rgba(0, 149, 255, 0.15);
  }

  &:active {
    background-color: #0064bd;
    box-shadow: none;
  }
`

export function MyEditor({
  authToken,
  initialValue,
  initialOrigins = {},
  isReadOnly,
}: {
  authToken: string
  initialValue: Descendant[]
  initialOrigins: Record<string, Origin>
  isReadOnly: boolean
}) {
  const [editor] = useState<Editor>(() => {
    const reactEditor = withReact(withHistory(createEditor()))
    const editor = withPortive(reactEditor, {
      authToken,
      path: "demo",
      initialMaxSize: [320, 320],
      minResizeWidth: 100,
      maxResizeWidth: 640,
      initialOrigins: initialOrigins,
      // createImageFileElement: createImageBlock,
      createImageFileElement: createTitledImageBlock,
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
    const result = await editor.portive.save()
    console.log(result.value)
    setSaveState("saved")
    await delay(1000)
    setSaveState("ready")
  }, [editor])

  return (
    <div>
      <div className={$myEditor}>
        <p>
          <button onClick={save} className={$saveButton}>
            Save Document
          </button>{" "}
          <span style={{ font: "12px sans-serif" }}>
            {saveState === "saving" ? "Saving" : null}
            {saveState === "saved" ? "Saved! Document value in console" : null}
          </span>
        </p>
        <p>
          <input
            type="file"
            onChange={editor.portive.handleInputFileChange}
            multiple
          />
        </p>
      </div>
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
