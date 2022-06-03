import { Transforms } from "slate"
import { FullPortiveEditor } from "./types"
import { resizeInside } from "./resize-inside"
import { nanoid } from "nanoid"
import { createClientFile, isHostedImage, uploadFile } from "~/lib/api"

async function getImageSize(url: string): Promise<[number, number]> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", function () {
      resolve([this.naturalWidth, this.naturalHeight])
    })
    image.addEventListener("error", function (e) {
      reject(e)
    })
    image.src = url
  })
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
  const { setOrigin } = portive.useStore.getState()

  const clientFile = await createClientFile(file)
  if (clientFile.type !== "image") {
    throw new Error(
      `Need to fix this later so clientFile image never gets to this part of the code`
    )
  }

  /**
   * Get Image size
   */
  const initialSize = resizeInside(
    clientFile.size[0],
    clientFile.size[1],
    portive.initialMaxSize[0],
    portive.initialMaxSize[1]
  )

  const url = clientFile.objectUrl

  // const template = {
  //   type: "image",
  //   url: clientFile.objectUrl,
  //   maxSize: clientFile.size,
  // } as const

  setOrigin(originKey, {
    url,
    status: "uploading",
    sentBytes: 0,
    totalBytes: file.size,
  })
  const element = portive.createImageFile({
    originKey: originKey,
    originSize: clientFile.size,
    file,
    clientFile,
    initialSize,
  })
  Transforms.insertNodes(editor, element)

  const uploadResult = await uploadFile({
    authToken: portive.authToken,
    path: portive.path,
    file,
    onProgress(e) {
      setOrigin(originKey, {
        url,
        status: "uploading",
        sentBytes: e.loaded,
        totalBytes: e.total,
      })
    },
  })

  if (uploadResult.status === "error") {
    setOrigin(originKey, {
      url,
      status: "error",
      message: uploadResult.message,
    })
    console.error(uploadResult.message)
    return
  }

  /**
   * Set image as uploaded but continue to use the local image URL
   */
  setOrigin(originKey, {
    url,
    status: "uploaded",
  })
  await getImageSize(uploadResult.data.url)
  /**
   * After `getImageSize` executes, we know that the uploaded file is now in
   * the cache so we can swap the local file for the remote file.
   */
  setOrigin(originKey, {
    url: uploadResult.data.url,
    status: "uploaded",
  })
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
  const { setOrigin } = portive.useStore.getState()

  const clientFile = await createClientFile(file)
  if (clientFile.type !== "generic") {
    throw new Error(`Expected clientFile.type to be generic`)
  }

  setOrigin(originKey, {
    status: "uploading",
    url: clientFile.objectUrl,
    sentBytes: 0,
    totalBytes: file.size,
  })
  const genericFileElement = portive.createGenericFile({
    originKey: originKey,
    file,
    clientFile,
  })
  Transforms.insertNodes(editor, genericFileElement)

  const uploadResult = await uploadFile({
    authToken: portive.authToken,
    path: portive.path,
    file,
    onProgress(e) {
      setOrigin(originKey, {
        status: "uploading",
        url: clientFile.objectUrl,
        sentBytes: e.loaded,
        totalBytes: e.total,
      })
    },
  })

  if (uploadResult.status === "error") {
    setOrigin(originKey, {
      status: "error",
      url: clientFile.objectUrl,
      message: uploadResult.message,
    })
    console.error(uploadResult.message)
    return
  }

  /**
   * Set file as uploaded with endpoint url. Unlike image, we set this
   * immediately.
   */
  setOrigin(originKey, {
    status: "uploaded",
    url: uploadResult.data.url,
  })
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
