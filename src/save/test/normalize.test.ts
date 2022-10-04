import { Descendant } from "slate"
import { normalizeOrigins } from ".."
import { Upload, OriginEventTypes, UploadProgress } from "../../types"
import EventEmitter from "eventemitter3"
import { FakePromise } from "fake-promise"
import { resolve } from "./test-utils"

describe("normalize", () => {
  it("should normalize an id", async () => {
    const origins: Record<string, Upload> = {
      a: { status: "complete", url: "/fake.txt" },
    }
    const nodes = [{ id: "a" }] as Descendant[]
    const normalizedNodes = normalizeOrigins(nodes, origins)
    expect(normalizedNodes).toEqual([{ id: "/fake.txt" }])
  })

  it("should skip an element with origin still uploading", async () => {
    const eventEmitter = new EventEmitter<OriginEventTypes>()
    const finishPromise = new FakePromise<Upload>()
    const origins: Record<string, UploadProgress> = {
      a: {
        status: "uploading",
        url: "/fake.txt",
        sentBytes: 500,
        totalBytes: 1000,
        eventEmitter,
        finishPromise,
      },
    }
    const nodes = [{ id: "a" }] as Descendant[]
    const normalizedNodes = normalizeOrigins(nodes, origins)
    expect(normalizedNodes).toEqual([])
    resolve(finishPromise)
  })

  it("should skip an element with origin in an error state", async () => {
    const origins: Record<string, Upload> = {
      a: {
        status: "error",
        message: "No Internet",
        url: "/fake.txt",
      },
    }
    const nodes = [{ id: "a" }] as Descendant[]
    const normalizedNodes = normalizeOrigins(nodes, origins)
    expect(normalizedNodes).toEqual([])
  })

  it("should normalize children", async () => {
    const origins: Record<string, Upload> = {
      a: { status: "complete", url: "/fake.txt" },
    }
    const nodes = [{ children: [{ id: "a" }] }] as unknown as Descendant[]
    const normalizedNodes = normalizeOrigins(nodes, origins)
    expect(normalizedNodes).toEqual([{ children: [{ id: "/fake.txt" }] }])
  })

  it("should not normalize children of an element that has an id", async () => {
    const origins: Record<string, Upload> = {
      a: { status: "complete", url: "/fake.txt" },
    }
    const nodes = [
      { id: "a", children: [{ id: "a" }] },
    ] as unknown as Descendant[]
    const normalizedNodes = normalizeOrigins(nodes, origins)
    expect(normalizedNodes).toEqual([
      { id: "/fake.txt", children: [{ id: "a" }] },
    ])
  })
})
