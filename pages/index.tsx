import { createEditor, BaseEditor, Descendant, Editor, Transforms } from "slate"
import {
  Slate,
  Editable,
  ReactEditor,
  withReact,
  RenderElementProps,
} from "slate-react"
import React, { ClipboardEventHandler, useCallback, useState } from "react"
import {
  RenderHostedImage,
  HostedImageElement,
  withHostedImage,
  HostedEditor,
  Entity,
} from "~/lib/hosted-image"

type CustomText = { text: string }
type ParagraphElement = { type: "paragraph"; children: CustomText[] }
type CustomElement = ParagraphElement | HostedImageElement

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HostedEditor
    Element: CustomElement
    Text: CustomText
  }
}

const initialValue: Descendant[] = [
  { type: "paragraph", children: [{ text: "Hello World" }] },
  {
    type: "hosted-image",
    id: "AtDtcNNMXEl3PNmkZbVmN",
    children: [{ text: "" }],
  },
  {
    type: "hosted-image",
    id: "CUSLBfyRv4nxZTr9CmBBW",
    children: [{ text: "" }],
  },
  {
    type: "hosted-image",
    id: "RwQIK7memACjhro80uwPN",
    children: [{ text: "" }],
  },
  {
    type: "hosted-image",
    id: "KVFjpuYRvXDu0PuWIEsEP",
    children: [{ text: "" }],
  },
  { type: "paragraph", children: [{ text: "End of World" }] },
]

const initialEntities: Record<string, Entity> = {
  AtDtcNNMXEl3PNmkZbVmN: {
    type: "loading",
    url: "https://files.wysimark.com/f/demo/2022/2/24/vbw6mr1jqcnqhniogsma6--1024x683.jpg?size=256x171",
    viewSize: [256, 171],
    sentBytes: 50000,
    totalBytes: 100000,
  },
  CUSLBfyRv4nxZTr9CmBBW: {
    type: "loading",
    url: "https://files.wysimark.com/f/demo/2022/2/24/vbw6mr1jqcnqhniogsma6--1024x683.jpg?size=256x171",
    viewSize: [256, 171],
    sentBytes: 100000,
    totalBytes: 100000,
  },
  RwQIK7memACjhro80uwPN: {
    type: "uploaded",
    url: "https://files.wysimark.com/f/demo/2022/2/24/vbw6mr1jqcnqhniogsma6--1024x683.jpg?size=256x171",
    size: [256, 171],
  },
  KVFjpuYRvXDu0PuWIEsEP: {
    type: "error",
    url: "https://files.wysimark.com/f/demo/2022/2/24/vbw6mr1jqcnqhniogsma6--1024x683.jpg?size=256x171",
    viewSize: [256, 171],
    message:
      "Error in API props validation: StructError: At path: file -- Expected the value to satisfy a union of `object | object`, but received: [object Object]",
  },
}

const handlePaste = (editor: Editor, e: React.ClipboardEvent): boolean => {
  const files = e.clipboardData.files
  if (files.length > 0) {
    for (const file of files) {
      editor.uploadHostedImage(file)
    }
    return true
  }
  return false
}

const handleDrop = (editor: Editor, e: React.DragEvent): boolean => {
  const files = e.dataTransfer.files
  if (files.length > 0) {
    for (const file of files) {
      editor.uploadHostedImage(file)
    }
    return true
  }
  return false
}

export default function Index() {
  const [editor] = useState<Editor>(() =>
    withHostedImage(
      {
        defaultResize: { type: "inside", width: 320, height: 320 },
        initialEntities,
      },
      withReact(createEditor())
    )
  )

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
      handlePaste(editor, e)
    },
    [editor]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      handleDrop(editor, e)
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
    case "hosted-image":
      return <RenderHostedImage {...props} element={element} />
    case "paragraph":
      return <p {...props.attributes}>{props.children}</p>
    default:
      throw new Error("Unexpected type")
  }
}
