import { Descendant } from "slate"
import { Origin } from "../types"

type MaybeOriginNode = {
  originKey?: string
  children?: MaybeOriginNode[]
  [key: string]: unknown
}

export function isUrl(originKey: string) {
  return originKey.includes("/")
}

/**
 * Recursive part of `normalizeOrigins` function with correct types.
 */
function _normalizeOrigins(
  nodes: MaybeOriginNode[],
  origins: Record<string, Origin>
): MaybeOriginNode[] {
  const nextNodes: MaybeOriginNode[] = []
  for (const node of nodes) {
    if ("originKey" in node) {
      /**
       * If the `node` has an `originKey` then we either
       *
       * - leave it alone and add it (it's already normalized)
       * - if found in lookup, replace the url and add it
       * - if not found in lookup, skip it
       */
      if (typeof node.originKey === "string") {
        /**
         * If the `originKey` looks like a `url` (i.e. it includes a `/` in it)
         * then we keep it as it is.
         */
        if (isUrl(node.originKey)) {
          nextNodes.push(node)
        } else {
          /**
           * If the `originKey` is a key to the `origins` lookup Record, then
           * we do a lookup.
           *
           * If it returns a value for the `origin` and the `status` is
           * `complete`, then we swap out the `originKey` with the `url`.
           *
           * If it's not found, we skip over it because we don't want it in our
           * normalized value.
           */
          const origin: Origin | undefined = origins[node.originKey]
          if (origin && origin.status === "complete") {
            nextNodes.push({ ...node, originKey: origin.url })
          }
        }
        continue
      }
    }
    /**
     * If there wasn't an `originKey` but there is `children`, then we iterate
     * over the children to normalize them.
     *
     * For clarity, if there is both an `originKey` and `children`, the
     * `children` won't be iterated over which is by design and a small
     * performance optimization.
     */
    if (node.children) {
      nextNodes.push({
        ...node,
        children: _normalizeOrigins(node.children, origins),
      })
      continue
    }
    /**
     * If there has been no prior processing of `originKey` or `children` then
     * we simply add the node.
     */
    nextNodes.push(node)
  }
  return nextNodes
}

/**
 * Takes an array of `nodes` and a lookup for `origins` and normalizes the
 * `nodes` such that:
 *
 * - Any node with an `originKey` that is a `url` is left alone
 * - Any node with an `originKey` that is a `key` for lookup in `origins` is
 *   converted to a `url` if the origin file has been successfully uploaded
 * - If the origin file has not been uploaded or is in an error state, then
 *   we remove that element.
 *
 * We do some typecasting here to help the Descendant values pass through.
 * We are confident this is okay because we only augment the `originKey` and
 * we only depend on the knowledge that `children`, if present, is an Array
 * of nodes.
 */
export function normalizeOrigins(
  nodes: Descendant[],
  origins: Record<string, Origin>
): Descendant[] {
  return _normalizeOrigins(nodes as MaybeOriginNode[], origins) as Descendant[]
}
