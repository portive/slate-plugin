import { FullPortiveEditor } from "../types"

export function getOrigins(editor: FullPortiveEditor) {
  return editor.portive.useStore.getState().origins
}
