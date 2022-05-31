import { ImageEntity } from "~/lib/hosted-image"
import { Descendant } from "slate"

const PORTRAIT_IMAGE =
  "https://files.dev.portive.com/f/demo/ktjairhr4jy5i3qr6ow43--1920x2880.jpg"
const LANDSCAPE_IMAGE =
  "https://files.dev.portive.com/f/demo/4q494y5quamrcrwvce23n--1920x1281.jpg"
const SQUARE_IMAGE =
  "https://files.dev.portive.com/f/demo/hibbzu5uks7jrnl91yxei--1920x1920.jpg"
const ICON_IMAGE =
  "https://files.dev.portive.com/f/demo/qckv9tvtxqh76y0kncow6--40x40.png"

const IMAGE_PATH_REGEXP = /[/][a-zA-Z0-9]+--([0-9]+)x([0-9]+)[.][a-z]+/i

type HostedFileInfo = {
  type: "image"
  url: string
  originalSize: [number, number] // size of origin image on server
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
    originalSize: [width, height],
    currentSize: [width, height],
  }
}

export const images: Record<string, HostedFileInfo> = {
  portrait: getHostedImageInfo(PORTRAIT_IMAGE),
  landscape: getHostedImageInfo(LANDSCAPE_IMAGE),
  square: getHostedImageInfo(SQUARE_IMAGE),
  icon: getHostedImageInfo(ICON_IMAGE),
}

export type EntityKeys =
  | "icon"
  | "zero"
  | "half"
  | "full"
  | "uploaded"
  | "error"

export const initialEntities: Record<EntityKeys, ImageEntity> = {
  icon: {
    type: "uploaded",
    url: images.icon.url,
    maxSize: images.icon.originalSize,
  },
  zero: {
    type: "loading",
    url: images.landscape.url,
    sentBytes: 1000,
    totalBytes: 100000,
    maxSize: images.landscape.originalSize,
  },
  half: {
    type: "loading",
    url: images.landscape.url,
    sentBytes: 50000,
    totalBytes: 100000,
    maxSize: images.landscape.originalSize,
  },
  full: {
    type: "loading",
    url: images.landscape.url,
    maxSize: images.landscape.originalSize,
    sentBytes: 100000,
    totalBytes: 100000,
  },
  uploaded: {
    type: "uploaded",
    url: images.landscape.url,
    maxSize: images.landscape.originalSize,
  },
  error: {
    type: "error",
    url: images.landscape.url,
    maxSize: images.landscape.originalSize,
    message:
      "Error in API props validation: StructError: At path: file -- Expected the value to satisfy a union of `object | object`, but received: [object Object]",
  },
}

export const initialValue: Descendant[] = [
  { type: "paragraph", children: [{ text: "Small images can't be resized" }] },
  {
    type: "paragraph",
    children: [
      { text: "Image is inline " },
      {
        type: "inline-image",
        id: "icon",
        size: [40, 40],
        children: [{ text: "" }],
      },
      { text: " in the middle of text" },
    ],
  },
  {
    type: "block-image",
    id: "icon",
    size: [40, 40],
    children: [{ text: "" }],
  },
  { type: "paragraph", children: [{ text: "In progress uploads" }] },
  {
    type: "block-image",
    id: "zero",
    size: [256, 192],
    children: [{ text: "" }],
  },
  {
    type: "block-image",
    id: "half",
    size: [256, 192],
    children: [{ text: "" }],
  },
  {
    type: "block-image",
    id: "full",
    size: [256, 192],
    children: [{ text: "" }],
  },
  {
    type: "paragraph",
    children: [{ text: "Completed upload with entity id" }],
  },
  {
    type: "block-image",
    id: "uploaded",
    size: [256, 192],
    children: [{ text: "" }],
  },
  { type: "paragraph", children: [{ text: "Completed upload with URL id" }] },
  {
    type: "block-image",
    id: images.landscape.url,
    size: [256, 192],
    children: [{ text: "" }],
  },
  { type: "paragraph", children: [{ text: "Failed upload" }] },
  {
    type: "block-image",
    id: "error",
    size: [256, 192],
    children: [{ text: "" }],
  },
  { type: "paragraph", children: [{ text: "End of World" }] },
]
