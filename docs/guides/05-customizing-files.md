# Customizing Files

In [Getting Started](./01-getting-started.md) we used an `AttachmentBlock` Preset for uploaded files.

This guide explains how the `AttachmentBlock` Preset works and how to create or customize one.

In this example, we'll add a `contentType` property and show it in the attachment block.

## Custom File Type

> 🌞 Even if you aren't using TypeScript, we recommend reading this section. You can probably follow the meaning of the type declarations (e.g. `originKey: string` means the `originKey` property takes a `string` type value).

Here is the type for the `AttachmentBlockElement`.

```tsx
export type AttachmentBlockElement = {
  type: "attachment-block"
  originKey: string // ✅ `originKey` is the only required property
  filename: string
  bytes: number
  children: [{ text: "" }]
}
```

This `Element` has a `type` of `attachment-block`. Since it is a `void` Element, it has `children` of `[{ text: "" }]` (a requirement for `void` Elements).

It also has an `originKey` which is a `string`. This is the only required property for a File Element.

The other properties `filename` and `bytes` are custom properties on the `AttachmentBlockElement`. Let's modify it to add a `contentType` property and also change the `type` of the Element to `custom-attachment-block`.

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

This is a version of the `AttachmentBlock` Component used for rendering but with the styling removed.

```tsx
export function AttachmentBlock({
  attributes,
  element,
  children,
}: RenderElementPropsFor<AttachmentBlockElement>) {
  // ✅ NOTE: This `userOrigin` hook returns an `Origin` object
  //    which we'll talk about more below.
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
        {/* ✅ This displays a progress bar or an error bar */}
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

Something new that we haven't seen before is the `useOrigin` hook.

```tsx
const origin = useOrigin(element.originKey)
```

The `useOrigin` hook takes the `originKey` (a `string`) from the element and returns an `Origin` object. This `Origin` object has:

- a `url` which is a `string`
- a `status` which can be `"uploading"`, `"error` or `"complete"`
- And other properties depending on the `status` like the upload progress or an error message

> To learn more about these properties of `Origin`, read the [API Reference to Origin](../reference/origin.md).

In the `AttachmentBlock` code above we use the `origin.url` as the `href` for the link.

```tsx
<a href={origin.url} target="_blank" download>
  {element.filename}
</a>
```

### The `StatusBar` Component

In the `AttachmentBlock` Component is a `StatusBar` Component:

```tsx
<StatusBar origin={origin} width={192} height={16}>
  {element.bytes} bytes
</StatusBar>
```

What the `StatusBar` displays depends on the `status` of the origin:

- If the origin status is `uploading` it shows an upload progress bar
- If the origin status is `error` it shows a red bar that says `Upload Failed`
- If the origin status is `complete` it shows the `children` of the `StatusBar` component. In the code above, it shows the size of the file in bytes.

In the code above, when the upload is `complete`, it displays the number of bytes in the file.

### Customizing the Component

Let's add our custom `contentType` property to a `CustomAttachmentBlock`:

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
          {/* ✅ Show the file's contentType after `bytes` */}
          {element.bytes} bytes, {element.contentType}
        </StatusBar>
      </div>
      {children}
    </div>
  )
}
```

When the file is finished uploading, our new Attachment will show the content type after the number of bytes in the uploaded file.

## Custom `createFileElement`

When a user uploads a file, if it's an image, it is handled by the `createImageFileElement` function passed to `withPortive` if there is one. If the file is not an image or there is no `createImageFileElement` function defined, then it is handled by the `createFileElement` function.

Here's how it is used in [Getting Started](./01-getting-started.md):

```ts
const editor = withPortive(reactEditor, {
  createImageFileElement: createImageBlock,
  createFileElement: createAttachmentBlock,
  // ...
})
```

Here's the `createAttachmentBlock` method passed into the `createFileElement` option:

```ts
export function createAttachmentBlock(
  e: OnUploadEvent
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

We can see that it passes the `originKey` to the `Element`. It also takes properties from `e.file` which is a `File` object to fill the `bytes` and `filename` property of the `AttachmentBlockElement`.

Let's modify it to set the `contentType` as well:

```ts
export function createCustomAttachmentBlock(
  e: OnUploadEvent
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

Here's the full source code...

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
  e: OnUploadEvent
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
