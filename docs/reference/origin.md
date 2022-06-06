# Origin

An `Origin` object is the return value for the [`useOrigin`](./use-origin.md) hook and gives us the progress of an upload including the current URL for the uploading or uploaded file.

```ts
export type OriginUploading = {
  url: string
  status: "uploading"
  sentBytes: number
  totalBytes: number
  eventEmitter: EventEmitter<OriginEventTypes>
  finishPromise: Promise<Origin>
}

export type OriginUploaded = {
  url: string
  status: "complete"
}

export type OriginError = {
  url: string
  status: "error"
  message: string
}

export type Origin = OriginUploading | OriginUploaded | OriginError
```

- [Hook Methods](#hook-methods)
- [originKey](#origin-key)
- [Shared Origin Properties](#properties)
- [Uploading Origin Properties](#properties)
- [Error Origin Properties](#properties)

## Hook Methods

### `useOrigin(originKey: string) => Origin`

The `useOrigin` hook takes an `originKey` and returns an `Origin` object.

For example:

```tsx
function SimpleAttachment({
  attributes,
  element,
  children,
}: RenderElementProps) {
  const origin = useOrigin(element.originKey)
  return (
    <div {...attributes}>
      <div>
        <a href={origin.url}>Link to File</a>
      </div>
      <div>Upload Status: {origin.status}</div>
      {children}
    </div>
  )
}
```

## The `originKey`

The `originKey` is a `string` which represents an `Origin` in one of two ways:

1. It can be a URL
2. It can be a lookup key in a Origin lookup object

If it is a URL, then it is converted to an `OriginUploaded` object.

For example, if the `originKey` is `https://www.portive.com/` then the `Origin` would be:

```ts
const origin = {
  url: "https://www.portive.com/",
  status: "complete",
}
```

When a document is saved by calling the `editor.portive.save` method or normalized by calling the `editor.portive.normalize` method, all the `originKey` values are returned as URL strings.

When a file is uploaded, the `originKey` is set to a random alphanumeric string. We add that random `originKey` string with the value for an `OriginUploading` object. During the upload, the `OriginUploading` object is updated to reflect the amount the file has been uploaded. If there is an error, it is set to an `OriginError` object. When the file successfully uploaded, it is set to an `OriginComplete` object.

## Shared Origin Properties

### `url: string`

The value of `url` is either:

- A URL to the hosted file when the file has finished uploading
- A URL generated from [`createObjectURL`](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL)

In any state, the `url` value can be used as the src for an `img` tags such as `<img src={origin.src} />` and is useful for showing a preview of an image while the image is still uploading.

### `status: "uploading" | "complete" | "error"`

Indicates the current upload status:

- `uploading`: File is currently an in progress upload
- `complete`: File has completed upload
- `error`: There was an error during uploading. See `message` for why.

## Uploading Origin Properties

Properties only found when `status` is `uploading`.

### `sentBytes: number`

The number of bytes sent so far during the upload.

### `totalBytes: number`

The total number of bytes in the file that need to be uploaded.

### `eventEmitter: EventEmitter3`

An instance of [`EventEmitter3`](https://github.com/primus/eventemitter3) which has the same API as Node.js [EventEmitter](https://nodejs.org/api/events.html#class-eventemitter) but works in the browser.

It emits three event types where the event object is an `Origin` object.

- `progress`: Updating the progress of an upload
- `complete`: Upload completed
- `error`: Error during upload

> 🌞 Typically `eventEmitter` isn't be used directly and is an internal implementation detail; however, you can attach event listeners to `eventEmitter` to get the progress of an upload.

### `finishPromise: Promise<Origin>`

A `Promise` that resolves with an `Origin` when uploading is completed.

> 🌞 Typically `finishPromise` isn't be used directly and is an internal implementation detail; however, you can `await` this `Promise` to wait for a file to finish uploading.

## Error Origin Properties

### `message: string`

The reason the upload could not be completed as a `string`.
