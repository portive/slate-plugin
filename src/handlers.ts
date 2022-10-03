import { Editor } from "slate"
import { ReactEditor } from "slate-react"
import { UploadFileOptions } from "./types"

function uploadFiles(
  editor: Editor,
  files: FileList | null,
  options?: UploadFileOptions
) {
  if (files == null || files.length === 0) return false
  for (const file of files) {
    editor.cloud.uploadFile(file, options)
  }
  return true
}

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

export const handleDropFile = (editor: Editor, e: React.DragEvent): boolean => {
  const files = e.dataTransfer.files
  if (files.length === 0) return false
  /**
   * When we drop a file, the selection won't move automatically to the drop
   * location. Find the location from the event and upload the files at that
   * location.
   */
  const at = ReactEditor.findEventRange(editor, e)
  uploadFiles(editor, files, { at })
  e.preventDefault()
  e.stopPropagation()
  return true
}

export const handleInputFileChange = (
  editor: Editor,
  e: React.ChangeEvent<HTMLInputElement>
): boolean => {
  const files = e.target.files
  return uploadFiles(editor, files)
}
