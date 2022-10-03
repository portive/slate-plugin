import { FullCloudEditor } from "../types"

export function getOrigins(editor: FullCloudEditor) {
  return editor.portive.useStore.getState().origins
}
