import { FullPortiveEditor, SaveOptions, SaveResult } from "../types"
import { getOrigins } from "./get-origins"
import { getUploadingOrigins } from "./get-uploading-origins"
import delay from "delay"
import { normalizeOrigins } from "./normalize-origins"

const TEN_MINUTES = 1000 * 60 * 60

export async function save(
  editor: FullPortiveEditor,
  { maxTimeoutInMs = TEN_MINUTES }: SaveOptions
): Promise<SaveResult> {
  const origins = getOrigins(editor)
  const uploadingOrigins = getUploadingOrigins(editor.children, origins)
  const finishPromises = uploadingOrigins.map((origin) => origin.finishPromise)
  const timeoutPromise = delay(maxTimeoutInMs, { value: "timeout" })
  const result = await Promise.race([
    Promise.all(finishPromises),
    timeoutPromise,
  ])
  if (result === "timeout") {
    const uploadingOrigins = getUploadingOrigins(editor.children, origins)
    const finishPromises = uploadingOrigins.map(
      (origin) => origin.finishPromise
    )
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
