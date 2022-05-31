import { createEditor, BaseEditor, Descendant, Editor } from "slate"
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
import { HostedFile } from "~/lib/hosted-file"
import { HistoryEditor, withHistory } from "slate-history"
import { DiscriminatedRenderElementProps } from "~/lib/shared/types"
import { env } from "~/lib/server-env"
import { InferGetServerSidePropsType } from "next"
import { initialValue, initialEntities } from "~/sample/document"

export async function getServerSideProps() {
  return { props: { authToken: env.PORTIVE_AUTH_TOKEN } }
}

type CustomText = { text: string }
type ParagraphElement = {
  type: "paragraph"
  children: (CustomText | InlineImageElement)[]
}
type BlockFileElement = { type: "block-file" } & HostedFileInterface
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
      },
      reactEditor
    )
    editor.isVoid = (element) => {
      return element.type === "block-image" || element.type === "inline-image"
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

// function useEntity() {

//   const editor = useSlateStatic()
//   const entityFromStore = editor.portive.useStore(
//     (state) => state.entities[element.id]
//   )
// }

export function BlockFile({
  attributes,
  element,
  children,
}: DiscriminatedRenderElementProps<"block-file">) {
  const entity = useEntity(element, (url) => {
    return {
      status: "uploaded",
      type: "generic",
      url: element.id,
    }
  })
  return (
    <div
      {...attributes}
      style={{
        borderRadius: "0.5em",
        border: "1px solid #e0e0e0",
        margin: "8px 0",
        padding: "1em",
      }}
      contentEditable={false}
    >
      <div style={{ display: "flex", gap: "1em" }}>
        <div style={{ color: "#808080" }}>💾</div>
        <div>
          {new URL(entity.url).pathname}
          {children}
        </div>
      </div>
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
