import React, { useCallback, useState } from "react"
import { env } from "~/lib/server-env"
import { Client, uploadFile } from "@portive/client"
import { InferGetServerSidePropsType } from "next"

export async function getServerSideProps() {
  const props: { authToken: string; apiOriginUrl?: string } = {
    authToken: env.PORTIVE_AUTH_TOKEN,
  }
  if (process.env.API_ORIGIN_URL) {
    props.apiOriginUrl = process.env.API_ORIGIN_URL
  }
  return { props }
}

export default function ClientDemo({
  authToken,
  apiOriginUrl,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [progressInfo, setProgressInfo] = useState<unknown>()
  const [status, setStatus] = useState<string>("ready")
  const onChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0]
        setStatus("started")
        const client = new Client({
          authToken,
          apiOrigin: apiOriginUrl,
        })
        await uploadFile({
          client,
          file,
          onProgress(e) {
            setStatus("uploading")
            setProgressInfo(e)
          },
        })
        setStatus("complete")
      }
    },
    []
  )
  return (
    <div>
      <h1>Client Demo</h1>
      <input type="file" onChange={onChange} />
      <h3>status: {status}</h3>
      <pre>{JSON.stringify(progressInfo, null, 2)}</pre>
    </div>
  )
}
