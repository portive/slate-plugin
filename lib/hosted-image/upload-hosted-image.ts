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
  const { setImage } = editor.useStore.getState()

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

  setImage(id, {
    type: "loading",
    url,
    viewSize,
    sentBytes: 0,
    totalBytes: file.size,
  })
  Transforms.insertNodes(editor, {
    type: "hosted-image",
    id,
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
    //       setUpload(file, {
    //         status: "error",
    //         message: `Could not access the upload API.
    // The most likely cause is that the API URL ${JSON.stringify(
    //           editor.uploadOptions.url
    //         )} is configured incorrectly.
    // The error is:
    // ${e}`,
    //       })
    return
  }
  await uploadFile({
    file,
    uploadUrl: policyResponse.data.data.apiUrl,
    formFields: policyResponse.data.data.formFields,
    onProgress(e) {
      setImage(id, {
        type: "loading",
        url,
        viewSize,
        sentBytes: e.loaded,
        totalBytes: e.total,
      })
    },
  })
  await getImageSize(policyResponse.data.data.fileUrl)
  setImage(id, {
    type: "uploaded",
    url: policyResponse.data.data.fileUrl,
    size: viewSize,
  })
}
