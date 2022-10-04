import {
  CreateImageFileElementEvent,
  HostedImage,
  RenderElementPropsFor,
} from "../.."

export const TITLED_IMAGE_BLOCK_TYPE = "titled-image-block"

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
      <HostedImage
        element={element}
        style={{ borderRadius: element.size[0] < 100 ? 0 : 4 }}
        title={element.title}
      />
      {children}
    </div>
  )
}
