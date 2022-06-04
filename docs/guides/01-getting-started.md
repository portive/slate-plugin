# Getting Started

### Installing

To install `slate-portive` with Yarn or NPM, either:

```bash
yarn add slate-portive
npm install --save slate-portive
```

### Introducing `slate-portive` Presets

Presets are a great way to start with `slate-portive`. They are easy to setup and includes the features most people want like image resizing and a progress bar during uploads. Later, you can create your own custom Elements or modify a Preset.

This Getting Started guide leads you through setting up `slate-portive` with two presets:

- `ImageBlock`: An image preset that is a void block that shows the image with drag resize controls and an upload progress bar
- `AttachmentBlock`: An attachment preset that is a void block that shows the original filename, file size and an upload progress bar

### Setting Up Types

> 🌞 If you aren't using TypeScript, you can skip this step.
>
> If you are using `slate-portive` with TypeScript, read the [Slate Documentation for TypeScript](https://docs.slatejs.org/concepts/12-typescript) first.

Add the `ImageBlockElement` and `AttachmentBlockElement` to your Custom Element.

```ts
import { BaseEditor, BaseText } from "slate"
import { ReactEditor } from "slate-react"
import { PortiveEditor } from "~/lib/portive"
import { HistoryEditor } from "slate-history"
import { ImageBlockElement, AttachmentBlockElement } from "slate-portive"

type CustomText = BaseText

type ParagraphElement = {
  type: "paragraph"
  children: CustomText[]
}

export type CustomElement =
  | ParagraphElement
  | ImageBlockElement
  | AttachmentBlockElement

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor & PortiveEditor
    Element: CustomElement
    Text: CustomText
  }
}
```

### Extend the Editor

Extend the `editor` with [`withPortive`](../reference/with-portive.md) to add upload features to the Slate Editor.

```ts
import { useState } from "react"
import { createEditor } from "slate"
import { Editable, withReact } from "slate-react"
import {
  createImageBlockElement,
  createAttachmentBlockElement,
  withPortive,
} from "slate-portive"

const App = () => {
  // Create a Slate editor object that won't change across renders.
  const [editor] = useState(() => {
    const reactEditor = withReact(createEditor())

    const editor = withPortive(reactEditor, {
      createElement(e) {
        if (e.type === "image") {
          // When the type is an "image" return an ImageBlock Element
          return createImageBlockElement(e)
        } else {
          // When the type is not an "image" return an AttachmentBlock Element
          return createAttachmentBlockElement(e)
        }
      },
    })

    // If it's an `image-block` or `attachment-block` it is a void block
    editor.isVoid = (element) =>
      ["image-block", "attachment-block"].includes(element.type)

    return editor
  })
  return null // NOTE: we'll add this next
}
```

### Render Components
