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

Here is a simplified version of the `AttachmentBlock` Component. It doesn't include the css, the icons, the delete button, or the blue border when it's selected but it does show you how it works.

```tsx
export function AttachmentBlock({
  attributes,
  element,
  children,
}: RenderElementPropsFor<AttachmentBlockElement>) {
  const origin = useOrigin(element.originKey)
  return (
    <div {...attributes}>
      <div className="--container" contentEditable={false}>
        <div className="--body">
          <div>{element.filename}</div>
          {origin.status === "complete" ? (
            <div className="--description">{bytes(element.bytes)}</div>
          ) : null}
          {origin.status === "uploading" ? (
            <div>
              <FileProgressBar className="--progress-bar" origin={origin} />
            </div>
          ) : null}
          {origin.status === "error" ? (
            <div className="--error">Error uploading file</div>
          ) : null}
        </div>
        {origin.status === "complete" ? (
          <div className="--icon">
            <a
              href={origin.url}
              target="_blank"
              rel="noreferrer"
              className="--icon-button --download-icon"
              download
            >
              <DownloadIcon />
            </a>
          </div>
        ) : null}
        {origin.status === "error" ? (
          <div className="--icon">
            <div className="--icon-button --trash-icon" onClick={removeElement}>
              <TrashIcon />
            </div>
          </div>
        ) : null}
      </div>
      {children}
    </div>
  )
}
```
