import { Upload, OriginEventTypes } from "../.."
import { FakePromise } from "fake-promise"
import EventEmitter from "eventemitter3"
import { UploadError, UploadComplete, UploadProgress } from "../../types"

const PORTRAIT_IMAGE =
  "https://files.dev.portive.com/f/demo/ktjairhr4jy5i3qr6ow43--1920x2880.jpg"
const LANDSCAPE_IMAGE =
  "https://files.dev.portive.com/f/demo/4q494y5quamrcrwvce23n--1920x1281.jpg"
const SQUARE_IMAGE =
  "https://files.dev.portive.com/f/demo/hibbzu5uks7jrnl91yxei--1920x1920.jpg"
const ICON_IMAGE =
  "https://files.dev.portive.com/f/demo/qckv9tvtxqh76y0kncow6--40x40.png"
const TEXT_FILE =
  "https://files.dev.portive.com/f/demo/jsyd2e136k4ki4i4f5sz7.txt"
const PDF_FILE =
  "https://files.dev.portive.com/f/demo/gxvst8tkd7ta0fmr4htp2.pdf"

const IMAGE_PATH_REGEXP = /[/][a-zA-Z0-9]+--([0-9]+)x([0-9]+)[.][a-z]+/i

type HostedFileInfo = {
  type: "image"
  url: string
  originSize: [number, number] // size of origin image on server
  currentSize: [number, number] // current size
}

function getHostedImageInfo(url: string | URL): HostedFileInfo {
  url = new URL(url)
  const match = url.pathname.match(IMAGE_PATH_REGEXP)
  if (match === null) throw new Error(`Expected url to match an Image URL`)
  const width = parseInt(match[1])
  const height = parseInt(match[2])
  return {
    type: "image",
    url: url.href,
    originSize: [width, height],
    currentSize: [width, height],
  }
}

export const images: Record<string, HostedFileInfo> = {
  portrait: getHostedImageInfo(PORTRAIT_IMAGE),
  landscape: getHostedImageInfo(LANDSCAPE_IMAGE),
  square: getHostedImageInfo(SQUARE_IMAGE),
  icon: getHostedImageInfo(ICON_IMAGE),
}

const _mockOrigins = {
  pdf: {
    status: "complete",
    url: PDF_FILE,
  },
  text: {
    status: "complete",
    url: TEXT_FILE,
  },
  icon: {
    status: "complete",
    url: images.icon.url,
  },
  landscape: {
    status: "uploading",
    url: images.landscape.url,
  },
} as const
type OriginKey = keyof typeof _mockOrigins
const mockOrigins: Record<
  OriginKey,
  Pick<Upload, "status" | "url">
> = _mockOrigins

export const mockOrigin = {
  get(key: OriginKey) {
    const origin = mockOrigins[key]
    if (origin == null) throw new Error(`Expected to find origin`)
    return origin
  },
  complete(key: OriginKey): UploadComplete {
    const origin = mockOrigin.get(key)
    return { ...origin, status: "complete" }
  },
  error(key: OriginKey): UploadError {
    const origin = mockOrigin.get(key)
    return { ...origin, status: "error", message: `Error` }
  },
  uploading(key: OriginKey, percentComplete: number): UploadProgress {
    const origin = mockOrigin.get(key)
    if (percentComplete < 0)
      throw new Error(`percentComplete must be 0 or more`)
    if (percentComplete > 1)
      throw new Error(`percentComplete must be 1 or less`)
    const eventEmitter = new EventEmitter<OriginEventTypes>()
    const finishPromise = new FakePromise<Upload>()
    return {
      ...origin,
      status: "uploading",
      sentBytes: 100000 * percentComplete,
      totalBytes: 100000,
      eventEmitter,
      finishPromise,
    }
  },
}
