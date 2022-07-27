# Getting Started

### Installing

To install `slate-portive` with Yarn or NPM, either:

```bash
yarn add slate-portive
npm install --save slate-portive
```

You'll also need these peer dependencies:

```bash
yarn add slate slate-react
```

### Presets

Premade Elements are the fastest way to start with `slate-portive`. They are faster to setup and includes the features most people want like image resizing and the upload progress bar.

This Getting Started guide leads you through setting up `slate-portive` with two premade elements:

- `ImageBlock`: An Image Element that is a `void` `block` that shows the image with drag resize controls and an upload progress bar
- `AttachmentBlock`: An Attachment Element that is a `void` `block` that shows the original filename, file size and an upload progress bar

### Configure Types

> 🌞 If you aren't using TypeScript skip this step.
>
> If you are using TypeScript, read the [Slate Documentation for TypeScript](https://docs.slatejs.org/concepts/12-typescript) if you aren't familiar with CustomTypes already.

Add the `ImageBlockElement` and `AttachmentBlockElement` to your `CustomTypes`. In this example, we also have a `ParagraphElement`

```ts
import { BaseEditor, BaseText } from "slate"
import { ReactEditor } from "slate-react"
import { PortiveEditor } from "slate-portive"
import { HistoryEditor } from "slate-history"
import { AttachmentBlockElement, ImageBlockElement } from "slate-portive"

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
```

### Extend the Editor

The first step after setting up types is to extend the `editor` with [`withPortive`](../reference/with-portive.md). This sets up the Slate editor so that it can accept uploads.

To upload files, you'll need an `authToken`. Get one with 1 GB of upload space free at [https://admin.portive.com/](https://admin.portive.com/). Sign in with a GitHub or Google account then create a Project and you will be shown a quick start `authToken`.

```ts
import { BaseEditor, BaseText, createEditor } from "slate"
import { ReactEditor, withReact } from "slate-react"
import { PortiveEditor, withPortive } from "slate-portive"
import { HistoryEditor } from "slate-history"
import {
  AttachmentBlockElement,
  createAttachmentBlock,
  ImageBlockElement,
  createImageBlock,
} from "slate-portive"
import { useState } from "react"

// ... types ...

export default function MyEditor() {
  // Create a Slate editor object that won't change across renders.
  const [editor] = useState(() => {
    const reactEditor = withReact(withHistory(createEditor()))

    // ✅ Call `withPortive` on the editor with `createImageBlock`
    //    and `createAttachmentBlock`
    const editor = withPortive(reactEditor, {
      authToken: "...",
      createImageFileElement: createImageBlock,
      createFileElement: createAttachmentBlock,
    })

    // ✅ Set `isVoid` for `image-block` and `attachment-block` types
    editor.isVoid = (element) =>
      ["image-block", "attachment-block"].includes(element.type)

    return editor
  })

  return null
}
```

### Add Editable

Create a `renderElement` function that triages rendering to `AttachmentBlock` and `ImageBlock` and add it to the `Editable` component.

Also create a default `initialValue` and set it on the `Editable` component.

```tsx
import { BaseEditor, BaseText, Descendant, createEditor } from "slate"
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  Slate,
  withReact,
} from "slate-react"
import { PortiveEditor, withPortive } from "slate-portive"
import { HistoryEditor } from "slate-history"
import {
  AttachmentBlock,
  AttachmentBlockElement,
  createAttachmentBlock,
  ImageBlock,
  ImageBlockElement,
  createImageBlock,
} from "slate-portive"
import { useState } from "react"

// ... types ...

// ✅ Add the `initialValue`
const initialValue: Descendant[] = [
  { type: "paragraph", children: [{ text: "" }] },
]
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

export default function MyEditor() {
  // ... set `editor` const ...

  return (
    <Slate editor={editor} value={initialValue}>
      {/*  ✅ Add renderElement to `Editable` Component */}
      <Editable
        style={{ border: "1px solid", padding: 10 }}
        renderElement={renderElement}
      />
    </Slate>
  )
}
```

### Add `onPaste` and `onDrop` handlers

Add `editor.portive.handlePaste` to `onPaste` and `editor.portive.handleDrop` to `onDrop`.

```tsx
// ... imports ...
// ... types ...
// ... renderElement ...
export default function MyEditor() {
  // ... set `editor` const ...
  return (
    <Slate editor={editor} value={initialValue}>
      {/*  ✅ Add renderElement to `Editable` Component */}
      <Editable
        style={{ border: "1px solid", padding: 10 }}
        renderElement={renderElement}
      />
    </Slate>
  )
}
```

> 🌞 If you have other paste and drop handlers, note that `portive.handlePaste` and `portive.handleDrop` return a `boolean` indicating that the paste or drop was handled. This can be useful if you want to execute different handlers if the `handlePaste` or `handleDrop` was not executed.

### Full Source Code

The final editor source.

```tsx
import { BaseEditor, BaseText, Descendant, createEditor } from "slate"
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  Slate,
  withReact,
} from "slate-react"
import { PortiveEditor, withPortive } from "slate-portive"
import { HistoryEditor } from "slate-history"
import {
  AttachmentBlock,
  AttachmentBlockElement,
  createAttachmentBlock,
  ImageBlock,
  ImageBlockElement,
  createImageBlock,
} from "slate-portive"
import { useState } from "react"

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

const initialValue: Descendant[] = [
  { type: "paragraph", children: [{ text: "" }] },
]

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

export default function MyEditor() {
  // Create a Slate editor object that won't change across renders.
  const [editor] = useState(() => {
    const reactEditor = withReact(createEditor())
    const editor = withPortive(reactEditor, {
      authToken: "...",
      createImageFileElement: createImageBlock,
      createFileElement: createAttachmentBlock,
    })

    // Set `isVoid` for `image-block` and `attachment-block` types
    editor.isVoid = (element) =>
      ["image-block", "attachment-block"].includes(element.type)

    return editor
  })

  return (
    <Slate editor={editor} value={initialValue}>
      <Editable
        style={{ border: "1px solid", padding: 10 }}
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
