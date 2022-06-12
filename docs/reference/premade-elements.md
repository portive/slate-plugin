# Premade Elements

The `slate-portive` plugin includes these premade elements that you can use or customize:

- [`ImageBlock`](#imageblock): An Image Element as a `void` `block` as used in the [Getting Started](../guides/01-getting-started.md) Guide.
- [`TitledImageBlock`](#titledimageblock): An Image Element the same as `ImageBlock` but with a `title` attribute.
- [`ImageInline`](#imageinline): An Image Element as a `void` `inline` that for custom icons or emojis that should apear inline with Text.
- [`AttachmentBlock`](#attachmentblock): An Attachment Element as a `void` `block` as used in the [Getting Started](../guides/01-getting-started.md) Guide

## ImageBlock

#### Import statement:

```typescript
import { ImageBlockElement, ImageBlock, createImageBlock } from "slate-portive"
```

- TypeScript type: `ImageBlockElement`
- Element type: `image-block`
- Component: `ImageBlock`
- createImageFileElement: `createImageBlock`
- isVoid: `true`
- isInline: `false`

## TitledImageBlock

#### Import statement:

```typescript
import {
  TitledImageBlockElement,
  TitledImageBlock,
  createTitledImageBlock,
} from "slate-portive"
```

- Element type: `titled-image-block`
- TypeScript type: `TitledImageBlockElement`
- Component: `TitledImageBlock`
- createImageFileElement: `createTitledImageBlock`
- isVoid: `true`
- isInline: `false`

## ImageInline

#### Import statement:

```typescript
import {
  ImageInlineElement,
  ImageInline,
  createImageInline,
} from "slate-portive"
```

- Element type: `image-inline`
- TypeScript type: `ImageInlineElement`
- Component: `ImageInline`
- createImageFileElement: `createImageInline`
- isVoid: `true`
- isInline: `true`

## AttachmentBlock

#### Import statement:

```typescript
import {
  AttachmentBlockElement,
  AttachmentBlock,
  createAttachmentBlock,
} from "slate-portive"
```

- Element type: `attachment-block`
- TypeScript type: `AttachmentBlockElement`
- Component: `AttachmentBlock`
- createFileElement: `createAttachmentBlock`
- isVoid: `true`
- isInline: `false`
