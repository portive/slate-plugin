import React, { useState } from "react"
import { env } from "~/lib/server-env"
import { InferGetServerSidePropsType } from "next"
import { initialValue, initialOrigins } from "~/sample/document"
import { MyEditor } from "~/editor"

export async function getServerSideProps() {
  return { props: { authToken: env.PORTIVE_AUTH_TOKEN } }
}

export default function Index({
  authToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isReadOnly, setIsReadOnly] = useState(false)

  return (
    <div style={{ marginLeft: 240, font: "16px sans-serif" }}>
      <h1>Slate Portive</h1>
      <h2>Image and Attachments Plugin</h2>
      <p>
        <input
          id="readOnly"
          type="checkbox"
          checked={isReadOnly}
          onChange={() => setIsReadOnly(!isReadOnly)}
        />
        <label htmlFor="readOnly">Read Only Mode</label>
      </p>
      <MyEditor
        authToken={authToken}
        initialValue={initialValue}
        initialOrigins={initialOrigins}
        isReadOnly={isReadOnly}
      />
    </div>
  )
}
