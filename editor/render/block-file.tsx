import { Transforms } from "slate"
import { useReadOnly, useSlateStatic } from "slate-react"
import { css } from "emotion"
import bytes from "bytes"
import { useHighlightedStyle } from "~/lib/hosted-image"
import { ReactEditor } from "slate-react"
import React, { useCallback } from "react"
import { useEntity } from "~/lib/hosted-image"
import { DiscriminatedRenderElementProps } from "~/lib/shared/types"
import { FileProgressBar } from "~/lib/hosted-image/render-image/progress-bar"
import { DownloadIcon, FileIcon, TrashIcon } from "~/lib/icons"

const $blockFile = css`
  border-radius: 0.5em;
  border: 1px solid #e0e0e0;
  margin: 8px 0;
  max-width: 360px;
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
    &:hover {
      color: red;
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
`

export function BlockFile({
  attributes,
  element,
  children,
}: DiscriminatedRenderElementProps<"block-file">) {
  const editor = useSlateStatic()
  const readOnly = useReadOnly()
  const entity = useEntity(element, (url) => {
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
    <div {...attributes} className={$blockFile} style={highlightedStyle}>
      <div className="--container" contentEditable={false}>
        <div className="--icon">
          <FileIcon />
        </div>
        <div className="--body">
          <div>{element.filename}</div>
          {entity.status === "uploaded" ? (
            <div className="--description">{bytes(element.bytes)}</div>
          ) : (
            <div>
              <FileProgressBar className="--progress-bar" entity={entity} />
            </div>
          )}
        </div>
        {entity.status === "uploaded" ? (
          <div className="--icon">
            <a
              href={entity.url}
              target="_blank"
              rel="noreferrer"
              className="--icon-button --download-icon"
              download
            >
              <DownloadIcon />
            </a>
          </div>
        ) : null}
        {!readOnly ? (
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
