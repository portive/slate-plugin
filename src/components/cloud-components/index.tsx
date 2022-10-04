import { RenderElementProps } from "slate-react"
import { FullCloudEditor } from "~/src/types"
import {
  AttachmentBlock,
  AttachmentBlockElementType,
} from "../attachment-block"
import { ImageBlock, ImageBlockElementType } from "../image-block"

/**
 * Represents both the ImageBlock and AttachmentBlock element types
 */
export type CloudComponentsElementType =
  | ImageBlockElementType
  | AttachmentBlockElementType

/**
 * Adds both ImageBlock and AttachmentBlock handling to the editor
 */
function withEditor(editor: FullCloudEditor): FullCloudEditor {
  /**
   * NOTE: `ImageBlock` needs to be on the outside so it gets handled first
   * on and upload. Otherwise `AttachmentBlock` will handle the image upload.
   */
  return ImageBlock.withEditor(AttachmentBlock.withEditor(editor))
}

/**
 * Rendering for both `ImageBlock` and `AttachmentBlock`
 */
function withRenderElement(
  renderElement: (props: RenderElementProps) => JSX.Element
) {
  return ImageBlock.withRenderElement(
    AttachmentBlock.withRenderElement(renderElement)
  )
}

export const CloudComponents = {
  withEditor,
  withRenderElement,
}
