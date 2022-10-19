import {
  OnUploadImageEvent,
  FullCloudEditor,
  Upload,
  OriginEventTypes,
  OnUploadGenericEvent,
} from "../types"
import { nanoid } from "nanoid"
import {
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
async function startUploadSteps({
  editor,
  id,
  file,
  clientFile,
}: {
  editor: FullCloudEditor
  id: string
  file: File
  clientFile: ClientFile
}) {
  const { setUpload: setOrigin } = editor.cloud.useStore.getState()
  const url = clientFile.objectUrl

  /**
   * We create a deferredFinish which is an object with a `promise` and a way
   * to `resolve` or `reject` the Promise outside of the Promise. We use
   * `p-defer` library to do this. The `finish` Promise gets added to the
   * `origin` object so we can await `origin.finish` during the save process
   * to wait for all the files to finish uploading.
   */
  const deferredFinish = Defer<Upload>()
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
  setOrigin(id, {
    url,
    status: "uploading",
    sentBytes: 0,
    totalBytes: file.size,
    eventEmitter,
    finishPromise,
  })

  /**
   * Start the actual upload progress and update the `origin` as to the
   * upload progress.
   */
  const uploadResult = await uploadFile({
    client: editor.cloud.client,
    file,
    onProgress(e) {
      const origin: Upload = {
        url,
        status: "uploading",
        sentBytes: e.sentBytes,
        totalBytes: e.totalBytes,
        eventEmitter,
        finishPromise: finishPromise,
      }
      setOrigin(id, origin)
      eventEmitter.emit("progress", origin)
    },
  })

  /**
   * If there's an upload error, then we set it on the `origin`
   */
  if (uploadResult.type === "error") {
    const origin: Upload = {
      url,
      status: "error",
      message: uploadResult.message,
    }
    setOrigin(id, origin)
    eventEmitter.emit("error", origin)
    deferredFinish.resolve(origin)
    console.error(uploadResult.message)
    return
  }

  /**
   * Set file as `complete` with the final hosted URL
   */
  const origin: Upload = {
    url: uploadResult.hostedFile.url,
    status: "complete",
  }
  setOrigin(id, origin)
  eventEmitter.emit("complete", origin)
  deferredFinish.resolve(origin)
}

/**
 * This is the asynchronous part of `uploadHostedImage` that contains most of
 * the meat of the function including uploading and setting the origin.
 */
async function uploadHostedImageFile(
  editor: FullCloudEditor,
  id: string,
  file: File
) {
  const cloud = editor.cloud

  const clientFile = await createClientFile(file)
  if (clientFile.type !== "image") {
    throw new Error(
      `Need to fix this later so clientFile image never gets to this part of the code`
    )
  }

  /**
   * Get initial image size
   */
  const initialSize = resizeIn(
    { width: clientFile.width, height: clientFile.height },
    cloud.initialMaxSize
  )

  const event: OnUploadImageEvent = {
    type: "image",
    id: id,
    // originSize: clientFile.size,
    file,
    initialWidth: initialSize.width,
    initialHeight: initialSize.height,
    maxWidth: clientFile.width,
    maxHeight: clientFile.height,
    // initialSize,
  }

  editor.cloud.onUpload(event)

  await startUploadSteps({
    editor,
    id,
    file,
    clientFile,
  })
}

/**
 * This is the asynchronous part of `uploadHostedImage` that contains most of
 * the meat of the function including uploading and setting the origin.
 */
async function uploadHostedGenericFile(
  editor: FullCloudEditor,
  id: string,
  file: File
) {
  const clientFile = await createClientFile(file)
  if (clientFile.type !== "generic") {
    throw new Error(`Expected clientFile.type to be generic`)
  }

  const event: OnUploadGenericEvent = {
    type: "generic",
    id: id,
    file,
  }

  editor.cloud.onUpload(event)

  await startUploadSteps({
    editor,
    id,
    file,
    clientFile,
  })
}

/**
 * This method starts the upload process. It creates a unique `id` which is
 * returned from the function. As the upload is progressing through its
 * upload stages, it is updating an `Origin` that is used to display the stage
 * of the upload in the editor. For example, how much upload progress there is
 * and when it's complete, sets the URL of the upload.
 */
export function upload(editor: FullCloudEditor, file: File): string {
  // prefix with a `#` to make it visually clear this is a lookup value
  const srcOrKey = `#${nanoid()}`
  if (isHostedImage(file)) {
    uploadHostedImageFile(editor, srcOrKey, file)
  } else {
    uploadHostedGenericFile(editor, srcOrKey, file)
  }
  return srcOrKey
}
