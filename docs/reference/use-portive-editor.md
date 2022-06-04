# withPortive

The `withPortive` plugin adds image and file attachment uploading to Slate.

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
  initialOrigins: Record<string, Origin>
  createImageFile: (e: CreateImageFileProps) => Element & { originKey: string }
  createGenericFile: (
    e: CreateGenericFileProps
  ) => Element & { originKey: string }
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

Sets the bounds of the initial
