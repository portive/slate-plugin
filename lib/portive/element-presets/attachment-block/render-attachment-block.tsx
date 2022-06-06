import { Transforms } from "slate"
import { useSlateStatic } from "slate-react"
import { css } from "emotion"
import bytes from "bytes"
import { useHighlightedStyle } from "~/lib/portive"
import { ReactEditor } from "slate-react"
import React, { useCallback } from "react"
import { useOrigin } from "~/lib/portive"
import { RenderElementPropsFor } from "~/lib/portive/types/type-utils"
import { ProgressBar, StatusBar } from "~/lib/portive/render-image/progress-bar"
import { DownloadIcon, FileIcon, TrashIcon } from "~/lib/portive/icons"
import { AttachmentBlockElement } from "./types"

const $attachmentBlock = css`
  position: relative;
  border-radius: 0.5em;
  border: 1px solid #e0e0e0;
  margin: 8px 0;
  max-width: 360px;
  background: white;
  .--container {
    display: flex;
    gap: 0.5em;
    padding: 1em;
    align-items: center;
  }
  .--icon {
    flex: 0 0 auto;
    color: #c0c0c0;
    font-size: 1.25em;
  }
  .--icon-button {
    width: 1em;
    height: 1em;
    border-radius: 0.25em;
    padding: 0.25em;
    &:hover {
      background: #f0f0f0;
    }
  }
  .--download-icon {
    cursor: pointer;
    color: #c0c0c0;
    &:hover {
      color: black;
    }
  }
  .--trash-icon {
    cursor: pointer;
    transition: color 0.1s, background-color 0.1s;
    color: #d00000;
    background: #f8f0f0;
    &:hover {
      color: red;
      background: #ffe0e0;
    }
  }
  .--body {
    flex: 1 1 auto;
  }
  .--description {
    margin-top: 0.25em;
    font-size: 0.9em;
    color: #808080;
  }
  .--status-bar {
    margin-top: 0.25em;
  }
`

export function AttachmentBlock({
  attributes,
  element,
  children,
}: RenderElementPropsFor<AttachmentBlockElement>) {
  const editor = useSlateStatic()
  const origin = useOrigin(element.originKey)
  const highlightedStyle = useHighlightedStyle()
  const removeElement = useCallback(() => {
    const at = ReactEditor.findPath(editor, element)
    Transforms.removeNodes(editor, { at })
  }, [editor, element])
  return (
    <div {...attributes} className={$attachmentBlock} style={highlightedStyle}>
      <div className="--container" contentEditable={false}>
        <div className="--icon">
          <FileIcon />
        </div>
        <div className="--body">
          <div>{element.filename}</div>
          {origin.status === "complete" ? (
            <div className="--description">{bytes(element.bytes)}</div>
          ) : null}
          <div>
            <StatusBar
              width={192}
              height={16}
              className="--status-bar"
              origin={origin}
            />
          </div>
        </div>
        {origin.status === "complete" ? (
          <div className="--icon">
            <a
              href={origin.url}
              target="_blank"
              rel="noreferrer"
              className="--icon-button --download-icon"
              download
            >
              <DownloadIcon />
            </a>
          </div>
        ) : null}
        {origin.status === "error" ? (
          <div className="--icon">
            <div className="--icon-button --trash-icon" onClick={removeElement}>
              <TrashIcon />
            </div>
          </div>
        ) : null}
      </div>
      {children}
    </div>
  )
}
