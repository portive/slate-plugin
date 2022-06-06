# Browser Upload API

There are two steps to upload a file from the browser to an API endpoint. The first step is to create a `ClientFile` object from a `File` object.

## Step 1: Generate a `ClientFile` object

```
const clientFile = await createClientFile(file)
```

There are many properties in the `clientFile` that are useful to you before you upload the file to Portive. For example `clientFile.type` will tell you if it is an `image` or a `generic` file.

A `type="image"` can be displayed in an `<img>` tag. You can set the `src` of the image to the `clientFile.objectUrl` which will be a special URL that can be used to display the contents of the file. This can be used as a placeholder. For example, in React, you must output this like `<img src={clientFile.objectUrl}>`.

## Step 2: Upload the `ClientFile`

The next step is to take the `ClientFile` object and upload it. Once it has been uploaded,

```ts
type UploadProps = {
  authToken: string | () => Promise<string> | () => string,
  path: string,
  file: File | ClientFile,
  apiUrl?: string
}

const hostedFile = await uploadFile({
  authToken: YOUR_AUTH_TOKEN_OR_FUNCTION_RETURNING_AUTH_TOKEN,
  path: "articles/12345",
  file,
})
/**
 * returns {
 *   status: "success",
 *   url: string,
 *   hostedFile: HostedFile
 * }
 */
```

```ts
/**
 * Information about the `ClientFile` without any objects. Can be sent over
 * JSON.
 */
type ClientFileInfo = ClientGenericFileInfo | ClientImageFileINfo
type FileAndObjectUrl = { file: File; objectUrl: string }
type ClientGenericFile = GenericClientFileInfo & FileAndObjectUrl
type ClientImageFile = ImageClientFileInfo & FileAndObjectUrl

/**
 * The ClientFile object including the `File` and the object url `string`
 */
type ClientFile = ClientGenericFile | ClientImageFile
type hostedFile = HostedGenericFile | HostedImageFile
```
