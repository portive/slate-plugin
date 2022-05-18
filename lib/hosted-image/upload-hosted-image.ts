import { Transforms } from "slate"
import axios, { AxiosResponse } from "axios"
import { uploadFile } from "./upload-file"
import { FullHostedEditor } from "./types"
import { resizeInside } from "./resize-inside"
import { UploadFileResponse, UploadProps } from "@portive/api-types"

const POLICY_URL = "http://localhost:3001/api/v1/upload"

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
  const upload = editor.hostedUpload
  let axiosResponse: AxiosResponse<UploadFileResponse>
  const { setEntity } = upload.useStore.getState()

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
    upload.defaultResize.width,
    upload.defaultResize.height
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
    const authTokenAsString =
      typeof upload.authToken === "function"
        ? await upload.authToken()
        : upload.authToken
    const uploadProps: UploadProps & { authToken: string } = {
      authToken: authTokenAsString,
      recordKey: "demo",
      file: {
        type: "image",
        filename: file.name,
        contentType: file.type,
        bytes: file.size,
        size: [originalWidth, originalHeight],
      },
    }
    axiosResponse = await axios.post(POLICY_URL, uploadProps)
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

  const policyResponse = axiosResponse.data

  if (policyResponse.status === "error") {
    const message = `Error getting upload Policy. The error is: ${policyResponse.message}`
    setEntity(id, {
      type: "error",
      url,
      maxSize: [originalWidth, originalHeight],
      message,
    })
    console.error(message)
    return
  }

  if (policyResponse.status === "fail") {
    const message = `Failed getting upload Policy. The error is: ${policyResponse.data.faults.join(
      ". "
    )}`
    setEntity(id, {
      type: "error",
      url,
      maxSize: [originalWidth, originalHeight],
      message,
    })
    console.error(message)
    return
  }

  await uploadFile({
    file,
    uploadUrl: policyResponse.data.apiUrl,
    formFields: policyResponse.data.formFields,
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
  await getImageSize(policyResponse.data.fileUrl)
  /**
   * After `getImageSize` executes, we know that the uploaded file is now in
   * the cache so we can swap the local file for the remote file.
   */
  setEntity(id, {
    type: "uploaded",
    url: policyResponse.data.fileUrl,
    maxSize: [originalWidth, originalHeight],
  })
}
