import { Element, Transforms } from "slate"
import { FullPortiveEditor, Origin, OriginEventTypes } from "./types"
import { resizeInside } from "./resize-inside"
import { nanoid } from "nanoid"
import { createClientFile, isHostedImage, uploadFile } from "~/lib/api"
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
 * - Set the final upload status as `uploaded` and set the final `url` on the `origin`
 */
async function uploadSteps({
  editor,
  originKey,
  file,
  clientFile,
  element,
}: {
  editor: FullPortiveEditor
  originKey: string
  file: File
  clientFile: ClientFile
  element: Element & { originKey: string }
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
  const finish = deferredFinish.promise

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
    finish,
  })

  /**
   * Insert the `element` (which includes an `originKey`).
   */
  Transforms.insertNodes(editor, element)

  /**
   * Start the actual upload progress and update the `origin` as to the
   * upload progress.
   */
  const uploadResult = await uploadFile({
    authToken: editor.portive.authToken,
    path: editor.portive.path,
    file,
    onProgress(e) {
      const origin: Origin = {
        url,
        status: "uploading",
        sentBytes: e.loaded,
        totalBytes: e.total,
        eventEmitter,
        finish,
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
   * Set file as `uploaded` with the final hosted URL
   */
  const origin: Origin = {
    url: uploadResult.data.url,
    status: "uploaded",
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
  file: File
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
  const initialSize = resizeInside(
    clientFile.size[0],
    clientFile.size[1],
    portive.initialMaxSize[0],
    portive.initialMaxSize[1]
  )

  const element = portive.createImageFile({
    originKey: originKey,
    originSize: clientFile.size,
    file,
    clientFile,
    initialSize,
  })

  await uploadSteps({ editor, originKey, file, clientFile, element })
}

/**
 * This is the asynchronous part of `uploadHostedImage` that contains most of
 * the meat of the function including uploading and setting the origin.
 */
async function uploadHostedFile(
  editor: FullPortiveEditor,
  originKey: string,
  file: File
) {
  const portive = editor.portive

  const clientFile = await createClientFile(file)
  if (clientFile.type !== "generic") {
    throw new Error(`Expected clientFile.type to be generic`)
  }

  const element = portive.createGenericFile({
    originKey: originKey,
    file,
    clientFile,
  })

  await uploadSteps({ editor, originKey, file, clientFile, element })
}

/**
 * This method starts the upload process. It creates a unique `id` which is
 * returned from the function. As the upload is progressing through its
 * upload stages, it is updating an `Origin` that is used to display the stage
 * of the upload in the editor. For example, how much upload progress there is
 * and when it's complete, sets the URL of the upload.
 */
export function upload(editor: FullPortiveEditor, file: File): string {
  const id = nanoid()
  if (isHostedImage(file)) {
    uploadHostedImage(editor, id, file)
  } else {
    uploadHostedFile(editor, id, file)
  }
  return id
}