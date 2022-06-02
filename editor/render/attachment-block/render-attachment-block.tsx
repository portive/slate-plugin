import { Transforms } from "slate"
import { useSlateStatic } from "slate-react"
import { css } from "emotion"
import bytes from "bytes"
import { useHighlightedStyle } from "~/lib/portive"
import { ReactEditor } from "slate-react"
import React, { useCallback } from "react"
import { useOrigin } from "~/lib/portive"
import { DiscriminatedRenderElementProps } from "~/lib/shared/types"
import { FileProgressBar } from "~/lib/portive/render-image/progress-bar"
import { DownloadIcon, FileIcon, TrashIcon } from "~/lib/portive/icons"

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
  .--progress-bar {
    margin-top: 0.25em;
  }
  .--error {
    margin-top: 0.25em;
    color: #d00000;
  }
`

export function AttachmentBlock({
  attributes,
  element,
  children,
}: DiscriminatedRenderElementProps<"attachment-block">) {
  const editor = useSlateStatic()
  const origin = useOrigin(element, (url) => {
    return {
      status: "uploaded",
      type: "generic",
      url,
    }
  })
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
          {origin.status === "uploaded" ? (
            <div className="--description">{bytes(element.bytes)}</div>
          ) : null}
          {origin.status === "uploading" ? (
            <div>
              <FileProgressBar className="--progress-bar" origin={origin} />
            </div>
          ) : null}
          {origin.status === "error" ? (
            <div className="--error">Error uploading file</div>
          ) : null}
        </div>
        {origin.status === "uploaded" ? (
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