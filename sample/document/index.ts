import { Origin, OriginEventTypes } from "~/lib/portive"
import { Descendant } from "slate"
import EventEmitter from "eventemitter3"

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

/**
 * A fake `eventTarget`. Normally, you can add listeners to this `eventTarget`
 * and then listen for progress events. For this demo, we won't actually
 * dispatch any events so we just share the same `eventTarget`.
 */
const eventEmitter = new EventEmitter<OriginEventTypes>()
const finish = new Promise<Origin>(() => {
  /* empty */
})

export const initialOrigins: Record<string, Origin> = {
  pdf: {
    status: "uploaded",
    url: PDF_FILE,
  },
  text: {
    status: "uploaded",
    url: TEXT_FILE,
  },
  zeroText: {
    status: "uploading",
    url: TEXT_FILE,
    sentBytes: 0,
    totalBytes: 100000,
    eventEmitter,
    finish,
  },
  halfText: {
    status: "uploading",
    url: TEXT_FILE,
    sentBytes: 50000,
    totalBytes: 100000,
    eventEmitter,
    finish,
  },
  fullText: {
    status: "uploading",
    url: TEXT_FILE,
    sentBytes: 10000,
    totalBytes: 10000,
    eventEmitter,
    finish,
  },
  errorText: {
    status: "error",
    message:
      "Error in API props validation: StructError: At path: file -- Expected the value to satisfy a union of `object | object`, but received: [object Object]",
    url: TEXT_FILE,
  },
  icon: {
    status: "uploaded",
    url: images.icon.url,
  },
  zero: {
    status: "uploading",
    url: images.landscape.url,
    sentBytes: 0,
    totalBytes: 3541,
    eventEmitter,
    finish,
  },
  half: {
    status: "uploading",
    url: images.landscape.url,
    sentBytes: 1770,
    totalBytes: 3541,
    eventEmitter,
    finish,
  },
  full: {
    status: "uploading",
    url: images.landscape.url,
    sentBytes: 3541,
    totalBytes: 3541,
    eventEmitter,
    finish,
  },
  uploaded: {
    status: "uploaded",
    url: images.landscape.url,
  },
  error: {
    status: "error",
    url: images.landscape.url,
    message:
      "Error in API props validation: StructError: At path: file -- Expected the value to satisfy a union of `object | object`, but received: [object Object]",
  },
}

export const initialValue: Descendant[] = [
  { type: "paragraph", children: [{ text: "Generic files" }] },
  {
    type: "attachment-block",
    originKey: "pdf",
    filename: "sherlock-holmes.pdf",
    bytes: 771277,
    children: [{ text: "" }],
  },
  {
    type: "attachment-block",
    originKey: "text",
    filename: "lorem-ipsum.txt",
    bytes: 3541,
    children: [{ text: "" }],
  },
  {
    type: "attachment-block",
    originKey: "zeroText",
    filename: "lorem-ipsum.txt",
    bytes: 3541,
    children: [{ text: "" }],
  },
  {
    type: "attachment-block",
    originKey: "halfText",
    filename: "lorem-ipsum.txt",
    bytes: 3541,
    children: [{ text: "" }],
  },
  {
    type: "attachment-block",
    originKey: "fullText",
    filename: "lorem-ipsum.txt",
    bytes: 3541,
    children: [{ text: "" }],
  },
  {
    type: "attachment-block",
    originKey: "errorText",
    filename: "lorem-ipsum.txt",
    bytes: 3541,
    children: [{ text: "" }],
  },
  {
    type: "paragraph",
    children: [
      { text: "Image is inline " },
      {
        type: "image-inline",
        originKey: "icon",
        originSize: images.icon.originSize,
        size: [40, 40],
        children: [{ text: "" }],
      },
      { text: " in the middle of text. Small images can't be resized." },
    ],
  },
  {
    type: "image-block",
    originKey: "icon",
    originSize: images.icon.originSize,
    size: [40, 40],
    children: [{ text: "" }],
  },
  { type: "paragraph", children: [{ text: "In progress uploads" }] },
  {
    type: "image-block",
    originKey: "zero",
    originSize: images.landscape.originSize,
    size: [256, 192],
    children: [{ text: "" }],
  },
  {
    type: "image-block",
    originKey: "half",
    originSize: images.landscape.originSize,
    size: [256, 192],
    children: [{ text: "" }],
  },
  {
    type: "image-block",
    originKey: "full",
    originSize: images.landscape.originSize,
    size: [256, 192],
    children: [{ text: "" }],
  },
  {
    type: "paragraph",
    children: [{ text: "Completed upload with origin id" }],
  },
  {
    type: "image-block",
    originKey: "uploaded",
    originSize: images.landscape.originSize,
    size: [256, 192],
    children: [{ text: "" }],
  },
  { type: "paragraph", children: [{ text: "Completed upload with URL id" }] },
  {
    type: "image-block",
    originKey: images.landscape.url,
    originSize: images.landscape.originSize,
    size: [256, 192],
    children: [{ text: "" }],
  },
  { type: "paragraph", children: [{ text: "Failed upload" }] },
  {
    type: "image-block",
    originKey: "error",
    originSize: images.landscape.originSize,
    size: [256, 192],
    children: [{ text: "" }],
  },
  { type: "paragraph", children: [{ text: "End of World" }] },
]
