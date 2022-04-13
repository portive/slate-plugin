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
  HostedEditor,
  Entity,
} from "~/lib/hosted-image"
import { HistoryEditor, withHistory } from "slate-history"
import { DiscriminatedRenderElementProps } from "~/lib/hosted-image"

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
    Editor: BaseEditor & ReactEditor & HistoryEditor & HostedEditor
    Element: CustomElement
    Text: CustomText
  }
}

const initialValue: Descendant[] = [
  { type: "paragraph", children: [{ text: "Small image can't be resized" }] },
  {
    type: "paragraph",
    children: [
      { text: "Image is inline " },
      {
        type: "inline-image",
        id: "RGVIrl9C5y2i5n95T7lAR",
        size: [16, 16],
        children: [{ text: "" }],
      },
      { text: " in the middle of text" },
    ],
  },
  {
    type: "block-image",
    id: "RGVIrl9C5y2i5n95T7lAR",
    size: [16, 16],
    children: [{ text: "" }],
  },
  { type: "paragraph", children: [{ text: "In progress uploads" }] },
  {
    type: "block-image",
    id: "fviZDsq2zVZ3PIe3vgVU9",
    size: [256, 171],
    children: [{ text: "" }],
  },
  {
    type: "block-image",
    id: "AtDtcNNMXEl3PNmkZbVmN",
    size: [256, 171],
    children: [{ text: "" }],
  },
  {
    type: "block-image",
    id: "CUSLBfyRv4nxZTr9CmBBW",
    size: [256, 171],
    children: [{ text: "" }],
  },
  {
    type: "paragraph",
    children: [{ text: "Completed upload in document value" }],
  },
  {
    type: "block-image",
    id: "https://files.wysimark.com/f/demo/2022/2/24/vbw6mr1jqcnqhniogsma6--1024x683.jpg?size=256x171",
    size: [256, 171],
    children: [{ text: "" }],
  },
  { type: "paragraph", children: [{ text: "Completed upload in Store" }] },
  {
    type: "block-image",
    id: "RwQIK7memACjhro80uwPN",
    size: [256, 171],
    children: [{ text: "" }],
  },
  { type: "paragraph", children: [{ text: "Failed upload" }] },
  {
    type: "block-image",
    id: "KVFjpuYRvXDu0PuWIEsEP",
    size: [256, 171],
    children: [{ text: "" }],
  },
  { type: "paragraph", children: [{ text: "End of World" }] },
]

const initialEntities: Record<string, Entity> = {
  RGVIrl9C5y2i5n95T7lAR: {
    type: "uploaded",
    url: "https://files.wysimark.com/f/demo/2022/4/13/bu371qgo8qvrxrsknqfv9--44x44.png",
    maxSize: [44, 44],
  },
  fviZDsq2zVZ3PIe3vgVU9: {
    type: "loading",
    url: "https://files.wysimark.com/f/demo/2022/2/24/vbw6mr1jqcnqhniogsma6--1024x683.jpg?size=256x171",
    sentBytes: 1000,
    totalBytes: 100000,
    maxSize: [1024, 683],
  },
  AtDtcNNMXEl3PNmkZbVmN: {
    type: "loading",
    url: "https://files.wysimark.com/f/demo/2022/2/24/vbw6mr1jqcnqhniogsma6--1024x683.jpg?size=256x171",
    sentBytes: 50000,
    totalBytes: 100000,
    maxSize: [1024, 683],
  },
  CUSLBfyRv4nxZTr9CmBBW: {
    type: "loading",
    url: "https://files.wysimark.com/f/demo/2022/2/24/vbw6mr1jqcnqhniogsma6--1024x683.jpg?size=256x171",
    maxSize: [1024, 683],
    sentBytes: 100000,
    totalBytes: 100000,
  },
  RwQIK7memACjhro80uwPN: {
    type: "uploaded",
    url: "https://files.wysimark.com/f/demo/2022/2/24/vbw6mr1jqcnqhniogsma6--1024x683.jpg?size=256x171",
    maxSize: [1024, 683],
  },
  KVFjpuYRvXDu0PuWIEsEP: {
    type: "error",
    url: "https://files.wysimark.com/f/demo/2022/2/24/vbw6mr1jqcnqhniogsma6--1024x683.jpg?size=256x171",
    maxSize: [1024, 683],
    message:
      "Error in API props validation: StructError: At path: file -- Expected the value to satisfy a union of `object | object`, but received: [object Object]",
  },
}

export default function Index() {
  const [editor] = useState<Editor>(() => {
    const editor = withHostedImage(
      {
        defaultResize: { type: "inside", width: 320, height: 320 },
        minResizeWidth: 100,
        maxResizeWidth: 640,
        initialEntities,
      },
      withReact(withHistory(createEditor()))
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
        editor.uploadHostedImage(file)
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
    <div>
      <h1>Editor</h1>
      <p>
        <input type="file" onChange={onChangeFile} multiple />
      </p>
      <Slate editor={editor} value={initialValue}>
        <Editable
          renderElement={renderElement}
          onPaste={onPaste}
          onDrop={onDrop}
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
