import axios, { AxiosResponse } from "axios"
import {
  ClientFile,
  ClientGenericFile,
  ClientImageFile,
  HostedFileInfo,
  JSendError,
  JSendSuccess,
  UploadFileResponse,
  UploadProps,
} from "@portive/api-types"

const POLICY_URL = "http://localhost:3001/api/v1/upload"

async function normalizeAuthToken(
  authToken: string | (() => Promise<string>)
): Promise<string> {
  if (typeof authToken === "string") return authToken
  return await authToken()
}

export function isHostedImage(file: File): boolean {
  return SUPPORTED_IMAGE_TYPES.includes(file.type)
}

async function getImageSize(url: string): Promise<[number, number]> {
  return new Promise((resolve) => {
    const image = new Image()
    image.addEventListener("load", function () {
      resolve([this.naturalWidth, this.naturalHeight])
    })
    image.src = url
  })
}

const SUPPORTED_IMAGE_TYPES = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]

const CLIENT_FILE_MAP = new WeakMap<File, ClientFile>()

export async function createClientFile(
  file: File | ClientFile
): Promise<ClientFile> {
  if (!(file instanceof File)) return file
  const cachedClientFile = CLIENT_FILE_MAP.get(file)
  if (cachedClientFile !== undefined) {
    return cachedClientFile
  }
  const objectUrl = URL.createObjectURL(file)
  if (isHostedImage(file)) {
    const size = await getImageSize(objectUrl)
    const clientImageFile: ClientImageFile = {
      type: "image",
      filename: file.name,
      contentType: file.type,
      bytes: file.size,
      size,
      file,
      objectUrl,
    }
    CLIENT_FILE_MAP.set(file, clientImageFile)
    return clientImageFile
  } else {
    const clientGenericFile: ClientGenericFile = {
      type: "generic",
      filename: file.name,
      contentType: file.type,
      bytes: file.size,
      file,
      objectUrl,
    }
    CLIENT_FILE_MAP.set(file, clientGenericFile)
    return clientGenericFile
  }
}

export async function getUploadPolicy({
  authToken,
  path,
  file,
  apiUrl = POLICY_URL,
}: {
  authToken: string | (() => Promise<string>)
  path: string
  file: File | ClientFile
  apiUrl?: string
}): Promise<UploadFileResponse> {
  try {
    const clientFile = await createClientFile(file)

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
      POLICY_URL,
      uploadProps
    )
    return axiosResponse.data
  } catch (e) {
    return {
      status: "error",
      message: `Error during uploadImage. The error is: ${e}`,
    }
  }
}

type ProgressEvent = {
  loaded: number
  total: number
  file: File
  clientFile: ClientFile
}

export async function uploadFile({
  authToken,
  path,
  file,
  onProgress,
  apiUrl = POLICY_URL,
}: {
  authToken: string | (() => Promise<string>)
  path: string
  file: File | ClientFile
  onProgress?: (e: ProgressEvent) => void
  apiUrl?: string
}): Promise<JSendError | JSendSuccess<{ hostedFileInfo: HostedFileInfo }>> {
  const clientFile = await createClientFile(file)

  const uploadPolicyResponse = await getUploadPolicy({
    authToken,
    path,
    file,
    apiUrl,
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
        loaded: e.loaded,
        total: e.total,
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
    data: {
      hostedFileInfo,
    },
  }
}
