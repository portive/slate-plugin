# Customizing Image Elements

You've seen how to use the `ImageBlock` preset to add images to the Slate Editor.

Now let's see how to create a Custom Image Component with custom properties. For this example, we'll create an Image Component with a `title` attribute on the Image.

To start, we'll take a look at the existing `ImageBlock` preset and then modify it.

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

Because it is an `Element` it has a `type` which is set to `image-block`. This is a `void` Element, so it has `children` which is `[{ text: "" }]` (a requirement for `void` Elements).

It also has three other properties that are meaningful: An `originKey`, `originSize` and `size`. These properties are part of the `ImageFileInterface` and are required to use the `HostedImage` subcomponent which takes care of resizing, showing upload progress and showing the error state.

Here is the `ImageFileInterface` from the source code:

```ts
export interface ImageFileInterface {
  originKey: string
  originSize: [number, number]
  size: [number, number]
}
```

Although the `ImageFileInterface` is the minimum requirement for a `HostedImage` we can add any properties to the `Element`.

Let's create a new Element `titled-image-block` which renders an `<img>` with a title attribute. Here's the `Element` type definition that includes a `title` property:

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

The `titled-image-block` Element is identical to the `image-block` element but has an additional `title` property that is of type `string`.

## Custom Image Component

Let's look at the Preset `ImageBlock` Component.

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

That's the whole component.

It is small because the `HostedImage` sub-component takes care of:

- Resizing with drag handles
- Showing the width/height during resize
- Showing a progress bar while uploading
- Showing an Error when an upload fails
- Showing retina images for high DPI devices and normal resolution images for low DPI devices

You can treat it like an `img` tag and just like an `img` it can take `img` attributes.

Let's modify this to create our Custom `TitledImageBlock` Component but adding a `title` attribute.

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

Notice that we added the `title` attribute directly onto the `HostedImage` sub-component? It is not limited to `title`. You can add any `<img>` attributes onto `HostedImage`.

Now our Custom Image can render the image with the `title` attribute.

## Customize `createImageFileElement` callback

When a user uploads an image, the `createImageFileElement` function passed to `withPortive` is called. In [Getting Started](./01-getting-started.md) `withPortive` has these options:

```ts
const editor = withPortive(reactEditor, {
  createImageFileElement: createImageBlock,
  // ...
})
```

Now let's take a look at the `createImageBlock` method we passed into the `createImageFileElement` option:

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

We can see above that it takes the `originKey`, `originSize` and adds it directly to the `Element`. It also takes the `initialSize` and adds it to the `size` property of the `Element`.

This makes a more sense when we see the type definition for the `Event`:

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

The event properties used exist on the `CreateImageFileElementEvent` but there's also a `file` property which is a [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) object.

`file` is not used above but we will use it for our `TitledImageBlock` which we can define as:

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

> 🌞 This was built for this example. Since the `titled-image-block` code existed, we added it as a Preset as well.
