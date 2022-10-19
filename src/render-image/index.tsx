import { ImageFileInterface, Upload } from "../types"
import { useSlateStatic, useSelected, useFocused } from "slate-react"
import { ImageControls } from "./image-controls"
import { CSSProperties, useEffect, useState } from "react"
import { HostedImageContext } from "./hosted-image-context"
import { RenderElementPropsFor } from "../types/type-utils"
export * from "./status-bar"

export function RenderHostedImage({
  attributes,
  element,
  children,
}: RenderElementPropsFor<ImageFileInterface>) {
  return (
    <div {...attributes} style={{ margin: "8px 0" }}>
      <HostedImage
        element={element}
        style={{ borderRadius: element.width < 100 ? 0 : 4 }}
      />
      {children}
    </div>
  )
}

/**
 * Adds a `boxShadow` around the Element when it is selected.
 */
export function useHighlightedStyle() {
  const selected = useSelected()
  const focused = useFocused()
  const highlighted = selected && focused
  const boxShadow = highlighted ? "0 0 0 3px DodgerBlue" : "none"
  return { boxShadow }
}

/**
 * Takes an `element` (which it only needs for its `id`) and returns the
 * Upload object from it.
 */
export function useUpload(url: string): Upload {
  const editor = useSlateStatic()
  /**
   * We call this even if it's not always required because it calls `useStore`
   * which is a React hook which means it needs to be called consistently.
   */
  const upload = editor.cloud.useStore((state) => state.uploads[url])
  if (upload == null) {
    return {
      status: "complete",
      url: url,
    }
  } else {
    return upload
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

type ImageProps = React.HTMLAttributes<HTMLImageElement>

export function HostedImage({
  element,
  className,
  style,
  ...imageProps
}: {
  element: ImageFileInterface
  className?: string
  style?: CSSProperties
} & ImageProps) {
  const editor = useSlateStatic()
  const upload = useUpload(element.url)

  const [size, setSize] = useState<{ width: number; height: number }>({
    width: element.width,
    height: element.height,
  })

  useEffect(() => {
    setSize({ width: element.width, height: element.height })
  }, [element.width, element.height])

  const highlightedStyle = useHighlightedStyle()

  const src = generateSrc({
    originUrl: upload.url,
    size: [element.width, element.height],
    maxSize: [element.maxWidth, element.maxHeight],
  })

  const srcSet = generateSrcSet({
    originUrl: upload.url,
    size: [element.width, element.height],
    maxSize: [element.maxWidth, element.maxHeight],
  })

  return (
    <HostedImageContext.Provider
      value={{
        editor,
        origin: upload,
        size,
        setSize,
      }}
    >
      <ImageControls element={element}>
        <img
          src={src}
          srcSet={srcSet}
          width={size.width}
          height={size.height}
          className={className}
          style={{ ...highlightedStyle, ...style, display: "block" }}
          {...imageProps}
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
