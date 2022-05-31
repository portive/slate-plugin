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
  HostedImage,
  HostedImageInterface,
  handlePasteImage,
  handleDropImage,
  withHostedImage,
  PortiveHostedImageEditor,
  ImageEntity,
} from "~/lib/hosted-image"
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
type BlockImageElement = { type: "block-image" } & HostedImageInterface
type InlineImageElement = { type: "inline-image" } & HostedImageInterface
type CustomElement = ParagraphElement | BlockImageElement | InlineImageElement

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor & PortiveHostedImageEditor
    Element: CustomElement
    Text: CustomText
  }
}

export default function Index({
  authToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [editor] = useState<Editor>(() => {
    const reactEditor = withReact(withHistory(createEditor()))
    const editor = withHostedImage(
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
        editor.hostedImage.uploadHostedImage(file)
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
