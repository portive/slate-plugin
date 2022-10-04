import { AssertType } from "@thesunny/assert-type"
import { AttachmentBlock as RenderElement } from "./render-attachment-block"
import { FullCloudEditor } from "../../../src"
import { RenderElementProps } from "slate-react"
import { insertBlock } from "~/src/transforms"

export type AttachmentBlockElementType = {
  type: "attachment-block"
  originKey: string
  filename: string
  bytes: number
  children: [{ text: "" }]
}

const ELEMENT_TYPE: AttachmentBlockElementType["type"] = "attachment-block"

AssertType.Equal<typeof ELEMENT_TYPE, AttachmentBlockElementType["type"]>(true)

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
  cloud.onUpload = (e) => {
    insertBlock(
      editor,
      {
        type: "attachment-block",
        originKey: e.originKey,
        filename: e.file.name,
        bytes: e.file.size,
        children: [{ text: "" }],
      },
      e.at
    )
  }
  return editor
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

export const AttachmentBlock = {
  ELEMENT_TYPE,
  Element: RenderElement,
  withEditor,
  withRenderElement,
}
