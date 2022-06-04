import { ImageFileInterface, Origin } from "../types"
import { useSlateStatic, useSelected, useFocused } from "slate-react"
import { ImageControls } from "./image-controls"
import { CSSProperties, useEffect, useState } from "react"
import { HostedImageContext } from "./hosted-image-context"
import { RenderElementPropsFor } from "../types/type-utils"

export function RenderHostedImage({
  attributes,
  element,
  children,
}: RenderElementPropsFor<ImageFileInterface>) {
  return (
    <div {...attributes} style={{ margin: "8px 0" }}>
      <HostedImage
        element={element}
        style={{ borderRadius: element.size[0] < 100 ? 0 : 4 }}
      />
      {children}
    </div>
  )
}

export function useHighlightedStyle() {
  const selected = useSelected()
  const focused = useFocused()
  const highlighted = selected && focused
  const boxShadow = highlighted ? "0 0 0 3px DodgerBlue" : "none"
  return { boxShadow }
}

/**
 * Takes an `element` (which it only needs for its `id`) and returns the
 * origin from it.
 */
export function useOrigin(originKey: string): Origin {
  const editor = useSlateStatic()
  const originFromStore = editor.portive.useStore(
    (state) => state.origins[originKey]
  )
  if (originKey.includes("/")) {
    return {
      status: "uploaded",
      url: originKey,
    }
  } else {
    return originFromStore
  }
}

/**
 * Strategy for handling `maxSize`
 *
 * How to handle maxSize.
 *
 * When an image is first uploaded, the size is taken from the `Image` object.
 *
 * This size can be persisted to the `Element` but then it has to be saved
 * which is unnecessary since it can be derived from the `url`.
 *
 * Saving it as a separate prop also has problems in that the maxSize could be
 * changed and puts the `Element` in an inconsistent state. But this invalid
 * state would be unlikely and we could also fix it with a normalizer to be
 * safe.
 *
 * Another method is to to add `maxSize` to `useHostedImage` as part of the
 * `HostImageContext`. In this scenario, we either get the `maxSize` from the
 * `url` if it is valid, or we get it from the `Origin` if it is not.
 *
 * We could prefer the `maxSize` from the `url` and if that fails, then we
 * fall back to the `Origin`.
 *
 * # Saving
 *
 * We should also make saving through a method like `editor.getHostedChildren()`
 * which returns `Promise`.
 */

export function HostedImage({
  element,
  className,
  style,
}: {
  element: ImageFileInterface
  className?: string
  style?: CSSProperties
}) {
  const editor = useSlateStatic()
  const origin = useOrigin(element.originKey)
  const [size, setSize] = useState(element.size)

  useEffect(() => {
    setSize(element.size)
  }, [element.size[0], element.size[1]])

  const highlightedStyle = useHighlightedStyle()

  const src = generateSrc({
    originUrl: origin.url,
    size: element.size,
    maxSize: element.originSize,
  })

  const srcSet = generateSrcSet({
    originUrl: origin.url,
    size: element.size,
    maxSize: element.originSize,
  })

  return (
    <HostedImageContext.Provider
      value={{ editor, origin: origin, size, setSize }}
    >
      <ImageControls element={element}>
        <img
          src={src}
          srcSet={srcSet}
          width={size[0]}
          height={size[1]}
          className={className}
          style={{ ...highlightedStyle, ...style, display: "block" }}
        />
      </ImageControls>
    </HostedImageContext.Provider>
  )
}

function generateSrcSet({
  originUrl,
  size,
  maxSize,
}: {
  originUrl: string
  size: [number, number]
  maxSize: [number, number]
}) {
  /**
   * If it's a url from `createObjectURL` then just return it
   */
  if (originUrl.startsWith("blob:")) return originUrl
  const src1x = generateSrc({
    originUrl,
    size,
    maxSize,
  })
  const src2x = generateSrc({
    originUrl,
    size: [size[0] * 2, size[1] * 2],
    maxSize,
  })
  return `${src1x}, ${src2x} 2x`
}

function generateSrc({
  originUrl,
  size,
  maxSize,
}: {
  originUrl: string
  size: [number, number]
  maxSize: [number, number]
}) {
  /**
   * If it's a url from `createObjectURL` then just return it
   */
  if (originUrl.startsWith("blob:")) return originUrl
  if (size[0] >= maxSize[0] || size[1] >= maxSize[1]) return originUrl
  return `${originUrl}?size=${size[0]}x${size[1]}`
}
