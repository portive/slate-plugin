import {
  CreateImageFileElementEvent,
  FullCloudEditor,
  Origin,
  OriginEventTypes,
  UploadFileOptions,
} from "./types"
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
import { Editor } from "slate"

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
  originKey,
  file,
  clientFile,
}: // element,
// at,
{
  editor: FullCloudEditor
  originKey: string
  file: File
  clientFile: ClientFile
  // element: Element & { originKey: string }
  // at?: Location
}) {
  const { setOrigin } = editor.cloud.useStore.getState()
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
   * Insert a block smartly at a location that makes sense wither `at` the
   * given location or, if `at` is `undefined`, then at the locaiton of  the
   * current selection.
   */
  // insertBlock(editor, element, at)

  /**
   * Start the actual upload progress and update the `origin` as to the
   * upload progress.
   */
  const uploadResult = await uploadFile({
    client: editor.cloud.client,
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
async function uploadHostedImageFile(
  editor: FullCloudEditor,
  originKey: string,
  file: File,
  options: UploadFileOptions
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
  const initialSize = resizeIn(clientFile.size, cloud.initialMaxSize)

  const event: CreateImageFileElementEvent = {
    type: "image",
    originKey: originKey,
    originSize: clientFile.size,
    file,
    initialSize,
    // at specified position, or if not specified, the current selection or
    // if no current selection at the top of the editor.
    at: options.at || editor.selection || Editor.start(editor, [0]),
  }

  editor.cloud.onUpload(event)

  // const element = cloud.createImageFileElement
  //   ? cloud.createImageFileElement(event)
  //   : cloud.createFileElement(event)

  await startUploadSteps({
    editor,
    originKey,
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
  originKey: string,
  file: File,
  options: UploadFileOptions
) {
  // const cloud = editor.cloud

  const clientFile = await createClientFile(file)
  if (clientFile.type !== "generic") {
    throw new Error(`Expected clientFile.type to be generic`)
  }

  editor.cloud.onUpload({
    type: "generic",
    originKey: originKey,
    file,
    // at specified position, or if not specified, the current selection or
    // if no current selection at the top of the editor.
    at: options.at || editor.selection || Editor.start(editor, [0]),
  })

  await startUploadSteps({
    editor,
    originKey,
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
export function upload(
  editor: FullCloudEditor,
  file: File,
  options: UploadFileOptions = {}
): string {
  const id = nanoid()
  if (isHostedImage(file)) {
    uploadHostedImageFile(editor, id, file, options)
  } else {
    uploadHostedGenericFile(editor, id, file, options)
  }
  return id
}
