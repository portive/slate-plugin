/* eslint-disable react/prop-types */
import { useState } from "react"
import { createEditor } from "slate"
import { withReact, Slate, Editable } from "slate-react"
import { withHistory } from "slate-history"
import { withCloud } from "~/src"
import { createAuthToken } from "@portive/auth"
import { env } from "~/lib/server-env"
import { CloudComponents } from "~/src/cloud-components"

/**
 * Create the authToken
 */
export async function getServerSideProps() {
  const authToken = createAuthToken(env.PORTIVE_API_KEY, {
    expiresIn: "1d",
  })
  return { props: { authToken } }
}

// ✅ Add `CloudComponents.withRenderElement` plugin on `renderElement`
const renderElement = CloudComponents.withRenderElement((props) => {
  const { element } = props
  if (element.type === "paragraph") {
    return <p {...props.attributes}>{props.children}</p>
  }
  throw new Error(`Unhandled element type ${element.type}`)
})

export default function Page({ authToken }) {
  const [editor] = useState(() => {
    const basicEditor = withHistory(withReact(createEditor()))
    // ✅ Add `CloudComponents.withRenderElement` plugin on `renderElement`
    const cloudEditor = withCloud(basicEditor, { authToken })
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
        onPaste={editor.cloud.handlePaste}
        onDrop={editor.cloud.handleDrop}
      />
    </Slate>
  )
}
