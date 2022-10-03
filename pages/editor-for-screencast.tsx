import { createEditor, Descendant, Editor } from "slate"
import { Slate, Editable, withReact } from "slate-react"
import React, { useState } from "react"
import { withPortive, createAttachmentBlock, createImageBlock } from "~/src"
import { withHistory } from "slate-history"
import { renderElement } from "~/editor/render-element"
import { css } from "emotion"
import "~/editor/types"

import { env } from "~/lib/server-env"
import { InferGetServerSidePropsType } from "next"
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

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
]

const $inputFileCss = css`
  opacity: 0;
  position: absolute;
`

const $outerCss = css`
  border-radius: 8px;
  border: 2px solid rgba(190, 194, 210, 0.5);
  /* width: 385px; */
  /* height: 360px; */
  display: flex;
  flex-direction: column;
`

const $toolbarOuterCss = css`
  padding: 22px 30px 18px;
  border-bottom: 2px solid rgba(190, 194, 210, 0.5);
`

const $toolbarInnerCss = css`
  overflow: hidden;
`

const $innerCss = css`
  font: 16px sans-serif;
  padding: 8px 30px;
  overflow-y: hidden;
  flex: 1 1 auto;
`

export default function Index({
  authToken,
  apiOriginUrl,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [theme, setTheme] = useState<Theme>(themes[0])
  const [editor] = useState<Editor>(() => {
    const reactEditor = withReact(withHistory(createEditor()))
    const editor = withPortive(reactEditor, {
      authToken,
      apiOriginUrl,
      initialMaxSize: [240, 320], // 256
      minResizeWidth: 100,
      maxResizeWidth: 238,
      createImageFileElement: createImageBlock,
      createFileElement: createAttachmentBlock,
    })
    editor.isVoid = (element) => {
      return ["attachment-block", "image-block", "image-inline"].includes(
        element.type
      )
    }
    editor.isInline = (element) => {
      return element.type === "image-inline"
    }
    return editor
  })

  return (
    <>
      <input type="file" onChange={editor.cloud.handleInputFileChange} />
      <div
        className={$outerCss}
        style={{
          width: theme.width,
          height: theme.height,
          marginLeft: 240,
          marginTop: 120,
          font: "16px sans-serif",
        }}
      >
        <div className={$toolbarOuterCss}>
          <div className={$toolbarInnerCss}>
            <input
              className={$inputFileCss}
              type="file"
              onChange={editor.cloud.handleInputFileChange}
            />
            <img src={theme.toolbar} width={theme.toolbarWidth} height={16} />
          </div>
        </div>
        <Slate editor={editor} value={initialValue}>
          <Editable
            className={$innerCss}
            renderElement={renderElement}
            onPaste={editor.cloud.handlePaste}
            onDrop={editor.cloud.handleDrop}
          />
        </Slate>
      </div>
      <div className={themeCss}>
        {themes.map((theme) => {
          return (
            <div onClick={() => setTheme(theme)} key={theme.title}>
              {theme.title}
            </div>
          )
        })}
      </div>
    </>
  )
}

type Theme = {
  title: string
  width: number
  height: number
  toolbar: string
  toolbarWidth: number
}

const themes: Theme[] = [
  {
    title: "Default",
    width: 385,
    height: 360,
    toolbar: "/fake-toolbar@2x.png",
    toolbarWidth: 314,
  },
  {
    title: "Tall",
    width: 385,
    height: 460,
    toolbar: "/fake-toolbar@2x.png",

    toolbarWidth: 314,
  },
  {
    title: "Three Column",
    width: 300,
    height: 260,
    toolbar: "/fake-toolbar-short@2x.png",

    toolbarWidth: 241,
  },
]

const themeCss = css`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 160px;
  font-family: sans-serif;
  div {
    background: #e0e0e0;
    border-radius: 8px;
    color: #808080;
    padding: 4px 8px;
    margin-top: 4px;
  }
`
