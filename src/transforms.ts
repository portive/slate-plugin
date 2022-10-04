import { Editor, Element, Location, Transforms } from "slate"

/**
 * Insert a block smartly at a location that makes sense `at` the given
 * location or, if `at` is `undefined`, then at the location of the current
 * selection and if there is no selection, at the top of the document.
 */
export function insertBlock<T extends Element>(
  editor: Editor,
  element: T,
  at: Location
) {
  /**
   * If `at` is passed in, we are going to move the editor's selection to that
   * location. This would happen with a drag and drop for example.
   */
  // if (at !== undefined) {
  //   Transforms.select(editor, at)
  // }

  /**
   * If the selection is in an empty block, Slate's behavior is to insert a
   * new block beneat the empty block. To get the block to insert above the
   * empty block (the expected behavior) we move the selection back one.
   */
  // const { selection } = editor
  // if (selection) {
  Transforms.select(editor, at)
  const aboveEntry = Editor.above(editor, {
    at,
    match: (node) => Element.isElement(node) && Editor.isBlock(editor, node),
  })
  if (aboveEntry) {
    const string = Editor.string(editor, aboveEntry[1])
    if (string.length === 0) {
      Transforms.move(editor, { unit: "offset", reverse: true })
    }
  }
  // }

  /**
   * Insert the `element` (which includes an `originKey`).
   */
  Transforms.insertNodes(editor, element)
}