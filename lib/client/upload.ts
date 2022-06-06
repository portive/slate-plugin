import axios, { AxiosResponse } from "axios"
import {
  ClientFile,
  HostedFileInfo,
  JSendError,
  JSendSuccess,
  UploadFileResponse,
  UploadProps,
} from "@portive/api-types"
import { Promisable } from "type-fest"
import { createClientFile } from "./create-client-file"
import { UploadProgressEvent } from "./types"
export * from "./create-client-file"
export * from "./resize"

const DEFAULT_ORIGIN_URL = "http://api.portive.com"
const UPLOAD_PATH = "/api/v1/upload"

if (!UPLOAD_PATH.startsWith("/"))
  throw new Error("UPLOAD_PATH should start with a '/'")

async function normalizeAuthToken(
  authToken: string | (() => Promisable<string>)
): Promise<string> {
  if (typeof authToken === "string") return authToken
  return await authToken()
}

async function getUploadPolicy({
  authToken,
  apiOriginUrl = DEFAULT_ORIGIN_URL,
  path,
  file,
}: {
  authToken: string | (() => Promisable<string>)
  apiOriginUrl?: string
  path: string
  file: File | ClientFile
}): Promise<UploadFileResponse> {
  try {
    if (apiOriginUrl.endsWith("/"))
      throw new Error("apiOriginUrl should not end with a '/'")

    const clientFile = await createClientFile(file)

    const apiGetPolicyUrl = `${apiOriginUrl}${UPLOAD_PATH}`

    const {
      // disable to allow eating a property
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      objectUrl: $1,
      // disable to allow eating a property
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      file: $2,
      ...clientFileInfo
    } = clientFile

    const uploadProps: UploadProps = {
      authToken: await normalizeAuthToken(authToken),
      path,
      clientFileInfo,
    }
    const axiosResponse: AxiosResponse<UploadFileResponse> = await axios.post(
      apiGetPolicyUrl,
      uploadProps
    )
    return axiosResponse.data
  } catch (e) {
    return {
      status: "error",
      message: `Error during getUploadPolicy. ${e}`,
    }
  }
}

export async function uploadFile({
  authToken,
  apiOriginUrl = DEFAULT_ORIGIN_URL,
  path,
  file,
  onProgress,
}: {
  authToken: string | (() => Promisable<string>)
  apiOriginUrl?: string
  path: string
  file: File | ClientFile
  onProgress?: (e: UploadProgressEvent) => void
}): Promise<JSendError | JSendSuccess<HostedFileInfo>> {
  const clientFile = await createClientFile(file)

  const uploadPolicyResponse = await getUploadPolicy({
    authToken,
    apiOriginUrl,
    path,
    file,
  })

  if (uploadPolicyResponse.status === "error") {
    return uploadPolicyResponse
  }

  const { formFields, apiUrl: uploadUrl, fileUrl } = uploadPolicyResponse.data

  // upload file to Amazon
  const form = new FormData()
  for (const [key, value] of Object.entries(formFields)) {
    form.append(key, value)
  }
  form.append("content-type", file.type)
  form.append("file", clientFile.file)

  /**
   * Post to S3 with a callback for returning progress
   */
  const uploadResponse = await axios.post(uploadUrl, form, {
    onUploadProgress(e) {
      if (onProgress == null) return
      onProgress({
        clientFile,
        file: clientFile.file,
        sentBytes: e.loaded,
        totalBytes: e.total,
      })
    },
  })
  if (uploadResponse.status !== 204) {
    return {
      status: "error",
      message: `Error during upload ${JSON.stringify(
        uploadResponse.data,
        null,
        2
      )}`,
    }
  }
  const hostedFileInfo: HostedFileInfo =
    clientFile.type === "image"
      ? {
          type: "image",
          size: clientFile.size,
          url: fileUrl,
        }
      : {
          type: "generic",
          url: fileUrl,
        }
  return {
    status: "success",
    data: hostedFileInfo,
  }
}
