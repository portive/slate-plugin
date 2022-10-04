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

  /**
   * Insert the `element` (which includes an `originKey`).
   */
  Transforms.insertNodes(editor, element)
}
