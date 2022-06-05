# Custom Image Elements

You've seen how to use the `ImageBlock` preset to add images to your Slate Editor quickly.

Here we'll show you hot create your own Image Component which you can customize with your own properties. For this example, we'll create an Image Component that allows us to add a `title` attribute to the Image.

We'll lead you through this by taking a look at the existing `ImageBlock` preset and then modifying it.

## Custom Image Type

> 🌞 Even if you aren't using TypeScript, we recommend reading this section. You can probably follow the meaning of the type declarations (e.g. `originKey: string` means the `originKey` property takes a `string` type value).

Let's start by taking a look at the type for the `ImageBlockElement`.

```tsx
export type ImageBlockElement = {
  type: "image-block"
  originKey: string
  originSize: [number, number]
  size: [number, number]
  children: [{ text: "" }]
}
```

Like any other `Element` it has a `type` and because it is a `void` Element, it has a `children` property which is an empty `Text` node.

It also has an `originKey`, `originSize` and a `size` property. These properties are required properties of an Image and make up the `ImageFileInterface`.

Here is the `ImageFileInterface` from the source code:

```ts
export interface ImageFileInterface {
  originKey: string
  originSize: [number, number]
  size: [number, number]
}
```

The `ImageFileInterface` is the bare minimum requirement but we can add any other properties that we want.

So let's create a new Element type for a `titled-image-block`.

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

Now our `titled-image-block` Element looks like the `image-block` element but has an additional `title` property that is of type `string`.

## Custom Image Component

Now, let's take a look at the `ImageBlock` Component that renders the image in React.

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

That's it. The `HostedImage` component takes care of displaying the image and behaves like an `img` tag.

The `HostedImage` Component handles:

- Resizing with drag handles including showing the width/height during resize
- Showing a progress bar while uploading
- Showing an Error for a failed upload
- Showing retina images for high DPI devices and regular images for low DPI devices

Let's modify this to create a `TitledImageBlock` Component.

```tsx
import { RendeElementPropsFor, HostedImage } from "slate-portive"

export function ImageBlock({
  attributes,
  element,
  children,
  // ✅ Change `ImageBlockElement` to `TitledImageBlockElement`
}: RenderElementPropsFor<TitledImageBlockElement>) {
  return (
    <div {...attributes} style={{ margin: "8px 0" }}>
      <HostedImage
        element={element}
        style={{ borderRadius: element.size[0] < 100 ? 0 : 4 }}
        { /* ✅ Add `element.title` here to add it to the <img> tag */ }
        title={element.title}
      />
      {children}
    </div>
  )
}
```

Now our Custom Image can render the image with the `title` attribute.

## Customize `createElement` callback

When a user uploads an image, the `createElement` callback from `withPortive` gets called. In [Getting Started](./01-getting-started.md) it looks like this:

```ts
const editor = withPortive(reactEditor, {
  createElement: (e: CreateFileElementEvent) =>
    e.type === "image" ? createImageBlock(e) : createAttachmentBlock(e),
})
```

Note that `e` is of type `CreateElementEvent` which is defined like this:

```ts
export type CreateImageFileElementEvent = {
  type: "image"
  originKey: string
  originSize: [number, number]
  initialSize: [number, number]
  file: File
}

export type CreateGenericFileElementEvent = {
  type: "generic"
  originKey: string
  file: File
}

export type CreateFileElementEvent =
  | CreateImageFileElementEvent
  | CreateGenericFileElementEvent
```

So what's happening in the code above is it is looking at `e.type` which can be either `image` or `generic`, and if it is `image`, it calls `createImageBlock` with an `e` of type `CreateImageFileElementEvent` which is this.

```ts
export type CreateImageFileElementEvent = {
  type: "image"
  originKey: string
  originSize: [number, number]
  initialSize: [number, number]
  file: File
}
```

Now let's take a look at the `createImageBlock` method:

```ts
export function createImageBlock(
  e: CreateImageFileElementEvent
): ImageBlockElement {
  return {
    type: "image-block",
    originKey: e.originKey,
    originSize: e.originSize,
    size: e.initialSize,
    children: [{ text: "" }],
  }
}
```

This method takes the `CreateImageFileElementEvent` (as can be seen in the function arguments) and then returns an `ImagBlockElement`.

It assigns the `originKey` and the `originSize` straight from `e`. It then sets the image elements `size` to `e.initialSize`.

Let's modify this to create a `createTitledImageBlock` function

```ts
export function createTitleImageBlock(
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
