import {
  CreateImageFileElementEvent,
  ImageFileInterface,
  HostedImage,
  RenderElementPropsFor,
  FullCloudEditor,
} from "../../../src"

import { withReact, Slate, Editable, RenderElementProps } from "slate-react"
import { AssertType } from "@thesunny/assert-type"

export const IMAGE_BLOCK_TYPE = "image-block"

export type ImageBlockElement = {
  type: "image-block"
  /**
   * Must include originKey and originSize
   */
  originKey: string
  originSize: [number, number]
  /**
   * Must include `size` (consider switching to `mods.size`)
   */
  size: [number, number]
  children: [{ text: "" }]
}

AssertType.Equal<typeof IMAGE_BLOCK_TYPE, ImageBlockElement["type"]>(true)
AssertType.Extends<ImageBlockElement, ImageFileInterface>(true)

const elementType = "image-block"

export function ImageBlockElement({
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

// function withEditor(editor: FullCloudEditor): FullCloudEditor {
//   const { cloud } = editor
//   const originalOnUpload = cloud.onUpload
//   cloud.onUpload = (e) => {
//     return originalOnUpload(e)
//   }
//   return editor
// }

function withRenderElement(
  renderElement: (props: RenderElementProps) => JSX.Element
): (props: RenderElementProps) => JSX.Element {
  const originalRenderElement = renderElement
  return function renderElement(props: RenderElementProps): JSX.Element {
    if (props.element.type !== elementType) return originalRenderElement(props)
    return <ImageBlockElement {...props} element={props.element} />
  }
}

export const ImageBlock = {
  elementType,
  Element: ImageBlockElement,
  withRenderElement,
}
