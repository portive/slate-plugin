import React from "react"
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
  return (
    <MyEditor
      authToken={authToken}
      initialValue={initialValue}
      initialEntities={initialEntities}
    />
  )
}
