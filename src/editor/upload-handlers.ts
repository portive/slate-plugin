import { Editor, Transforms } from "slate"
import { ReactEditor } from "slate-react"

/**
 * Handle uploading of files
 */
function uploadFiles(editor: Editor, files: FileList | null) {
  if (files == null || files.length === 0) return false
  /**
   * If there is no selection when this is called, we need somewhere for the
   * file to go so we select the start of the editor as a default.
   */
  if (editor.selection == null) {
    Transforms.select(editor, Editor.start(editor, [0]))
  }
  for (const file of [...files].reverse()) {
    editor.cloud.uploadFile(file)
  }
  return true
}

/**
 * handle `pasteFile` on any Element
 */
export const handlePasteFile = (
  editor: Editor,
  e: React.ClipboardEvent
): boolean => {
  const files = e.clipboardData.files
  if (files.length === 0) return false
  uploadFiles(editor, files)
  e.preventDefault()
  e.stopPropagation()
  return true
}

/**
 * handle `dropFile` on any Element
 */
export const handleDropFile = (editor: Editor, e: React.DragEvent): boolean => {
  const files = e.dataTransfer.files
  if (files.length === 0) return false
  /**
   * When we drop a file, the selection won't move automatically to the drop
   * location. Find the location from the event and upload the files at that
   * location.
   */
  const at = ReactEditor.findEventRange(editor, e)
  Transforms.select(editor, at)
  uploadFiles(editor, files)
  e.preventDefault()
  e.stopPropagation()
  return true
}

/**
 * handle `onChange` on any `<input type="file" />` Element
 */
export const handleInputFileChange = (
  editor: Editor,
  e: React.ChangeEvent<HTMLInputElement>
): boolean => {
  const files = e.target.files
  return uploadFiles(editor, files)
}
