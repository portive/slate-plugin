/* eslint-disable @typescript-eslint/no-explicit-any */
import { Descendant, createEditor } from "slate"
import { withReact } from "slate-react"
import { withPortive } from "~/lib/portive"
import { withHistory } from "slate-history"
import { FullPortiveEditor, Origin } from "../../types"
import "~/editor/types" // use the types from our demo editor for testing
import { mockOrigin } from "./mock-origin"
import { createOriginStore } from "../../origin-store"

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
  editor.children = value
  editor.portive.useStore = createOriginStore({ origins })
  return editor
}

/**
 * Disabled the warning because we want to have log available but sometimes we
 * don't need it.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function log(x: unknown) {
  console.log(JSON.stringify(x))
}

describe("editor.portive.save", () => {
  describe("check that it normalizes", () => {
    it("should save a simple document", async () => {
      const editor = mockEditor(
        [{ type: "paragraph", children: [{ text: "" }] }],
        {}
      )
      const result = await editor.portive.save()
      expect(result).toEqual({
        status: "success",
        value: [{ type: "paragraph", children: [{ text: "" }] }],
      })
    })

    it("should remove a node with an originKey that doesn't match", async () => {
      const editor = mockEditor(
        [
          {
            type: "attachment-block",
            originKey: "missing",
            filename: "hello.txt",
            bytes: 5,
            children: [{ text: "" }],
          },
        ],
        {}
      )
      const result = await editor.portive.save()
      expect(result).toEqual({ status: "success", value: [] })
    })
  })

  // describe("wait for promises to complete", () => {
  // })
})
