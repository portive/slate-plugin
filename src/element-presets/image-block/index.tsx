import { AssertType } from "@thesunny/assert-type"
import { RenderElementProps } from "slate-react"
import {
  ImageFileInterface,
  HostedImage,
  RenderElementPropsFor,
  FullCloudEditor,
} from "../../../src"
import { insertBlock } from "~/src/transforms"

export type ElementType = {
  type: "image-block"
  originKey: string
  originSize: [number, number]
  size: [number, number]
  children: [{ text: "" }]
}

const ELEMENT_TYPE: ElementType["type"] = "image-block"

AssertType.Extends<ElementType, ImageFileInterface>(true)

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
export function Component({
  attributes,
  element,
  children,
}: RenderElementPropsFor<ElementType>) {
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
    return <Component {...props} element={props.element} />
  }
}

export const ImageBlock = {
  type: ELEMENT_TYPE,
  Component,
  withEditor,
  withRenderElement,
}
