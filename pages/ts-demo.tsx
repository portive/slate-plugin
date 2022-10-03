/* eslint-disable react/prop-types */
import { InferGetServerSidePropsType } from "next"
import { useState } from "react"
import { createEditor, Descendant } from "slate"
import { withReact, Slate, Editable, RenderElementProps } from "slate-react"
import { withHistory } from "slate-history"
import { withCloud } from "~/src"
import { createAuthToken } from "@portive/auth"
import { env } from "~/lib/server-env"
import { Origin, createAttachmentBlock, createImageBlock } from "~/src"
import { ImageBlock } from "~/src/image-block"

/**
 * Create the authToken
 */
export async function getServerSideProps() {
  const authToken = createAuthToken(env.PORTIVE_API_KEY, {
    expiresIn: "1d",
  })
  return { props: { authToken } }
}

const initialValue: Descendant[] = [
  { type: "paragraph", children: [{ text: "Hello World" }] },
]

const renderElement = ImageBlock.withRenderElement(
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
    const cloudEditor = withCloud(basicEditor, {
      authToken,
      createImageFileElement: createImageBlock,
      createFileElement: createAttachmentBlock,
    })
    // ImageBlock.withEditor(cloudEditor)
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
