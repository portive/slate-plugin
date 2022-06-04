import { FullPortiveEditor, SaveResult } from "../types"
import { getOrigins } from "./get-origins"
import { getUploadingOrigins } from "./get-uploading-origins"
import delay from "delay"
import { normalizeOrigins } from "./normalize-origins"

export async function save(
  editor: FullPortiveEditor,
  ms: number
): Promise<SaveResult> {
  const origins = getOrigins(editor)
  const uploadingOrigins = getUploadingOrigins(editor.children, origins)
  const finishPromises = uploadingOrigins.map((origin) => origin.finish)
  const timeoutPromise = delay(ms, { value: "timeout" })
  const result = await Promise.race([
    Promise.all(finishPromises),
    timeoutPromise,
  ])
  if (result === "timeout") {
    const uploadingOrigins = getUploadingOrigins(editor.children, origins)
    const finishPromises = uploadingOrigins.map((origin) => origin.finish)
    return {
      status: "timeout",
      value: editor.portive.normalize(),
      finishes: finishPromises,
    }
  } else {
    const origins = getOrigins(editor)
    /**
     * We explicitly clear the Promise because if we don't, the timer keeps
     * on running. This is fine in the browser, but messes up unit tests with
     * this error message:
     *
     * ```
     * A worker process has failed to exit gracefully and has been force exited.
     * This is likely caused by tests leaking due to improper teardown.
     * Try running with --detectOpenHandles to find leaks.
     * Active timers can also cause this, ensure that .unref() was called on them.
     * ```
     */
    timeoutPromise.clear()
    return {
      status: "complete",
      value: normalizeOrigins(editor.children, origins),
    }
  }
}
