import axios, { AxiosResponse } from "axios"
import {
  ClientFile,
  ClientGenericFile,
  ClientImageFile,
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

async function createClientFile(file: File): Promise<ClientFile> {
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

export async function uploadFile({
  authToken,
  path,
  file,
}: {
  authToken: string | (() => Promise<string>)
  path: string
  file: File | ClientFile
}): Promise<UploadFileResponse> {
  try {
    const clientFile =
      file instanceof File ? await createClientFile(file) : file

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
