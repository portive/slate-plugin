import { useState } from "react"
import { createEditor } from "slate"
import { withReact, Slate, Editable } from "slate-react"
import { withHistory } from "slate-history"
import { withCloud } from "~/src"
import { CloudComponents } from "~/src/cloud-components"

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
    // Add `withCloud` plugin to enable uploads
    const cloudEditor = withCloud(basicEditor, { apiKey: "MY_API_KEY" })
    // Add default cloud components for ImageBlock and AttachmentBlock
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
        onPaste={editor.cloud.handlePaste}
        onDrop={editor.cloud.handleDrop}
      />
    </Slate>
  )
}
