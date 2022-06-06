# Customizing Files

In [Getting Started](./01-getting-started.md) we used an `AttachmentBlock` Preset to display uploaded files.

This guide explains how the `AttachmentBlock` Preset works and how to create or customize one.

In this example, we'll add a ContentType property and show it in the attachment block.

## Custom File Type

> 🌞 Even if you aren't using TypeScript, we recommend reading this section. You can probably follow the meaning of the type declarations (e.g. `originKey: string` means the `originKey` property takes a `string` type value).

Here is the type for the `AttachmentBlockElement`.

```tsx
export type AttachmentBlockElement = {
  type: "attachment-block"
  originKey: string // ✅ `originKey` is a required property
  filename: string
  bytes: number
  children: [{ text: "" }]
}
```

Because it is an `Element` it has a `type` which is set to `attachment-block`. This is a `void` Element, so it has `children` which is `[{ text: "" }]` (a requirement for `void` Elements).

It also has an `originKey` which is a `string`. That's the only required property for a File Element.

The rest of the properties are custom properties on the `AttachmentBlockElement`. Let's modify it to add a `content-type` property and we'll change the `type` of the Element to `custom-attachment-block`.

```tsx
export type CustomAttachmentBlockElement = {
  type: "custom-attachment-block"
  originKey: string
  filename: string
  bytes: number
  contentType: string // ✅ Add a `content-type` property
  children: [{ text: "" }]
}
```

## Custom File Component

This is a simplified version of the `AttachmentBlock` Component that contains everything we are interested in but visually, it's not styled.

```tsx
export function AttachmentBlock({
  attributes,
  element,
  children,
}: RenderElementPropsFor<AttachmentBlockElement>) {
  // ✅ This `userOrigin` hook returns an `Origin` object
  //    We'll talk about this more below.
  const origin = useOrigin(element.originKey)

  return (
    <div {...attributes}>
      <div contentEditable={false}>
        {/* ✅ This is where we show info about this attachment */}
        <div>
          <a href={origin.url} target="_blank" download>
            {element.filename}
          </a>
        </div>
        <StatusBar origin={origin} width={192} height={16}>
          {element.bytes} bytes
        </StatusBar>
      </div>
      {children}
    </div>
  )
}
```

Like any `Element` Component it has `{...attributes}` and `{children}`. We also set `contentEditable={false}` on the `<div>` that surrounds the attachment information so the user can't edit it.

### The `useOrigin` Hook

Something new that we haven't seen before in [Customizing Images](./04-customizing-images.md) is the `useOrigin` hook.

The `useOrigin` hook takes the `originKey` (a `string`) from the element and returns an `Origin` object. Every `Origin` object has:

- a `url` which is a `string`
- a `status` which can be `"uploading"`, `"error` or `"complete"`
- Other properties depending on the `status` like upload progress stats or an error message

> To learn more about the other peropties of `Origin`, read the [API Reference to Origin](../reference/origin.md).

In the `AttachmentBlock` code above we use render it using the `origin.url` the `element.filename` and the `element.bytes`.

### The `StatusBar` Component

Found in the `AttachmentBlock` Component is a `StatusBar` Component:

```tsx
<StatusBar origin={origin} width={192} height={16}>
  {element.bytes} bytes
</StatusBar>
```

The `origin`, `width` and `height` are required.

The `StatusBar` displays something different depending on the `status` of the origin:

- If the origin status is `uploading` it shows an upload progress bar
- If the origin status is `error` it shows a red bar that says `Upload Failed`
- If the origin status is `complete` it shows the `children` of the `StatusBar` component.

In our example, when the upload is `complete`, it displays the number of bytes in the file.

### Customizing the Component

Now let's add our custom `contentType` property to our `CustomAttachmentBlock`

```tsx
export function CustomAttachmentBlock({
  attributes,
  element,
  children,
}: RenderElementPropsFor<CustomAttachmentBlockElement>) {
  const origin = useOrigin(element.originKey)

  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <div>
          <a href={origin.url} target="_blank" download>
            {element.filename}
          </a>
        </div>
        <StatusBar origin={origin} width={192} height={16}>
          {element.bytes} bytes,
          {/* ✅ Show the file's contentType */}
          {element.contentType}
        </StatusBar>
      </div>
      {children}
    </div>
  )
}
```

When the file is finished uploading, our new Attachment will now show the content type after the number of bytes in the uploaded file.

## Custom `createFileElement`

When a user uploads a file, if it's an image, it is handled by the `createImageFileElement` function passed to `withPortive` if there is one. If the file is not an image or there is no `createImageFileElement` function defined, then it is handled by the `createFileElement` function.

Here's how it is used in the [Getting Started](./01-getting-started.md):

```ts
const editor = withPortive(reactEditor, {
  createImageFileElement: createImageBlock,
  createFileElement: createAttachmentBlock,
  // ...
})
```

Now let's take a look at the `createAttachmentBlock` method we passed into the `createFileElement` option:

```ts
export function createAttachmentBlock(
  e: CreateFileElementEvent
): AttachmentBlockElement {
  return {
    originKey: e.originKey,
    type: "attachment-block",
    filename: e.file.name,
    bytes: e.file.size,
    children: [{ text: "" }],
  }
}
```

We can see above that it takes the `originKey` and adds it to the `Element`. It also takes from `e.file` which is a `File` object to fill the `fileanem` and `bytes` property of the `AttachmentBlockElement`.

Let's modify it to add set the `contentType`:

```ts
export function createCustomAttachmentBlock(
  e: CreateFileElementEvent
): CustomAttachmentBlockElement {
  return {
    originKey: e.originKey,
    type: "custom-attachment-block",
    filename: e.file.name,
    bytes: e.file.size,
    // ✅ Set the `contentType` from the `File` object
    contentType: e.file.type,
    children: [{ text: "" }],
  }
}
```

Now it's just a matter of importing and using our new `CustomAttachmentBlock`. Here's the full source code...

```tsx
import {
  CreatedImageFileElementEvent,
  RendeElementPropsFor,
  HostedImage,
} from "slate-portive"

export type CustomAttachmentBlockElement = {
  type: "custom-attachment-block"
  originKey: string
  filename: string
  bytes: number
  contentType: string // ✅ Add a `content-type` property
  children: [{ text: "" }]
}


export function createCustomAttachmentBlock(
  e: CreateFileElementEvent
): CustomAttachmentBlockElement {
  return {
    originKey: e.originKey,
    type: "custom-attachment-block",
    filename: e.file.name,
    bytes: e.file.size,
    // ✅ Set the `contentType` from the `File` object
    contentType: e.file.type,
    children: [{ text: "" }],
  }
}

export function CustomAttachmentBlock({
  attributes,
  element,
  children,
}: RenderElementPropsFor<CustomAttachmentBlockElement>) {
  const origin = useOrigin(element.originKey)

  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <div>
          <a href={origin.url} target="_blank" download>
            {element.filename}
          </a>
        </div>
        <StatusBar origin={origin} width={192} height={16}>
          {element.bytes} bytes,
          {/* ✅ Show the file's contentType */}
          {element.contentType}
        </StatusBar>
      </div>
      {children}
    </div>
  )
}
}
```
