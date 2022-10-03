import { FullCloudEditor } from "../types"

export function getOrigins(editor: FullCloudEditor) {
  return editor.cloud.useStore.getState().origins
}
