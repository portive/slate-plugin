import { Descendant } from "slate"
import { getUploadingOrigins } from "../get-uploading-origins"
import { mockOrigin } from "./mock-origin"
import { resolve } from "./test-utils"

describe("getUploadingOrigins", () => {
  it("should get uploading origins", async () => {
    const origins = {
      error: mockOrigin.error("landscape"),
      uploaded: mockOrigin.uploaded("landscape"),
      uploading1: mockOrigin.uploading("landscape", 0.25),
      uploading2: mockOrigin.uploading("landscape", 0.5),
      uploading3: mockOrigin.uploading("landscape", 0.75),
    }
    const value: Descendant[] = [
      {
        type: "block-quote",
        children: [
          { type: "min-origin", originKey: "error", children: [{ text: "" }] },
          {
            type: "min-origin",
            originKey: "uploaded",
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
          {
            type: "min-origin",
            originKey: "uploading3",
            children: [{ text: "" }],
          },
        ],
      },
    ]
    const uploadingOrigins = getUploadingOrigins(value, origins)
    expect(uploadingOrigins.length).toEqual(3)
    resolve(origins.uploading1.finishPromise)
    resolve(origins.uploading2.finishPromise)
    resolve(origins.uploading3.finishPromise)
  })
})
