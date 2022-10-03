# Getting Started

### Installing

To install `slate-cloud`:

```bash
# install with yarn
yarn add slate-cloud

# install with npm
npm install --save slate-cloud
```

You'll also need these peer dependencies if you don't already have them:

```bash
# install with yarn
yarn add slate slate-react

# install with npm
npm install --save slate slate-react
```

### Using Slate Cloud Components

Using the built-in Slate Cloud Components is the fastest way to start with `slate-cloud`. They include the features most people want like image resizing and an upload progress bar. Later, you can create your own custom Image and Attachment components.

This Getting Started guide leads you through setting up `slate-cloud` with two built-in Slate Cloud Components:

- `ImageBlock`: An Image Element that is a `void` `block` that shows the image with drag resize controls and an upload progress bar
- `AttachmentBlock`: An Attachment Element that is a `void` `block` that shows the original filename, file size and an upload progress bar

### Extend the Editor

The first step after setting up types is to extend the `editor` with [`withPortive`](../reference/with-portive.md). This sets up the Slate editor so that it can accept uploads.

To upload files, you'll need an `authToken`. Get one with 1 GB of upload space free at [https://admin.portive.com/](https://admin.portive.com/). Sign in with a GitHub or Google account then create a Project and you will be shown a quick start `authToken`.

```ts
import { useState } from "react"
import { BaseEditor, BaseText, createEditor } from "slate"
import { ReactEditor, withReact } from "slate-react"
import { PortiveEditor, withCloud, ImageBlock } from "slate-cloud"

// ... types ...

export default function MyEditor() {
  const [editor] = useState(() => {
    // ✅ Call `withCloud` on the editor to extend it.
    const editor = withCloud(withReact(createEditor()), {
      apiKey: "YOUR_API_KEY",
      createImageElement: ImageBlock.createElement,
    })

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

// Add the `initialValue`
const initialValue: Descendant[] = [
  { type: "paragraph", children: [{ text: "" }] },
]

// ✅ Add render code for `ImageBlock` and `AttachmentBlock`
function renderElement(props: RenderElementProps) {
  const element = props.element
  switch (element.type) {
    case "paragraph":
      return <p {...props.attributes}>{props.children}</p>
    case ImageBlock.type:
      return <ImageBlock.Element {...props} element={element} />
    default:
      throw new Error("Unrecognized element type")
  }
}

export default function MyEditor() {
  const

  return (
    <Slate editor={editor} value={initialValue}>
      {/*  ✅ Add renderElement to `Editable` Component */}
      <Editable
        style={{ border: "1px solid", padding: 10 }}
        renderElement={renderElement}
        onPaste={cloud.onPaste}
        onDrop={cloud.onDrop}
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
import { useState } from "react"
import { createEditor } from "slate"
import { withReact, Slate, Editable } from "slate-react"
import { withHistory } from "slate-history"
import { withCloud } from "slate-cloud/editor"
import { ImageBlock } from "slate-cloud/image-block"

// initial value "Hello World"
const initialValue = [
  { type: "paragraph", children: [{ text: "Hello World" }] },
]

// Add `ImageBlock` plugin
const renderElement = ImageBlock.withRenderElement((props) => {
  const {element} = props
  if (element.type === 'paragraph') {
    return <p {...props.attributes}>{props.children}</p>
  }
  throw new Error(`Unhandled element type ${element.type}`)
})

export default function EditorDemo() {

  const [editor] = useState(() => {
    const basicEditor = withHistory(withReact(createEditor()))
    // add `withCloud` plugin
    const cloudEditor = withCloud(basicEditor), { apiKey: "YOUR_API_KEY", })
    // add `ImageBlock.withEditor` plugin. Must be after `withCloud` plugin.
    const imageBlockEditor = ImageBlock.withEditor(cloudEditor)
    return imageBlockEditor
  })

  return (
    <Slate editor={editor} value={initialValue}>
      <Editable
        renderElement={renderElement}
        // Use SlateCloud's handlePaste handler
        onPaste={editor.cloud.handlePaste}
        // Use SlateCloud's handleDrop handler
        onDrop={editor.cloud.handleDrop}
      />
    </Slate>
  )
}
```

🎉 Congratulations! You have an Editor that supports images and attachments.

Next, learn how to [save the document](./02-saving-document.md).
