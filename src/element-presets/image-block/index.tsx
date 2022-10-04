import {
  ImageFileInterface,
  HostedImage,
  RenderElementPropsFor,
  FullCloudEditor,
} from "../../../src"

import { RenderElementProps } from "slate-react"
import { AssertType } from "@thesunny/assert-type"
import { insertBlock } from "~/src/transforms"

const ELEMENT_TYPE = "image-block"

export type ImageBlockElementType = {
  type: typeof ELEMENT_TYPE
  originKey: string
  originSize: [number, number]
  size: [number, number]
  children: [{ text: "" }]
}

AssertType.Equal<typeof ELEMENT_TYPE, ImageBlockElementType["type"]>(true)
AssertType.Extends<ImageBlockElementType, ImageFileInterface>(true)

/**
 * Augment `Editor` to support this element type
 */
function withEditor(editor: FullCloudEditor): FullCloudEditor {
  const { cloud } = editor
  /**
   * override `isVoid`
   */
  const originalIsVoid = editor.isVoid
  editor.isVoid = (element) => {
    return element.type === ELEMENT_TYPE ? true : originalIsVoid(element)
  }
  /**
   * override `onUpload`
   */
  const originalOnUpload = cloud.onUpload
  cloud.onUpload = (e) => {
    if (e.type !== "image") return originalOnUpload(e)
    insertBlock(
      editor,
      {
        type: "image-block",
        originKey: e.originKey,
        originSize: e.originSize,
        size: e.initialSize,
        children: [{ text: "" }],
      },
      e.at
    )
  }
  return editor
}

/**
 * The `Element` component to render
 */
export function RenderElement({
  attributes,
  element,
  children,
}: RenderElementPropsFor<ImageBlockElementType>) {
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

/**
 * Augment `renderElement` method to support this element type
 */
function withRenderElement(
  renderElement: (props: RenderElementProps) => JSX.Element
): (props: RenderElementProps) => JSX.Element {
  const originalRenderElement = renderElement
  return function renderElement(props: RenderElementProps): JSX.Element {
    if (props.element.type !== ELEMENT_TYPE) return originalRenderElement(props)
    return <RenderElement {...props} element={props.element} />
  }
}

export const ImageBlock = {
  ELEMENT_TYPE,
  Element: RenderElement,
  withEditor,
  withRenderElement,
}
