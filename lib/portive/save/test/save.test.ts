/* eslint-disable @typescript-eslint/no-explicit-any */
import { Descendant, createEditor } from "slate"
import { withReact } from "slate-react"
import { withPortive } from "~/lib/portive"
import { withHistory } from "slate-history"
import { FullPortiveEditor, Origin } from "../../types"
import "~/editor/types" // use the types from our demo editor for testing
import { mockOrigin } from "./mock-origin"
import { createOriginStore } from "../../origin-store"
import { resolve } from "./test-utils"

function mockEditor(
  value: Descendant[],
  origins: Record<string, Origin>
): FullPortiveEditor {
  const editor = withPortive(withReact(withHistory(createEditor())), {
    authToken: "", // we won't be uploading
    path: "test",
    initialMaxSize: [320, 320],
    minResizeWidth: 100,
    maxResizeWidth: 640,
    initialOrigins: origins,
    createElement: {} as any, // we won't be testing this
  })
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
  console.log(JSON.stringify(x, null, 2))
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
        status: "complete",
        value: [{ type: "paragraph", children: [{ text: "" }] }],
      })
    })

    it("should remove a node with an originKey that doesn't match", async () => {
      const editor = mockEditor(
        [
          {
            type: "min-origin",
            originKey: "missing",
            children: [{ text: "" }],
          },
        ],
        {}
      )
      const result = await editor.portive.save()
      expect(result).toEqual({ status: "complete", value: [] })
    })
  })

  describe("wait for promises to complete", () => {
    it("should timeout if uploads are not complete before timeout", async () => {
      const origins = {
        error: mockOrigin.error("landscape"),
        complete: mockOrigin.complete("landscape"),
        uploading1: mockOrigin.uploading("landscape", 0.25),
        uploading2: mockOrigin.uploading("landscape", 0.5),
      }
      const editor = mockEditor(
        [
          {
            type: "min-origin",
            originKey: "error",
            children: [{ text: "" }],
          },
          {
            type: "min-origin",
            originKey: "complete",
            children: [{ text: "" }],
          },
          {
            type: "min-origin",
            originKey: "uploading1",
            children: [{ text: "" }],
          },
          {
            type: "min-origin",
            originKey: "uploading2",
            children: [{ text: "" }],
          },
        ],
        origins
      )
      const result = await editor.portive.save({ maxTimeoutInMs: 10 })
      expect(result).toEqual({
        status: "timeout",
        value: [
          {
            type: "min-origin",
            originKey:
              "https://files.dev.portive.com/f/demo/4q494y5quamrcrwvce23n--1920x1281.jpg",
            children: [{ text: "" }],
          },
        ],
        finishes: expect.any(Array),
      })
      resolve(origins.uploading1.finishPromise)
      resolve(origins.uploading2.finishPromise)
    })

    it("should wait until upload is complete then save", async () => {
      const origins = {
        error: mockOrigin.error("landscape"),
        complete: mockOrigin.complete("landscape"),
        uploading1: mockOrigin.uploading("landscape", 0.25),
        uploading2: mockOrigin.uploading("landscape", 0.5),
      }
      const editor = mockEditor(
        [
          {
            type: "min-origin",
            originKey: "error",
            children: [{ text: "" }],
          },
          {
            type: "min-origin",
            originKey: "complete",
            children: [{ text: "" }],
          },
          {
            type: "min-origin",
            originKey: "uploading1",
            children: [{ text: "" }],
          },
          {
            type: "min-origin",
            originKey: "uploading2",
            children: [{ text: "" }],
          },
        ],
        origins
      )
      const { setOrigin } = editor.portive.useStore.getState()
      const promise = editor.portive.save()
      setOrigin("uploading1", mockOrigin.complete("landscape"))
      resolve(origins.uploading1.finishPromise)
      setOrigin("uploading2", mockOrigin.complete("landscape"))
      resolve(origins.uploading2.finishPromise)

      const result = await promise
      /**
       * Should contain 3 origin elements
       */
      expect(result.value.length).toEqual(3)
      /**
       * With these values
       */
      expect(result).toEqual({
        status: "complete",
        value: [
          {
            type: "min-origin",
            originKey:
              "https://files.dev.portive.com/f/demo/4q494y5quamrcrwvce23n--1920x1281.jpg",
            children: [
              {
                text: "",
              },
            ],
          },
          {
            type: "min-origin",
            originKey:
              "https://files.dev.portive.com/f/demo/4q494y5quamrcrwvce23n--1920x1281.jpg",
            children: [
              {
                text: "",
              },
            ],
          },
          {
            type: "min-origin",
            originKey:
              "https://files.dev.portive.com/f/demo/4q494y5quamrcrwvce23n--1920x1281.jpg",
            children: [
              {
                text: "",
              },
            ],
          },
        ],
      })
    })
  })
})
