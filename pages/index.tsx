import React, { useState } from "react"
import { env } from "~/lib/server-env"
import { InferGetServerSidePropsType } from "next"
import { initialValue, initialEntities } from "~/sample/document"
import { MyEditor } from "~/editor"

export async function getServerSideProps() {
  return { props: { authToken: env.PORTIVE_AUTH_TOKEN } }
}

export default function Index({
  authToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isReadOnly, setIsReadOnly] = useState(false)

  return (
    <div style={{ marginLeft: 240 }}>
      <h1 style={{ font: "bold 36px sans-serif" }}>
        Slate Hosted Upload Plugin Demo
      </h1>
      <p>
        <input
          id="readOnly"
          type="checkbox"
          checked={isReadOnly}
          onClick={() => setIsReadOnly(!isReadOnly)}
        />
        <label htmlFor="readOnly">Read Only Mode</label>
      </p>
      <MyEditor
        authToken={authToken}
        initialValue={initialValue}
        initialEntities={initialEntities}
        isReadOnly={isReadOnly}
      />
    </div>
  )
}
