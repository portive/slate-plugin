import React, { useState } from "react"
import { env } from "~/lib/server-env"
import { InferGetServerSidePropsType } from "next"
import { initialValue, initialOrigins } from "~/sample/document"
import { MyEditor } from "~/editor"
import { createAuthToken } from "@portive/auth"

export async function getServerSideProps() {
  const authToken = createAuthToken(env.PORTIVE_API_KEY, {
    expiresIn: "1d",
    path: "demo",
  })
  const props: { authToken: string; apiOriginUrl?: string } = {
    authToken,
  }
  if (process.env.API_ORIGIN_URL) {
    props.apiOriginUrl = process.env.API_ORIGIN_URL
  }
  return { props }
}

export default function Index({
  authToken,
  apiOriginUrl,
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
        apiOriginUrl={apiOriginUrl}
        initialValue={initialValue}
        initialOrigins={initialOrigins}
        isReadOnly={isReadOnly}
      />
    </div>
  )
}
