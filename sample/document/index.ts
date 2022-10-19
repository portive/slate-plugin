import { Upload, OriginEventTypes } from "~/src"
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
const finishPromise = new Promise<Upload>(() => {
  /* empty */
})

export const initialOrigins: Record<string, Upload> = {
  pdf: {
    status: "complete",
    url: PDF_FILE,
  },
  text: {
    status: "complete",
    url: TEXT_FILE,
  },
  zeroText: {
    status: "uploading",
    url: TEXT_FILE,
    sentBytes: 0,
    totalBytes: 100000,
    eventEmitter,
    finishPromise,
  },
  halfText: {
    status: "uploading",
    url: TEXT_FILE,
    sentBytes: 50000,
    totalBytes: 100000,
    eventEmitter,
    finishPromise,
  },
  fullText: {
    status: "uploading",
    url: TEXT_FILE,
    sentBytes: 10000,
    totalBytes: 10000,
    eventEmitter,
    finishPromise,
  },
  errorText: {
    status: "error",
    message:
      "Error in API props validation: StructError: At path: file -- Expected the value to satisfy a union of `object | object`, but received: [object Object]",
    url: TEXT_FILE,
  },
  icon: {
    status: "complete",
    url: images.icon.url,
  },
  zero: {
    status: "uploading",
    url: images.landscape.url,
    sentBytes: 0,
    totalBytes: 3541,
    eventEmitter,
    finishPromise,
  },
  half: {
    status: "uploading",
    url: images.landscape.url,
    sentBytes: 1770,
    totalBytes: 3541,
    eventEmitter,
    finishPromise,
  },
  full: {
    status: "uploading",
    url: images.landscape.url,
    sentBytes: 3541,
    totalBytes: 3541,
    eventEmitter,
    finishPromise,
  },
  complete: {
    status: "complete",
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
    id: "pdf",
    filename: "sherlock-holmes.pdf",
    bytes: 771277,
    children: [{ text: "" }],
  },
  {
    type: "attachment-block",
    id: "text",
    filename: "lorem-ipsum.txt",
    bytes: 3541,
    children: [{ text: "" }],
  },
  {
    type: "attachment-block",
    id: "zeroText",
    filename: "lorem-ipsum.txt",
    bytes: 3541,
    children: [{ text: "" }],
  },
  {
    type: "attachment-block",
    id: "halfText",
    filename: "lorem-ipsum.txt",
    bytes: 3541,
    children: [{ text: "" }],
  },
  {
    type: "attachment-block",
    id: "fullText",
    filename: "lorem-ipsum.txt",
    bytes: 3541,
    children: [{ text: "" }],
  },
  {
    type: "attachment-block",
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
        type: "image-inline",
        url: "icon",
        width: 40,
        height: 40,
        maxWidth: images.icon.originSize[0],
        maxHeight: images.icon.originSize[1],
        children: [{ text: "" }],
      },
      { text: " in the middle of text. Small images can't be resized." },
    ],
  },
  {
    type: "image-block",
    url: "icon",
    width: 40,
    height: 40,
    maxWidth: images.icon.originSize[0],
    maxHeight: images.icon.originSize[1],
    children: [{ text: "" }],
  },
  { type: "paragraph", children: [{ text: "In progress uploads" }] },
  {
    type: "image-block",
    url: "zero",
    width: 256,
    height: 171,
    maxWidth: images.landscape.originSize[0],
    maxHeight: images.landscape.originSize[1],
    children: [{ text: "" }],
  },
  {
    type: "image-block",
    url: "half",
    width: 256,
    height: 171,
    maxWidth: images.landscape.originSize[0],
    maxHeight: images.landscape.originSize[1],
    children: [{ text: "" }],
  },
  {
    type: "image-block",
    url: "full",
    width: 256,
    height: 171,
    maxWidth: images.landscape.originSize[0],
    maxHeight: images.landscape.originSize[1],
    children: [{ text: "" }],
  },
  {
    type: "paragraph",
    children: [{ text: "Completed upload with origin id" }],
  },
  {
    type: "image-block",
    url: "complete",
    width: 256,
    height: 171,
    maxWidth: images.landscape.originSize[0],
    maxHeight: images.landscape.originSize[1],
    children: [{ text: "" }],
  },
  { type: "paragraph", children: [{ text: "Completed upload with URL id" }] },
  {
    type: "image-block",
    url: images.landscape.url,
    width: 256,
    height: 171,
    maxWidth: images.landscape.originSize[0],
    maxHeight: images.landscape.originSize[1],
    children: [{ text: "" }],
  },
  { type: "paragraph", children: [{ text: "Failed upload" }] },
  {
    type: "image-block",
    url: "error",
    width: 256,
    height: 171,
    maxWidth: images.landscape.originSize[0],
    maxHeight: images.landscape.originSize[1],
    children: [{ text: "" }],
  },
  { type: "paragraph", children: [{ text: "Titled image block" }] },
  {
    type: "titled-image-block",
    title: "This is titled",
    url: "complete",
    width: 256,
    height: 171,
    maxWidth: images.landscape.originSize[0],
    maxHeight: images.landscape.originSize[1],
    children: [{ text: "" }],
  },
  { type: "paragraph", children: [{ text: "End of World" }] },
]
