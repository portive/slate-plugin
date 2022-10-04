import { Editor, Element, Transforms } from "slate"

/**
 * Insert a block smartly at a location that makes sense `at` the given
 * location or, if `at` is `undefined`, then at the location of the current
 * selection and if there is no selection, at the top of the document.
 */
export function insertBlock<T extends Element>(editor: Editor, element: T) {
  /**
   * Normally, there should always be an `editor.selection` if `insertBlock`
   * is called as part of the upload. This is because `upload` always forces
   * a selection; however, in case this is called outside of an upload, we
   * default to inserting the block at the start of the editor.
   */
  const at = editor.selection || Editor.start(editor, [0])
  const aboveEntry = Editor.above(editor, {
    at,
    match: (node) => Element.isElement(node) && Editor.isBlock(editor, node),
  })
  /**
   * This checks to see if the current block is empty. If it is, it adjusts
   * the cursor selection to make sure the block goes before the empty block.
   */
  if (aboveEntry) {
    const string = Editor.string(editor, aboveEntry[1])
    if (string.length === 0) {
      Transforms.move(editor, { unit: "offset", reverse: true })
    }
  }

  /**
   * Insert the `element` (which includes an `id`).
   */
  Transforms.insertNodes(editor, element)
}
