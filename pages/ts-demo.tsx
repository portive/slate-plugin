/* eslint-disable react/prop-types */
import { InferGetServerSidePropsType } from "next"
import { useState } from "react"
import { createEditor } from "slate"
import { withReact, Slate, Editable, RenderElementProps } from "slate-react"
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

const renderElement = CloudComponents.withRenderElement(
  (props: RenderElementProps) => {
    const { element } = props
    if (element.type === "paragraph") {
      return <p {...props.attributes}>{props.children}</p>
    }
    throw new Error(`Unhandled element type ${element.type}`)
  }
)

export default function Page({
  authToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [editor] = useState(() => {
    const basicEditor = withHistory(withReact(createEditor()))
    // Add `withCloud` plugin to enable uploads
    const cloudEditor = withCloud(basicEditor, { authToken })
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
