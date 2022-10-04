import { Descendant } from "slate"
import { Upload, UploadProgress } from "../types"

type MaybeOriginNode = {
  id?: string
  children?: MaybeOriginNode[]
  [key: string]: unknown
}

/**
 * Tells us if the `id` is a `url`. If it's not, it's a lookup in the
 * origins lookup.
 */
export function isUrl(id: string) {
  return id.includes("/")
}

/**
 * Recursive part of `normalizeOrigins` function with correct types.
 */
function _getUploadingOrigins(
  nodes: MaybeOriginNode[],
  origins: Record<string, Upload>,
  uploadingOrigins: UploadProgress[]
): UploadProgress[] {
  for (const node of nodes) {
    if ("id" in node) {
      /**
       * If the `node` has an `id` then we either
       *
       * - leave it alone and add it (it's already normalized)
       * - if found in lookup, replace the url and add it
       * - if not found in lookup, skip it
       */
      if (typeof node.id === "string") {
        /**
         * If the `id` looks like a `url` (i.e. it includes a `/` in it)
         * then we keep it as it is.
         */
        if (!isUrl(node.id)) {
          /**
           * If the `id` is a key to the `origins` lookup Record, then
           * we do a lookup.
           *
           * If it returns a value for the `origin` and the `status` is
           * `complete`, then we swap out the `id` with the `url`.
           *
           * If it's not found, we skip over it because we don't want it in our
           * normalized value.
           */
          const origin: Upload | undefined = origins[node.id]
          if (origin && origin.status === "uploading") {
            uploadingOrigins.push(origin)
          }
        }
        continue
      }
    }
    /**
     * If there wasn't an `id` but there is `children`, then we iterate
     * over the children to normalize them.
     *
     * For clarity, if there is both an `id` and `children`, the
     * `children` won't be iterated over which is by design and a small
     * performance optimization.
     */
    if (node.children) {
      _getUploadingOrigins(node.children, origins, uploadingOrigins)
      continue
    }
  }
  return uploadingOrigins
}

/**
 * Takes an array of `nodes` and a lookup for `origins` and normalizes the
 * `nodes` such that:
 *
 * - Any node with an `id` that is a `url` is left alone
 * - Any node with an `id` that is a `key` for lookup in `origins` is
 *   converted to a `url` if the origin file has been successfully uploaded
 * - If the origin file has not been uploaded or is in an error state, then
 *   we remove that element.
 *
 * We do some typecasting here to help the Descendant values pass through.
 * We are confident this is okay because we only augment the `id` and
 * we only depend on the knowledge that `children`, if present, is an Array
 * of nodes.
 */
export function getUploadingOrigins(
  nodes: Descendant[],
  origins: Record<string, Upload>
): UploadProgress[] {
  const uploadingOrigins: UploadProgress[] = []
  return _getUploadingOrigins(
    nodes as MaybeOriginNode[],
    origins,
    uploadingOrigins
  )
}
