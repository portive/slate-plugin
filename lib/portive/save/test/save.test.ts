/* eslint-disable @typescript-eslint/no-explicit-any */
import { Descendant, createEditor } from "slate"
import { withReact } from "slate-react"
import { withPortive } from "~/lib/portive"
import { withHistory } from "slate-history"
import { FullPortiveEditor, Origin } from "../../types"
import "~/editor/types" // use the types from our demo editor for testing

function mockEditor(
  value: Descendant[],
  origins: Record<string, Origin>
): FullPortiveEditor {
  const editor = withPortive(
    {
      authToken: "", // we won't be uploading
      path: "test",
      initialMaxSize: [320, 320],
      minResizeWidth: 100,
      maxResizeWidth: 640,
      initialOrigins: origins,
      createImageFile: {} as any, // we won't be creating
      createGenericFile: {} as any, // we won't be creating
    },
    withReact(withHistory(createEditor()))
  )
  return editor
}

describe("editor.portive.save", () => {
  it("should save a simple document", async () => {
    const editor = mockEditor(
      [{ type: "paragraph", children: [{ text: "" }] }],
      {}
    )
    const result = await editor.portive.save()
    console.log(result)
  })
})
