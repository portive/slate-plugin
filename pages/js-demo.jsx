/* eslint-disable react/prop-types */
import { useState } from "react"
import { createEditor } from "slate"
import { withReact, Slate, Editable } from "slate-react"
import { withHistory } from "slate-history"
import { withCloud } from "~/src"
import { createAuthToken } from "@portive/auth"
import { env } from "~/lib/server-env"
// import { ImageBlock } from "slate-cloud/image-block"

/**
 * Create the authToken
 */
export async function getServerSideProps() {
  const authToken = createAuthToken(env.PORTIVE_API_KEY, {
    expiresIn: "1d",
  })
  return { props: { authToken } }
}

const initialValue = [{ type: "paragraph", children: [{ text: "Hello Worl" }] }]

const renderElement = (props) => {
  const { element } = props
  if (element.type === "paragraph") {
    return <p {...props.attributes}>{props.children}</p>
  }
  throw new Error(`Unhandled element type ${element.type}`)
}

// const renderElement = ImageBlock.withRenderElement((props) => {
//   const { element } = props
//   if (element.type === "paragraph") {
//     return <p {...props.attributes}>{props.children}</p>
//   }
//   throw new Error(`Unhandled element type ${element.type}`)
// })

export default function Page({ authToken }) {
  console.log({ authToken })
  const [editor] = useState(() => {
    const basicEditor = withHistory(withReact(createEditor()))
    const cloudEditor = withCloud(basicEditor, { authToken })
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
