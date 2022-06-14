import { Element, Location, Transforms } from "slate"
import {
  CreateImageFileElementEvent,
  FullPortiveEditor,
  Origin,
  OriginEventTypes,
  UploadFileOptions,
} from "./types"
import { nanoid } from "nanoid"
import {
  Client,
  createClientFile,
  isHostedImage,
  resizeIn,
  uploadFile,
} from "@portive/client"
import { ClientFile } from "@portive/api-types"
import EventEmitter from "eventemitter3"
import Defer from "p-defer"

/**
 * Executes the `uploadSteps`:
 *
 * - set the value on the `origin` to `uploading` to indicate start of uploading
 * - insert the initial element into the DOM
 * - Start the upload progress with AWS S3
 * - Update the `uploading` progress on the `origin` with `sentBytes`
 * - Set the `error` state if there is an upload failure
 * - Set the final upload status as `complete` and set the final `url` on the `origin`
 */
async function uploadSteps({
  editor,
  originKey,
  file,
  clientFile,
  element,
  at,
}: {
  editor: FullPortiveEditor
  originKey: string
  file: File
  clientFile: ClientFile
  element: Element & { originKey: string }
  at?: Location
}) {
  const { setOrigin } = editor.portive.useStore.getState()
  const url = clientFile.objectUrl

  /**
   * We create a deferredFinish which is an object with a `promise` and a way
   * to `resolve` or `reject` the Promise outside of the Promise. We use
   * `p-defer` library to do this. The `finish` Promise gets added to the
   * `origin` object so we can await `origin.finish` during the save process
   * to wait for all the files to finish uploading.
   */
  const deferredFinish = Defer<Origin>()
  const finishPromise = deferredFinish.promise

  /**
   * The purpose of adding an eventEmitter is to track progress of an `Origin`
   * that's in the middle of `uploading`. Specifically, before we `save` the
   * page, we may want to display the uploading progress of any files that
   * have not finished uploading. This will allow the user to know, and wait
   * for, the files to finish uploading.
   */
  const eventEmitter = new EventEmitter<OriginEventTypes>()

  /**
   * Set the `origin` as `uploading` with zero bytes sent
   */
  setOrigin(originKey, {
    url,
    status: "uploading",
    sentBytes: 0,
    totalBytes: file.size,
    eventEmitter,
    finishPromise,
  })

  /**
   * Insert the `element` (which includes an `originKey`).
   */
  Transforms.insertNodes(editor, element, { at })

  console.log({ apiOriginUrl: editor.portive.apiOriginUrl })

  const client = new Client({
    authToken: editor.portive.authToken,
    apiOrigin: editor.portive.apiOriginUrl,
  })

  /**
   * Start the actual upload progress and update the `origin` as to the
   * upload progress.
   */
  const uploadResult = await uploadFile({
    client,
    file,
    onProgress(e) {
      const origin: Origin = {
        url,
        status: "uploading",
        sentBytes: e.sentBytes,
        totalBytes: e.totalBytes,
        eventEmitter,
        finishPromise: finishPromise,
      }
      setOrigin(originKey, origin)
      eventEmitter.emit("progress", origin)
    },
  })

  /**
   * If there's an upload error, then we set it on the `origin`
   */
  if (uploadResult.status === "error") {
    const origin: Origin = {
      url,
      status: "error",
      message: uploadResult.message,
    }
    setOrigin(originKey, origin)
    eventEmitter.emit("error", origin)
    deferredFinish.resolve(origin)
    console.error(uploadResult.message)
    return
  }

  /**
   * Set file as `complete` with the final hosted URL
   */
  const origin: Origin = {
    url: uploadResult.data.url,
    status: "complete",
  }
  setOrigin(originKey, origin)
  eventEmitter.emit("complete", origin)
  deferredFinish.resolve(origin)
}

/**
 * This is the asynchronous part of `uploadHostedImage` that contains most of
 * the meat of the function including uploading and setting the origin.
 */
async function uploadHostedImage(
  editor: FullPortiveEditor,
  originKey: string,
  file: File,
  options: UploadFileOptions
) {
  const portive = editor.portive

  const clientFile = await createClientFile(file)
  if (clientFile.type !== "image") {
    throw new Error(
      `Need to fix this later so clientFile image never gets to this part of the code`
    )
  }

  /**
   * Get initial image size
   */
  const initialSize = resizeIn(clientFile.size, portive.initialMaxSize)

  const event: CreateImageFileElementEvent = {
    type: "image",
    originKey: originKey,
    originSize: clientFile.size,
    file,
    initialSize,
  }

  const element = portive.createImageFileElement
    ? portive.createImageFileElement(event)
    : portive.createFileElement(event)

  await uploadSteps({
    editor,
    originKey,
    file,
    clientFile,
    element,
    at: options.at,
  })
}

/**
 * This is the asynchronous part of `uploadHostedImage` that contains most of
 * the meat of the function including uploading and setting the origin.
 */
async function uploadHostedFile(
  editor: FullPortiveEditor,
  originKey: string,
  file: File,
  options: UploadFileOptions
) {
  const portive = editor.portive

  const clientFile = await createClientFile(file)
  if (clientFile.type !== "generic") {
    throw new Error(`Expected clientFile.type to be generic`)
  }

  const element = portive.createFileElement({
    type: "generic",
    originKey: originKey,
    file,
  })

  await uploadSteps({
    editor,
    originKey,
    file,
    clientFile,
    element,
    at: options.at,
  })
}

/**
 * This method starts the upload process. It creates a unique `id` which is
 * returned from the function. As the upload is progressing through its
 * upload stages, it is updating an `Origin` that is used to display the stage
 * of the upload in the editor. For example, how much upload progress there is
 * and when it's complete, sets the URL of the upload.
 */
export function upload(
  editor: FullPortiveEditor,
  file: File,
  options: UploadFileOptions = {}
): string {
  const id = nanoid()
  if (isHostedImage(file)) {
    uploadHostedImage(editor, id, file, options)
  } else {
    uploadHostedFile(editor, id, file, options)
  }
  return id
}
