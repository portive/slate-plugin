import { Transforms } from "slate"
// import { uploadFile } from "../shared/upload-file"
import { FullPortivedHostedImageEditor } from "./types"
import { resizeInside } from "./resize-inside"
import { nanoid } from "nanoid"
import { createClientFile, getUploadPolicy } from "~/lib/api"
import { uploadFile } from "~/lib/api"

async function getImageSize(url: string): Promise<[number, number]> {
  return new Promise((resolve) => {
    const image = new Image()
    image.addEventListener("load", function () {
      resolve([this.naturalWidth, this.naturalHeight])
    })
    image.src = url
  })
}

/**
 * This is the asynchronous part of `uploadHostedImage` that contains most of
 * the meat of the function including uploading and setting the entity.
 */
async function _uploadHostedImage(
  editor: FullPortivedHostedImageEditor,
  id: string,
  file: File
) {
  const upload = editor.hostedImage
  const { setEntity } = upload.useStore.getState()

  const clientFile = await createClientFile(file)
  if (clientFile.type !== "image") {
    throw new Error(
      `Need to fix this later so clientFile image never gets to this part of the code`
    )
  }

  /**
   * Get Image size
   */
  const initialPreviewSize = resizeInside(
    clientFile.size[0],
    clientFile.size[1],
    upload.defaultResize.width,
    upload.defaultResize.height
  )

  setEntity(id, {
    type: "loading",
    url: clientFile.objectUrl,
    maxSize: clientFile.size,
    sentBytes: 0,
    totalBytes: file.size,
  })
  Transforms.insertNodes(editor, {
    type: "block-image",
    id,
    size: initialPreviewSize,
    children: [{ text: "" }],
  })

  const uploadResult = await uploadFile({
    authToken: upload.authToken,
    path: upload.path,
    file,
    onProgress(e) {
      setEntity(id, {
        type: "loading",
        url: clientFile.objectUrl,
        maxSize: clientFile.size,
        sentBytes: e.loaded,
        totalBytes: e.total,
      })
    },
  })

  if (uploadResult.status === "error") {
    setEntity(id, {
      type: "error",
      url: clientFile.objectUrl,
      maxSize: clientFile.size,
      message: uploadResult.message,
    })
    console.error(uploadResult.message)
    return
  }

  /**
   * Set image as uploaded but continue to use the local image URL
   */
  setEntity(id, {
    type: "uploaded",
    url: uploadResult.data.url,
    maxSize: clientFile.size,
  })
  await getImageSize(uploadResult.data.url)
  /**
   * After `getImageSize` executes, we know that the uploaded file is now in
   * the cache so we can swap the local file for the remote file.
   */
  setEntity(id, {
    type: "uploaded",
    url: uploadResult.data.url,
    maxSize: clientFile.size,
  })
}

/**
 * This method starts the upload process. It creates a unique `id` which is
 * returned from the function. As the upload is progressing through its
 * upload stages, it is updating an `Entity` that is used to display the stage
 * of the upload in the editor. For example, how much upload progress there is
 * and when it's complete, sets the URL of the upload.
 */
export function uploadHostedImage(
  editor: FullPortivedHostedImageEditor,
  file: File
): string {
  const id = nanoid()
  _uploadHostedImage(editor, id, file)
  return id
}
