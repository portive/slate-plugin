# withPortive

The `withPortive` plugin adds image and file attachment uploading to Slate.

```ts
type withEditor =
  (editor: Editor, options: Options) =>
    Editor & { portive: PortiveObject } =
```

When used with `withReact` and `withHistory` those plugins should be applied inside:

```ts
import { createEditor } from "slate"
import { withHistory } from "slate-history"
import { withReact } from "slate-react"
import { withPortive } from "slate-images-and-attachments"

const [editor] = useState(() => {
  const reactEditor = withReact(withHistory(createEditor()))
  const portiveEditor = withPortive(reactEditor, {
    // ...options
  })
})
```

## Options

Configuration options for `withPortive`:

```ts
type Options = {
  authToken: string | (() => string | Promise<string>)
  path: string
  initialMaxSize: [number, number]
  minResizeWidth?: number
  maxResizeWidth?: number
  createImageFile: (e: CreateImageFileProps) => Element & { originKey: string }
  createGenericFile: (
    e: CreateGenericFileProps
  ) => Element & { originKey: string }
  initialOrigins: Record<string, Origin>
}
```

### `authToken: string | () => string | () => Promise<string>`

To learn what an `authToken` is, why you need one and how to generate one see the `authToken` reference.

The `authToken` can be provided as a `string` or a `function` (including an `async function`) that returns a `string`.

### `path: string`

This is a unique `path` that uniquely identifies the current document and indicates where files should be uploaded. We recommend a path that includes a table name / collection name and the record or document id.

For example:

- `articles/12345`: for an `articles` table with an id of `12345`
- `comments/a1b2c3`: for a `comments` collection with an id of `a1b2c3`

### `initialMaxSize: [number, number]`

Sets the initial maximum size of an uploaded image in the Editor. The value represents a max `[width, height]`.

If an image is smaller than the `initialMaxSize` width/height, the image is shown at full size. If an image is larger than the width/height, the image is scaled down to fit within the width/height.

### `minResizeWidth?: number = 100`

Images below the `minResizeWidth` are not shown drag handles for resizing. This is usually a good idea because there is not much value in resizing very small images and the resize handles can overwhelm the size of a small image.

Images above the `minResizeWidth` can be resized, but they can only be resized down to the `minResizeWidth`.

### `maxResizeWidth?: number = 1280`

The maximum width an image can be resized to.

### `createImageFileElement: (e: CreateImageFileElementEvent) => Element & ImageElementInterface`

```ts
type CreateImageFileEvent = {
  originKey: string
  originSize: [number, number]
  initialSize: [number, number]
  file: File
}

type ImageElementInterface = {
  originKey: string
  originSize: [number, number]
  size: [number, number]
}
```

When a user starts uploading a file, it is handled in one of two ways:

1. If it is a supported image file type (e.g. `.gif`, `.jpg`, `.jpeg`, `.png` or `.webp`) then this method `createImageFileElement` is called
2. If it is not a supported image file type then a different method `createGenericFileElement` is called

The result of the callback is an Image `Element` which must include but is not limited to these props:

- `originKey` which is a `string` the file's `Origin` (i.e. where it comes from and also its current uploading state).
- `originSize` which are the dimensions of the image a the `Origin`
- `size` which represents the current display width/height of the image

Typically, these properties are passed almost straight through from the `CreateImageFileEvent`. for example:

```ts
usePortive(editor, {
  // ...
  createImageFileElement(e) {
    return {
      type: "my-image-element-type", // the type for the image element desired
      originKey: e.originKey,
      originSize: e.originSize,
      size: e.initialSize,
      children: [{ text: "" }], // the `children` on a `Void` element
    }
  },
})
```

### `createGenericFileElement: (e: CreateGenericFileElementEvent) => Element & { originKey: string }`

```ts
type CreateGenericFileEvent = {
  originKey: string
  file: File
}

type GenericElementInterface = {
  originKey: string
}
```

1. If it is a supported image file type (e.g. `.gif`, `.jpg`, `.jpeg`, `.png` or `.webp`) then a different method `createImageFileElement` is called
2. If it is not a supported image file type then this method `createGenericFileElement` is called

The result of the callback is a Generic File `Element` (i.e. usually an Element that represents a file attachment) which must include but is not limited to this prop:

- `originKey` which is a `string` the file's `Origin` (i.e. where it comes from and also its current uploading state).

Typically, several of these properties are used to provide information for an attachment Element. for example:

```ts
usePortive(editor, {
  // ...
  createGenericFileElement(e) {
    return {
      type: "my-attachment-type", // the type for the image element desired
      originKey: e.originKey,
      originalFilename: e.file.filename,
      sizeInBytes: e.file.size,
      children: [{ text: "" }], // the `children` on a `Void` element
    }
  },
})
```

### `initialOrigins?: Record<string, Origin> = {}`

_For Unit Testing and Demos_

When a file is uploaded, the state of the upload is kept in a [`zustand`](https://github.com/pmndrs/zustand) store outside of the editor value. This is necessary so that the upload progress is not part of Slate's edit history.

During testing, however, we may wish to create an `editor` object with
