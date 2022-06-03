import { FullPortiveEditor } from "../types"

export { normalizeOrigins } from "./normalize-origins"

export async function save(editor: FullPortiveEditor) {
  const { origins } = editor.portive.useStore.getState()
}
