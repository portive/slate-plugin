import React, { useState } from "react"
import { env } from "~/lib/server-env"
import { InferGetServerSidePropsType } from "next"
import { initialValue, initialOrigins } from "~/sample/document"
import { MyEditor } from "~/editor"

export async function getServerSideProps() {
  const props: { authToken: string; uploadApiUrl?: string } = {
    authToken: env.PORTIVE_AUTH_TOKEN,
  }
  if (process.env.API_UPLOAD_URL) {
    props.uploadApiUrl = process.env.API_UPLOAD_URL
  }
  return { props }
}

export default function Index({
  authToken,
  uploadApiUrl,
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
        uploadApiUrl={uploadApiUrl}
        initialValue={initialValue}
        initialOrigins={initialOrigins}
        isReadOnly={isReadOnly}
      />
    </div>
  )
}
