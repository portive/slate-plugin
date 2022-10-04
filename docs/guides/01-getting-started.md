# Getting Started

This guide show you how to install `slate-cloud` and use it.

- [Installation](#installation)
- [Using Slate Cloud](#using-slate-cloud)
- [Using TypeScript](#using-typescript)

### Installation

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

### Using Slate Cloud

This is a minimal Slate Cloud integration.

```javascript
import { useState } from "react"
import { createEditor } from "slate"
import { withReact, Slate, Editable } from "slate-react"
import { withHistory } from "slate-history"
import { withCloud } from "slate-cloud"
import { CloudComponents } from "slate-cloud/cloud-components"

// ✅ Add `CloudComponents.withRenderElement` plugin on `renderElement`
const renderElement = CloudComponents.withRenderElement((props) => {
  const { element } = props
  if (element.type === "paragraph") {
    return <p {...props.attributes}>{props.children}</p>
  }
  throw new Error(`Unhandled element type ${element.type}`)
})

export default function Page() {
  const [editor] = useState(() => {
    const basicEditor = withHistory(withReact(createEditor()))
    // ✅ Add `withCloud` plugin on `Editor` object to enable uploads
    const cloudEditor = withCloud(basicEditor, { apiKey: "MY_API_KEY" })
    // ✅ Add `CloudComponents.withEditor` plugin on `Editor` object
    CloudComponents.withEditor(cloudEditor)
    return cloudEditor
  })

  return (
    <Slate
      editor={editor}
      value={[{ type: "paragraph", children: [{ text: "Hello World" }] }]}
    >
      <Editable
        renderElement={renderElement}
        // ✅ Add `editor.cloud.handlePaste` to `Editable onPaste`
        onPaste={editor.cloud.handlePaste}
        // ✅ Add `editor.cloud.handleDrop` to `Editable onDrop`
        onDrop={editor.cloud.handleDrop}
      />
    </Slate>
  )
}
```

### Using TypeScript

> NOTE: To learn more about using TypeScript with Slate, read [Slate's TypeScript Documentation](https://docs.slatejs.org/concepts/12-typescript).

To use Slate Cloud with TypeScript, configure Slate's CustomTypes.

```typescript
import { BaseEditor, BaseText } from "slate"
import { ReactEditor } from "slate-react"
import { PortiveEditor } from "slate-portive"
import { HistoryEditor } from "slate-history"
import { CloudEditor } from "slate-cloud"
import { CloudComponentsElementType } from "slate-cloud/cloud-components"

type ParagraphElement = {
  type: "paragraph"
  children: BaseText[]
}

declare module "slate" {
  interface CustomTypes {
    // ✅ Add `CloudEditor`
    Editor: BaseEditor & ReactEditor & HistoryEditor & CloudEditor
    // ✅ Add `CloudComponentElementType`
    Element: ParagraphElement | CloudComponentElementType
    Text: BaseText
  }
}

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor & CloudEditor
    Element: CustomElement
    Text: CustomText
  }
}
```

### What's Next

Next, learn how to [save the document](./02-saving-document.md).
