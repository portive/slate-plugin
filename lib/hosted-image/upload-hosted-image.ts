import { Transforms } from "slate"
import axios, { AxiosResponse } from "axios"
import { uploadFile } from "./upload-file"
import { FullHostedEditor } from "./types"
import { UploadPolicy } from "./types"
import { resizeInside } from "./resize-inside"

const POLICY_URL = "http://localhost:3001/api/v1/upload/demo"

async function getImageSize(url: string): Promise<[number, number]> {
  return new Promise((resolve) => {
    const image = new Image()
    image.addEventListener("load", function () {
      resolve([this.naturalWidth, this.naturalHeight])
    })
    image.src = url
  })
}

export async function uploadHostedImage(
  editor: FullHostedEditor,
  id: string,
  file: File
) {
  let policyResponse: AxiosResponse<UploadPolicy>
  const { setEntity } = editor.useStore.getState()

  /**
   * Create temporary Image URL
   */
  const url = URL.createObjectURL(file)

  /**
   * Get Image size
   */
  const [originalWidth, originalHeight] = await getImageSize(url)
  const viewSize = resizeInside(
    originalWidth,
    originalHeight,
    editor.defaultResize.width,
    editor.defaultResize.height
  )

  setEntity(id, {
    type: "loading",
    url,
    maxSize: [originalWidth, originalHeight],
    sentBytes: 0,
    totalBytes: file.size,
  })
  Transforms.insertNodes(editor, {
    type: "block-image",
    id,
    size: viewSize,
    children: [{ text: "" }],
  })
  try {
    policyResponse = await axios.post(POLICY_URL, {
      type: "demo",
      file: {
        type: "generic",
        filename: file.name,
        bytes: file.size,
      },
    })
  } catch (e) {
    setEntity(id, {
      type: "error",
      url,
      maxSize: [originalWidth, originalHeight],
      message: `Could not access the upload API. The error is: ${e}`,
    })
    console.error(e)
    return
  }
  await uploadFile({
    file,
    uploadUrl: policyResponse.data.data.apiUrl,
    formFields: policyResponse.data.data.formFields,
    onProgress(e) {
      setEntity(id, {
        type: "loading",
        url,
        maxSize: [originalWidth, originalHeight],
        sentBytes: e.loaded,
        totalBytes: e.total,
      })
    },
  })
  /**
   * Set image as uploaded but continue to use the local image URL
   */
  setEntity(id, {
    type: "uploaded",
    url,
    maxSize: [originalWidth, originalHeight],
  })
  await getImageSize(policyResponse.data.data.fileUrl)
  /**
   * After `getImageSize` executes, we know that the uploaded file is now in
   * the cache so we can swap the local file for the remote file.
   */
  setEntity(id, {
    type: "uploaded",
    url: policyResponse.data.data.fileUrl,
    maxSize: [originalWidth, originalHeight],
  })
}
