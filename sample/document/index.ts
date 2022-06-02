import { FileOrigin } from "~/lib/hosted-image"
import { Descendant } from "slate"

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

export const initialOrigins: Record<string, FileOrigin> = {
  pdf: {
    status: "uploaded",
    type: "generic",
    url: PDF_FILE,
  },
  text: {
    status: "uploaded",
    type: "generic",
    url: TEXT_FILE,
  },
  zeroText: {
    status: "loading",
    type: "generic",
    url: TEXT_FILE,
    sentBytes: 0,
    totalBytes: 100000,
  },
  halfText: {
    status: "loading",
    type: "generic",
    url: TEXT_FILE,
    sentBytes: 50000,
    totalBytes: 100000,
  },
  fullText: {
    status: "loading",
    type: "generic",
    url: TEXT_FILE,
    sentBytes: 10000,
    totalBytes: 10000,
  },
  errorText: {
    status: "error",
    type: "generic",
    message:
      "Error in API props validation: StructError: At path: file -- Expected the value to satisfy a union of `object | object`, but received: [object Object]",
    url: TEXT_FILE,
  },
  icon: {
    status: "uploaded",
    type: "image",
    url: images.icon.url,
    maxSize: images.icon.originalSize,
  },
  zero: {
    status: "loading",
    type: "image",
    url: images.landscape.url,
    sentBytes: 0,
    totalBytes: 3541,
    maxSize: images.landscape.originalSize,
  },
  half: {
    status: "loading",
    type: "image",
    url: images.landscape.url,
    sentBytes: 1770,
    totalBytes: 3541,
    maxSize: images.landscape.originalSize,
  },
  full: {
    status: "loading",
    type: "image",
    url: images.landscape.url,
    maxSize: images.landscape.originalSize,
    sentBytes: 3541,
    totalBytes: 3541,
  },
  uploaded: {
    status: "uploaded",
    type: "image",
    url: images.landscape.url,
    maxSize: images.landscape.originalSize,
  },
  error: {
    status: "error",
    type: "image",
    url: images.landscape.url,
    maxSize: images.landscape.originalSize,
    message:
      "Error in API props validation: StructError: At path: file -- Expected the value to satisfy a union of `object | object`, but received: [object Object]",
  },
}

export const initialValue: Descendant[] = [
  { type: "paragraph", children: [{ text: "Generic files" }] },
  {
    type: "block-file",
    id: "pdf",
    filename: "sherlock-holmes.pdf",
    bytes: 771277,
    children: [{ text: "" }],
  },
  {
    type: "block-file",
    id: "text",
    filename: "lorem-ipsum.txt",
    bytes: 3541,
    children: [{ text: "" }],
  },
  {
    type: "block-file",
    id: "zeroText",
    filename: "lorem-ipsum.txt",
    bytes: 3541,
    children: [{ text: "" }],
  },
  {
    type: "block-file",
    id: "halfText",
    filename: "lorem-ipsum.txt",
    bytes: 3541,
    children: [{ text: "" }],
  },
  {
    type: "block-file",
    id: "fullText",
    filename: "lorem-ipsum.txt",
    bytes: 3541,
    children: [{ text: "" }],
  },
  {
    type: "block-file",
    id: "errorText",
    filename: "lorem-ipsum.txt",
    bytes: 3541,
    children: [{ text: "" }],
  },
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
      { text: " in the middle of text. Small images can't be resized." },
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
    children: [{ text: "Completed upload with origin id" }],
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
