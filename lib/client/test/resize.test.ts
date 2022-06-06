import { resizeIn, resizeInWidth, resizeInHeight } from "../resize"

describe("resize", () => {
  describe("resizeIn", () => {
    it("should leave an image in bounds alone", async () => {
      const size = resizeIn([500, 500], [1000, 1000])
      expect(size).toEqual([500, 500])
    })

    it("should constrain by width", async () => {
      const size = resizeIn([2000, 500], [1000, 500])
      expect(size).toEqual([1000, 250])
    })

    it("should constrain by height", async () => {
      const size = resizeIn([2000, 500], [1000, 200])
      expect(size).toEqual([800, 200])
    })
    it("should throw if width is too small", async () => {
      expect(() => resizeIn([-1, 1000], [1000, 1000])).toThrow(
        "width must be greater than 0"
      )
    })
    it("should throw if height is too small", async () => {
      expect(() => resizeIn([1000, -1], [1000, 1000])).toThrow(
        "height must be greater than 0"
      )
    })
    it("should throw if bounds width is too small", async () => {
      expect(() => resizeIn([1000, 1000], [-1, 1000])).toThrow(
        "bounds width must be greater than 0"
      )
    })
    it("should throw if bounds height is too small", async () => {
      expect(() => resizeIn([1000, 1000], [1000, -1])).toThrow(
        "bounds height must be greater than 0"
      )
    })
  })

  describe("resizeInWidth", () => {
    it("should leave an image in width alone", async () => {
      const size = resizeInWidth([500, 250], 1000)
      expect(size).toEqual([500, 250])
    })

    it("should constrain by width", async () => {
      const size = resizeInWidth([500, 250], 250)
      expect(size).toEqual([250, 125])
    })
  })

  describe("resizeInHeight", () => {
    it("should leave an image in height alone", async () => {
      const size = resizeInWidth([500, 250], 500)
      expect(size).toEqual([500, 250])
    })

    it("should constrain by height", async () => {
      const size = resizeInHeight([500, 250], 125)
      expect(size).toEqual([250, 125])
    })
  })
})
