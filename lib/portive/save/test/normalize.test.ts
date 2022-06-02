import { Descendant } from "slate"
import { normalizeOrigins } from ".."
import { Origin } from "../../types"

describe("normalize", () => {
  it("should normalize an originKey", async () => {
    const origins: Record<string, Origin> = {
      a: { status: "uploaded", url: "/fake.txt" },
    }
    const nodes = [{ originKey: "a" }] as Descendant[]
    const normalizedNodes = normalizeOrigins(nodes, origins)
    expect(normalizedNodes).toEqual([{ originKey: "/fake.txt" }])
  })

  it("should skip an element with origin still uploading", async () => {
    const origins: Record<string, Origin> = {
      a: {
        status: "uploading",
        url: "/fake.txt",
        sentBytes: 500,
        totalBytes: 1000,
      },
    }
    const nodes = [{ originKey: "a" }] as Descendant[]
    const normalizedNodes = normalizeOrigins(nodes, origins)
    expect(normalizedNodes).toEqual([])
  })

  it("should skip an element with origin in an error state", async () => {
    const origins: Record<string, Origin> = {
      a: {
        status: "error",
        message: "No Internet",
        url: "/fake.txt",
      },
    }
    const nodes = [{ originKey: "a" }] as Descendant[]
    const normalizedNodes = normalizeOrigins(nodes, origins)
    expect(normalizedNodes).toEqual([])
  })

  it("should normalize children", async () => {
    const origins: Record<string, Origin> = {
      a: { status: "uploaded", url: "/fake.txt" },
    }
    const nodes = [
      { children: [{ originKey: "a" }] },
    ] as unknown as Descendant[]
    const normalizedNodes = normalizeOrigins(nodes, origins)
    expect(normalizedNodes).toEqual([
      { children: [{ originKey: "/fake.txt" }] },
    ])
  })

  it("should not normalize children of an element that has an originKey", async () => {
    const origins: Record<string, Origin> = {
      a: { status: "uploaded", url: "/fake.txt" },
    }
    const nodes = [
      { originKey: "a", children: [{ originKey: "a" }] },
    ] as unknown as Descendant[]
    const normalizedNodes = normalizeOrigins(nodes, origins)
    expect(normalizedNodes).toEqual([
      { originKey: "/fake.txt", children: [{ originKey: "a" }] },
    ])
  })
})
