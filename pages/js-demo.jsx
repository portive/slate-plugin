/* eslint-disable react/prop-types */
import { useState } from "react"
import { createEditor } from "slate"
import { withReact, Slate, Editable } from "slate-react"
import { withHistory } from "slate-history"
import { withCloud } from "~/src"
import { createAuthToken } from "@portive/auth"
import { env } from "~/lib/server-env"
import { ImageBlock } from "~/src/image-block"
import { AttachmentBlock } from "~/src/attachment-block"

/**
 * Create the authToken
 */
export async function getServerSideProps() {
  const authToken = createAuthToken(env.PORTIVE_API_KEY, {
    expiresIn: "1d",
  })
  return { props: { authToken } }
}

const initialValue = [
  { type: "paragraph", children: [{ text: "Hello World" }] },
]

/**
 * Add ImageBlock and AttachmentBlock components
 */
const renderElement = AttachmentBlock.withRenderElement(
  ImageBlock.withRenderElement((props) => {
    const { element } = props
    if (element.type === "paragraph") {
      return <p {...props.attributes}>{props.children}</p>
    }
    throw new Error(`Unhandled element type ${element.type}`)
  })
)

export default function Page({ authToken }) {
  const [editor] = useState(() => {
    const basicEditor = withHistory(withReact(createEditor()))
    // Add `withCloud` plugin to enable uploads
    const cloudEditor = withCloud(basicEditor, { authToken })
    // Add `AttachmentBlock` plugin for generic files
    AttachmentBlock.withEditor(cloudEditor)
    // Add `ImageBlock` plugin for images
    ImageBlock.withEditor(cloudEditor)
    return cloudEditor
  })

  return (
    <Slate editor={editor} value={initialValue}>
      <Editable
        renderElement={renderElement}
        onPaste={editor.cloud.handlePaste}
        onDrop={editor.cloud.handleDrop}
      />
    </Slate>
  )
}
