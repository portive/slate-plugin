import {
  // OnUploadImageEvent,
  FullCloudEditor,
  Upload,
  OriginEventTypes,
  OnUploadEvent,
  // OnUploadGenericEvent,
} from "../types"
// import { nanoid } from "nanoid"
import {
  createClientFile,
  resizeIn,
  // isHostedImage,
  // resizeIn,
  uploadFile,
} from "@portive/client"
// import { ClientFile } from "@portive/api-types"
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
  file,
}: {
  editor: FullCloudEditor
  file: File
}) {
  const clientFile = await createClientFile(file)
  const objectUrl = clientFile.objectUrl
  const { setUpload } = editor.cloud.useStore.getState()

  // save this for the file's URL which will be set in `onStart`
  let url: string | undefined

  /**
   * We create a deferredFinish which is an object with a `promise` and a way
   * to `resolve` or `reject` the Promise outside of the Promise. We use
   * `p-defer` library to do this. The `finish` Promise gets added to the
   * `upload` object so we can await `upload.finish` during the save process
   * to wait for all the files to finish uploading.
   */
  const deferredFinish = Defer<Upload>()
  const finishPromise = deferredFinish.promise

  /**
   * The purpose of adding an eventEmitter is to track progress of an `Upload`
   * that's in the middle of `uploading`. Specifically, before we `save` the
   * page, we may want to display the uploading progress of any files that
   * have not finished uploading. This will allow the user to know, and wait
   * for, the files to finish uploading.
   */
  const eventEmitter = new EventEmitter<OriginEventTypes>()

  /**
   * Start the actual upload progress and update the `origin` as to the
   * upload progress.
   */
  const uploadFinishEvent = await uploadFile({
    client: editor.cloud.client,
    file,
    onBeforeSend(e) {
      const event: OnUploadEvent =
        e.clientFile.type === "image"
          ? {
              type: "image",
              url: e.hostedFile.url,
              file: e.file,
              ...resizeIn(
                { width: e.clientFile.width, height: e.clientFile.height },
                editor.cloud.initialMaxSize
              ),
              maxWidth: e.clientFile.width,
              maxHeight: e.clientFile.height,
            }
          : {
              type: "generic",
              url: e.hostedFile.url,
              file: e.file,
            }
      editor.cloud.onUpload(event)
      url = e.hostedFile.url
      /**
       * Set the `origin` as `uploading` with zero bytes sent
       */
      setUpload(e.hostedFile.url, {
        url: objectUrl,
        status: "uploading",
        sentBytes: 0,
        totalBytes: file.size,
        eventEmitter,
        finishPromise,
      })
    },
    onProgress(e) {
      const upload: Upload = {
        url: objectUrl,
        status: "uploading",
        sentBytes: e.sentBytes,
        totalBytes: e.totalBytes,
        eventEmitter,
        finishPromise: finishPromise,
      }
      if (typeof url === "undefined") throw new Error(`This shouldn't happen`)
      setUpload(url, upload)
      eventEmitter.emit("progress", upload)
    },
  })

  /**
   * If there's an upload error, then we set it on the `origin`
   */
  if (uploadFinishEvent.type === "error") {
    const upload: Upload = {
      url: objectUrl,
      status: "error",
      message: uploadFinishEvent.message,
    }
    eventEmitter.emit("error", upload)
    deferredFinish.resolve(upload)
    console.error(uploadFinishEvent.message)
    if (url === undefined) return
    // This happens if error occurred before we got the upload policy.
    // Since this only happens when the error occurs before `onBeforeSend`
    // there won't be a `setUpload` call made which means it's not necessary
    // for us to update `setUpload` as below anyways.
    setUpload(url, upload)
    return
  }

  /**
   * Set file as `complete` with the final hosted URL
   */
  const upload: Upload = {
    status: "complete",
    url: uploadFinishEvent.hostedFile.url,
  }
  eventEmitter.emit("complete", upload)
  deferredFinish.resolve(upload)
  if (url === undefined) return
  setUpload(url, upload)
}

// /**
//  * This is the asynchronous part of `uploadHostedImage` that contains most of
//  * the meat of the function including uploading and setting the origin.
//  */
// async function uploadHostedImageFile(editor: FullCloudEditor, file: File) {
//   const cloud = editor.cloud

//   const clientFile = await createClientFile(file)
//   if (clientFile.type !== "image") {
//     throw new Error(
//       `Need to fix this later so clientFile image never gets to this part of the code`
//     )
//   }

//   /**
//    * Get initial image size
//    */
//   const initialSize = resizeIn(
//     { width: clientFile.width, height: clientFile.height },
//     cloud.initialMaxSize
//   )

//   const event: OnUploadImageEvent = {
//     type: "image",
//     url: url,
//     // originSize: clientFile.size,
//     file,
//     initialWidth: initialSize.width,
//     initialHeight: initialSize.height,
//     maxWidth: clientFile.width,
//     maxHeight: clientFile.height,
//     // initialSize,
//   }

//   editor.cloud.onUpload(event)

//   await startUploadSteps({
//     editor,
//     url,
//     file,
//     clientFile,
//   })
// }

// /**
//  * This is the asynchronous part of `uploadHostedImage` that contains most of
//  * the meat of the function including uploading and setting the origin.
//  */
// async function uploadHostedGenericFile(editor: FullCloudEditor, file: File) {
//   const clientFile = await createClientFile(file)
//   if (clientFile.type !== "generic") {
//     throw new Error(`Expected clientFile.type to be generic`)
//   }

//   const event: OnUploadGenericEvent = {
//     type: "generic",
//     url: url,
//     file,
//   }

//   editor.cloud.onUpload(event)

//   await startUploadSteps({
//     editor,
//     file,
//     clientFile,
//   })
// }

/**
 * This method starts the upload process. It creates a unique `id` which is
 * returned from the function. As the upload is progressing through its
 * upload stages, it is updating an `Origin` that is used to display the stage
 * of the upload in the editor. For example, how much upload progress there is
 * and when it's complete, sets the URL of the upload.
 */
export function upload(editor: FullCloudEditor, file: File): void {
  // prefix with a `#` to make it visually clear this is a lookup value
  startUploadSteps({ editor, file })
  // if (isHostedImage(file)) {
  //   uploadHostedImageFile(editor, file)
  // } else {
  //   uploadHostedGenericFile(editor, file)
  // }
}
