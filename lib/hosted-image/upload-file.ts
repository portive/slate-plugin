import axios from "axios"

type ProgressEvent = { loaded: number; total: number; file: File }

/**
 * Uploads the file to the actual endpoint.
 *
 * Takes a file field and a `policy` generated using `server.ts` and uploads
 * that file to Amazon S3.
 */
export async function uploadFile({
  file,
  uploadUrl,
  formFields,
  onProgress,
}: {
  file: File
  uploadUrl: string
  formFields: Record<string, string>
  onProgress?: (e: ProgressEvent) => void
}): Promise<boolean> {
  // upload file to Amazon
  const form = new FormData()
  for (const [key, value] of Object.entries(formFields)) {
    form.append(key, value)
  }
  // Object.entries(formFields).forEach(([key, value]: [string, any]) => {
  //   form.append(key, value)
  // })
  form.append("content-type", file.type)
  form.append("file", file)

  /**
   * Post to S3 with a callback for returning progress
   */
  const uploadResponse = await axios.post(uploadUrl, form, {
    onUploadProgress(e) {
      if (onProgress == null) return
      onProgress({ file, loaded: e.loaded, total: e.total })
    },
  })
  if (uploadResponse.status === 204) {
    return true
  } else {
    throw new Error(
      `Error during upload ${JSON.stringify(uploadResponse.data, null, 2)}`
    )
  }
}
