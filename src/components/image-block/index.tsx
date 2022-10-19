import { AssertType } from "@thesunny/assert-type"
import { RenderElementProps } from "slate-react"
import { resizeIn } from "@portive/client"
import {
  ImageFileInterface,
  HostedImage,
  RenderElementPropsFor,
  FullCloudEditor,
} from "../.."
import { insertBlock } from "../../transforms"

export type ImageBlockElementType = {
  type: "image-block"
  url: string
  width: number
  height: number
  maxWidth: number
  maxHeight: number
  children: [{ text: "" }]
}

const ELEMENT_TYPE: ImageBlockElementType["type"] = "image-block"

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
    insertBlock(editor, {
      type: ELEMENT_TYPE,
      url: e.url,
      width: e.initialWidth,
      height: e.initialHeight,
      maxWidth: e.maxWidth,
      maxHeight: e.maxHeight,
      children: [{ text: "" }],
    })
  }
  return editor
}

/**
 * The `Element` component to render
 */
function Component({
  attributes,
  element,
  children,
}: RenderElementPropsFor<ImageBlockElementType>) {
  return (
    <div {...attributes} style={{ margin: "8px 0" }}>
      <HostedImage
        element={element}
        style={{ borderRadius: element.width < 100 ? 0 : 4 }}
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
  withEditor,
  withRenderElement,
}
