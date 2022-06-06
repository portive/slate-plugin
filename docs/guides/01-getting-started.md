# Getting Started

### Installing

To install `slate-portive` with Yarn or NPM, either:

```bash
yarn add slate-portive
npm install --save slate-portive
```

### Presets

Presets are a great way to start with `slate-portive`. They are easy to setup and includes the features most people want like image resizing and the upload progress bar.

This Getting Started guide leads you through setting up `slate-portive` with two presets:

- `ImageBlock`: An image preset that is a `void` `block` that shows the image with drag resize controls and an upload progress bar
- `AttachmentBlock`: An attachment preset that is a `void` `block` that shows the original filename, file size and an upload progress bar

### Configure Types

> 🌞 If you aren't using TypeScript skip this step.
>
> If you are using TypeScript, read the [Slate Documentation for TypeScript](https://docs.slatejs.org/concepts/12-typescript) if you aren't familiar with CustomTypes already.

Add the `ImageBlockElement` and `AttachmentBlockElement` to your `CustomTypes`. In this example, we also have a `ParagraphElement`

```ts
import { BaseEditor, BaseText } from "slate"
import { ReactEditor } from "slate-react"
import { PortiveEditor } from "~/src"
import { HistoryEditor } from "slate-history"
import { ImageBlockElement, AttachmentBlockElement } from "slate-portive"

type ParagraphElement = {
  type: "paragraph"
  children: BaseText[]
}

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor & PortiveEditor
    Element:
      | ParagraphElement
      | ImageBlockElement // ✅ Add this
      | AttachmentBlockElement // ✅ and this to your CustomElement
    Text: BaseText
  }
}
```

### Extend the Editor

The first step after setting up types is to extend the `editor` with [`withPortive`](../reference/with-portive.md). This add a `portive` object to the editor at `editor.portive` which contains functions used to handle uploads.

```ts
import { useState } from "react"
import { createEditor } from "slate"
import { Editable, withReact } from "slate-react"
import {
  createImageBlock,
  createAttachmentBlock,
  withPortive,
} from "slate-portive"

const App = () => {
  // Create a Slate editor object that won't change across renders.
  const [editor] = useState(() => {
    const reactEditor = withReact(createEditor())

    // ✅ Call `withPortive` on the editor with `createImageBlock`
    //    and `createAttachmentBlock`
    const editor = withPortive(reactEditor, {
      createImageFileElement: createImageBlock,
      createFileElement: createAttachmentBlock,
    })

    // ✅ Set `isVoid` for `image-block` and `attachment-block` types
    editor.isVoid = (element) =>
      ["image-block", "attachment-block"].includes(element.type)

    return editor
  })
  return null // ... we'll add this next
}
```

### Add Editable

Create a `renderElement` function that triages rendering to `AttachmentBlock` and `ImageBlock` and add it to the `Editable` component.

Also create a default `initialValue` and set it on the `Editable` component.

```tsx
import { useState } from "react"
import { createEditor } from "slate"
import { Editable, withReact } from "slate-react"
import {
  AttachmentBlock,
  ImageBlock,
  createImageBlock,
  createAttachmentBlock,
  withPortive,
} from "slate-portive"

// ✅ Add the `initialValue`
const initialValue: Descendant[] = [{ type: "paragraph" }]

// ✅ Add render code for `ImageBlock` and `AttachmentBlock`
function renderElement(props: RenderElementProps) {
  const element = props.element
  switch (element.type) {
    case "paragraph":
      return <p {...props.attributes}>{props.children}</p>
    case "attachment-block":
      return <AttachmentBlock {...props} element={element} />
    case "image-block":
      return <ImageBlock {...props} element={element} />
    default:
      throw new Error("Unexpected type")
  }
}

const App = () => {
  // Create a Slate editor object that won't change across renders.
  const [editor] = useState(() => {
    const reactEditor = withReact(createEditor())
    const editor = withPortive(reactEditor, {
      createElement: (e) =>
        e.type === "image" ? createImageBlock(e) : createAttachmentBlock(e),
    })

    // Set `isVoid` for `image-block` and `attachment-block` types
    editor.isVoid = (element) =>
      ["image-block", "attachment-block"].includes(element.type)

    return editor
  })

  return (
    <Slate editor={editor} value={initialValue}>
      {/* ✅ provide `renderElement` here */}
      <Editable renderElement={renderElement} />
    </Slate>
  )
}
```

### Add `onPaste` and `onDrop` handlers

Add `editor.portive.handlePaste` to `onPaste` and `editor.portive.handleDrop` to `onDrop`.

```tsx
// ... function renderElement ...

const App = () => {
  // ... [editor] = useState(...)

  return (
    <Slate editor={editor} value={initialValue}>
      <Editable
        renderElement={renderElement}
        { /* ✅ Add `handlePaste` and `handleDrop` */}
        onPaste={editor.portive.handlePaste}
        onDrop={editor.portive.handleDrop}
      />
    </Slate>
  )
}
```

> 🌞 If you have other paste and drop handlers, note that `portive.handlePaste` and `portive.handleDrop` return a `boolean` indicating that the paste or drop was handled. This can be useful if you want to execute different handlers if the `handlePaste` or `handleDrop` was not executed.

### Full Source Code

The final editor source.

```tsx
import { BaseEditor, BaseText } from "slate"
import { ReactEditor } from "slate-react"
import { PortiveEditor } from "~/src"
import { HistoryEditor } from "slate-history"
import { ImageBlockElement, AttachmentBlockElement } from "slate-portive"

type ParagraphElement = {
  type: "paragraph"
  children: BaseText[]
}

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor & PortiveEditor
    Element: ParagraphElement | ImageBlockElement | AttachmentBlockElement
    Text: BaseText
  }
}

const initialValue: Descendant[] = [{ type: "paragraph" }]

function renderElement(props: RenderElementProps) {
  const element = props.element
  switch (element.type) {
    case "paragraph":
      return <p {...props.attributes}>{props.children}</p>
    case "attachment-block":
      return <AttachmentBlock {...props} element={element} />
    case "image-block":
      return <ImageBlock {...props} element={element} />
    default:
      throw new Error("Unexpected type")
  }
}

const App = () => {
  // Create a Slate editor object that won't change across renders.
  const [editor] = useState(() => {
    const reactEditor = withReact(createEditor())
    const editor = withPortive(reactEditor, {
      createElement: (e) =>
        e.type === "image" ? createImageBlock(e) : createAttachmentBlock(e),
    })

    // Set `isVoid` for `image-block` and `attachment-block` types
    editor.isVoid = (element) =>
      ["image-block", "attachment-block"].includes(element.type)

    return editor
  })

  return (
    <Slate editor={editor} value={initialValue}>
      <Editable
        renderElement={renderElement}
        onPaste={editor.portive.handlePaste}
        onDrop={editor.portive.handleDrop}
      />
    </Slate>
  )
}
```

🎉 Congratulations! You have an Editor that supports images and attachments.

Next, learn how to [save the document](./02-saving-document.md).
