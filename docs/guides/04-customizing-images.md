# Customizing Image Elements

You've seen how to use the `ImageBlock` preset to add images to the Slate Editor.

Now let's see how to create a Custom Image Component. For this example, we'll create the Image Component but we'll add a `title` attribute to the Image.

Let's start by looking at and modifing the type of the `ImageBlockElement`.

## Custom Image Type

> 🌞 Even if you aren't using TypeScript, we recommend reading this section. You can probably follow the meaning of the type declarations (e.g. `originKey: string` means the `originKey` property takes a `string` type value).

Here is the type for the `ImageBlockElement`.

```tsx
export type ImageBlockElement = {
  type: "image-block"
  originKey: string
  originSize: [number, number]
  size: [number, number]
  children: [{ text: "" }]
}
```

This `Element` has its `type` set to `"image-block"`. Also, this is a `void` Element, so it has `children` which is `[{ text: "" }]` (a requirement for `void` Elements).

It also has three other properties that are meaningful: An `originKey`, `originSize` and `size`. These properties are part of the `ImageFileInterface` and are required in order to use the `HostedImage` subcomponent which takes care of resizing, and showing the upload progress and error state.

Here is the `ImageFileInterface`:

```ts
export interface ImageFileInterface {
  originKey: string
  originSize: [number, number]
  size: [number, number]
}
```

Although the `ImageFileInterface` is the minimum requirement for a `HostedImage` we can add other properties we desire to the `Element`.

Let's create a new Element `"titled-image-block"` which renders an `<img>` with a title attribute.

Here's an `Element` type definition that includes a `title` property:

```tsx
export type TitledImageBlockElement = {
  type: "titled-image-block"
  title: string // ✅ Add a `title` property for our titled image
  originKey: string
  originSize: [number, number]
  size: [number, number]
  children: [{ text: "" }]
}
```

## Custom Image Component

Here's the Preset `ImageBlock` Component.

```tsx
import { RendeElementPropsFor, HostedImage } from "slate-portive"

export function ImageBlock({
  attributes,
  element,
  children,
}: RenderElementPropsFor<ImageBlockElement>) {
  return (
    <div {...attributes} style={{ margin: "8px 0" }}>
      <HostedImage
        element={element}
        style={{ borderRadius: element.size[0] < 100 ? 0 : 4 }}
      />
      {children}
    </div>
  )
}
```

It may seem small. This is because the `HostedImage` sub-component takes care of most of the hard work:

- Resizing with drag handles
- Showing the width/height during resize
- Showing a progress bar while uploading
- Showing an Error when an upload fails
- Showing retina images for high DPI devices and normal resolution images for low DPI devices

From the perspective of the `ImageBlock` Component, we can treat it just like an `img` tag and it can take any `img` attributes like a `"title"` attribute for example.

Let's modify this to create our Custom `TitledImageBlock` Component:

```tsx
import { RendeElementPropsFor, HostedImage } from "slate-portive"

export function TitledImageBlock({
  attributes,
  element,
  children,
}: // ✅ Change `ImageBlockElement` to `TitledImageBlockElement`
RenderElementPropsFor<TitledImageBlockElement>) {
  return (
    <div {...attributes} style={{ margin: "8px 0" }}>
      {/* ✅ Add `element.title` */}
      <HostedImage
        element={element}
        style={{ borderRadius: element.size[0] < 100 ? 0 : 4 }}
        title={element.title}
      />
      {children}
    </div>
  )
}
```

Now our Custom Image can render the image with the `title` attribute.

## Customize `createImageFileElement` callback

When a user uploads an image, the `createImageFileElement` function passed to `withPortive` is called. In [Getting Started](./01-getting-started.md) `withPortive` has these options:

```ts
const editor = withPortive(reactEditor, {
  createImageFileElement: createImageBlock,
  // ...
})
```

Here's the `createImageBlock` method passed to the `createImageFileElement` option:

```ts
export function createImageBlock(
  e: CreateImageFileElementEvent
): ImageBlockElement {
  return {
    type: "image-block",
    originKey: e.originKey, // ✅ sets originKey from the event
    originSize: e.originSize, // ✅ sets originSize from the event
    size: e.initialSize, // ✅ sets size from `initialSize` from the event
    children: [{ text: "" }],
  }
}
```

Here's what `e` which is of type `CreateImageFileElementEvent` looks like:

```ts
export type CreateImageFileElementEvent = {
  type: "image"
  originKey: string
  originSize: [number, number]
  initialSize: [number, number]
  file: File
}

export type CreateImageFileElement = (
  e: CreateImageFileElementEvent
) => Element & { originKey: string }
```

You can learn more about `file` by reading the [`File` MDN web docs](https://developer.mozilla.org/en-US/docs/Web/API/File).

Let's use the `file` object for our `TitledImageBlock`:

```ts
export function createTitledImageBlock(
  e: CreateImageFileElementEvent
  // ✅ returns a `TitledImageBlockElement` instead
): TitledImageBlockElement {
  return {
    type: "titled-image-block",
    title: e.file.name, // ✅ set the initial title value to the filename
    originKey: e.originKey,
    originSize: e.originSize,
    size: e.initialSize,
    children: [{ text: "" }],
  }
}
```

Now it's just a matter of importing and using our new `TitledImageBlock`. Here's the full source code...

```tsx
import {
  CreatedImageFileElementEvent,
  RendeElementPropsFor,
  HostedImage,
} from "slate-portive"

export type TitledImageBlockElement = {
  type: "titled-image-block"
  title: string // ✅ Add a `title` property for our titled image
  originKey: string
  originSize: [number, number]
  size: [number, number]
  children: [{ text: "" }]
}

export function createTitledImageBlock(
  e: CreateImageFileElementEvent
  // ✅ returns a `TitledImageBlockElement` instead
): TitledImageBlockElement {
  return {
    type: "titled-image-block",
    title: e.file.name, // ✅ set the initial title value to the filename
    originKey: e.originKey,
    originSize: e.originSize,
    size: e.initialSize,
    children: [{ text: "" }],
  }
}

export function TitledImageBlock({
  attributes,
  element,
  children,
}: // ✅ Change `ImageBlockElement` to `TitledImageBlockElement`
RenderElementPropsFor<TitledImageBlockElement>) {
  return (
    <div {...attributes} style={{ margin: "8px 0" }}>
      {/* ✅ Add `element.title` */}
      <HostedImage
        element={element}
        style={{ borderRadius: element.size[0] < 100 ? 0 : 4 }}
        title={element.title}
      />
      {children}
    </div>
  )
}
```
