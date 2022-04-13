import { Editor } from "slate"

export const handlePasteImage = (
  editor: Editor,
  e: React.ClipboardEvent
): boolean => {
  const files = e.clipboardData.files
  if (files.length === 0) return false
  for (const file of files) {
    editor.uploadHostedImage(file)
  }
  return true
}

export const handleDropImage = (
  editor: Editor,
  e: React.DragEvent
): boolean => {
  const files = e.dataTransfer.files
  if (files.length === 0) return false
  for (const file of files) {
    editor.uploadHostedImage(file)
  }
  return true
}
