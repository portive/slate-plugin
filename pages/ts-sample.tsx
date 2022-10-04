import { useState } from "react"
import { createEditor } from "slate"
import { withReact, Slate, Editable } from "slate-react"
import { withHistory } from "slate-history"
import { withCloud } from "~/src"
import { CloudComponents } from "~/src/cloud-components"

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
    // ✅ Add `CloudComponents.withRenderElement` plugin on `renderElement`
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
