import { AssertType } from "@thesunny/assert-type"
import { RenderElementProps } from "slate-react"
import {
  ImageFileInterface,
  HostedImage,
  RenderElementPropsFor,
  FullCloudEditor,
} from "../.."
// import { insertBlock } from "~/src/transforms"
import { Transforms } from "slate"

export type ImageInlineElementType = {
  type: "image-inline"
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

export const ELEMENT_TYPE: ImageInlineElementType["type"] = "image-inline"

AssertType.Extends<ImageInlineElementType, ImageFileInterface>(true)

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
   * override `isInline`
   */
  const originalIsInline = editor.isInline
  editor.isInline = (element) => {
    return element.type === ELEMENT_TYPE ? true : originalIsInline(element)
  }
  /**
   * override `onUpload`
   */
  const originalOnUpload = cloud.onUpload
  cloud.onUpload = (e) => {
    if (e.type !== "image") return originalOnUpload(e)
    Transforms.insertNodes(
      editor,
      {
        type: "image-inline",
        originKey: e.originKey,
        originSize: e.originSize,
        size: e.initialSize,
        children: [{ text: "" }],
      },
      { at: e.at }
    )
  }
  return editor
}

export function Component({
  attributes,
  element,
  children,
}: RenderElementPropsFor<ImageInlineElementType>) {
  return (
    <span {...attributes}>
      <HostedImage
        element={element}
        style={{ borderRadius: element.size[0] < 100 ? 0 : 4 }}
      />
      {children}
    </span>
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

export const ImageInline = {
  withEditor,
  withRenderElement,
}
