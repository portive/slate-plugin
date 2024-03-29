import React, { useState } from "react"
import { env } from "~/lib/server-env"
import { InferGetServerSidePropsType } from "next"
import { initialValue, initialOrigins } from "~/sample/document"
import { MyEditor } from "~/editor"
import { createAuthToken } from "@portive/auth"
import { DefaultHead } from "~/components/default-head"

export async function getServerSideProps() {
  const authToken = createAuthToken(env.PORTIVE_API_KEY, { expiresIn: "1d" })
  const props: {
    authToken: string
    apiKey?: string
    apiOriginUrl?: string
  } = {
    apiKey: env.PORTIVE_API_KEY,
    authToken,
  }
  if (process.env.API_ORIGIN_URL) {
    props.apiOriginUrl = process.env.API_ORIGIN_URL
  }
  return { props }
}

export default function Index({
  apiKey,
  authToken,
  apiOriginUrl,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isReadOnly, setIsReadOnly] = useState(false)
  const [authType, setAuthType] = useState<"apiKey" | "authToken">("authToken")

  return (
    <div>
      <DefaultHead title="Slate Cloud" />
      <h1>
        <img src="/favicon-32x32.png" /> Slate Cloud for Portive
      </h1>
      <div>
        <p>Origin: {apiOriginUrl}</p>
        <div>
          <strong>Authentication Type</strong>
        </div>
        <div>
          <input
            id="authTypeApiKey"
            name="authType"
            type="radio"
            value="apiKey"
            checked={authType === "apiKey"}
            onChange={() => setAuthType("apiKey")}
          />
          <label htmlFor="authTypeApiKey">Use API Key directly</label>
        </div>
        <div>
          <input
            id="authTypeAuthToken"
            name="authType"
            type="radio"
            value="authToken"
            checked={authType === "authToken"}
            onChange={() => setAuthType("authToken")}
          />
          <label htmlFor="authTypeAuthToken">
            Use AuthToken generated from API Key
          </label>
        </div>
      </div>
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
        key={authType}
        apiKey={authType === "apiKey" ? apiKey : undefined}
        authToken={authType === "authToken" ? authToken : undefined}
        apiOriginUrl={apiOriginUrl}
        initialValue={initialValue}
        initialOrigins={initialOrigins}
        isReadOnly={isReadOnly}
      />
    </div>
  )
}
