import { createEditor, BaseEditor, Editor, Transforms } from "slate"
import { useFocused, useSelected, useSlateStatic } from "slate-react"
import { cx, css } from "emotion"
import bytes from "bytes"
import { useHighlightedStyle } from "~/lib/hosted-image"
import {
  Slate,
  Editable,
  ReactEditor,
  withReact,
  RenderElementProps,
} from "slate-react"
import React, { useCallback, useState } from "react"
import {
  HostedFileInterface,
  HostedImage,
  HostedImageInterface,
  handlePasteImage,
  handleDropImage,
  withPortive,
  PortiveEditor,
  useEntity,
} from "~/lib/hosted-image"
import { HistoryEditor, withHistory } from "slate-history"
import { DiscriminatedRenderElementProps } from "~/lib/shared/types"
import { env } from "~/lib/server-env"
import { InferGetServerSidePropsType } from "next"
import { initialValue, initialEntities } from "~/sample/document"
import { FileProgressBar } from "~/lib/hosted-image/render-image/progress-bar"
import { DownloadIcon, FileIcon, TrashIcon } from "~/lib/icons"

export async function getServerSideProps() {
  return { props: { authToken: env.PORTIVE_AUTH_TOKEN } }
}

type CustomText = { text: string }
type ParagraphElement = {
  type: "paragraph"
  children: (CustomText | InlineImageElement)[]
}
type BlockFileElement = {
  type: "block-file"
  filename: string
  bytes: number
} & HostedFileInterface
type BlockImageElement = { type: "block-image" } & HostedImageInterface
type InlineImageElement = { type: "inline-image" } & HostedImageInterface
type CustomElement =
  | ParagraphElement
  | BlockFileElement
  | BlockImageElement
  | InlineImageElement

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor & PortiveEditor
    Element: CustomElement
    Text: CustomText
  }
}

export default function Index({
  authToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
      handlePasteImage(editor, e)
    },
    [editor]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      handleDropImage(editor, e)
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

function renderElement(props: RenderElementProps) {
  const element = props.element
  switch (element.type) {
    case "block-file":
      return <BlockFile {...props} element={element} />
    case "block-image":
      return <BlockImage {...props} element={element} />
    case "inline-image":
      return <InlineImage {...props} element={element} />
    case "paragraph":
      return <p {...props.attributes}>{props.children}</p>
    default:
      throw new Error("Unexpected type")
  }
}

const $blockFile = css`
  border-radius: 0.5em;
  border: 1px solid #e0e0e0;
  margin: 8px 0;
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
        <div className="--icon">
          <div className="--icon-button --trash-icon" onClick={removeElement}>
            <TrashIcon />
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}

export function BlockImage({
  attributes,
  element,
  children,
}: DiscriminatedRenderElementProps<"block-image">) {
  return (
    <div {...attributes} style={{ margin: "8px 0" }}>
      <HostedImage
        element={element}
        style={{ borderRadius: element.size[0] < 100 ? 0 : 4 }}
      />
      {children}
    </div>
  )
}

export function InlineImage({
  attributes,
  element,
  children,
}: DiscriminatedRenderElementProps<"inline-image">) {
  return (
    <span {...attributes}>
      <HostedImage
        element={element}
        style={{ borderRadius: element.size[0] < 100 ? 0 : 4 }}
      />
      {children}
    </span>
  )
}
