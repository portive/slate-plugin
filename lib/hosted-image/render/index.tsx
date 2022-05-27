import { HostedImageInterface, Entity } from "../types"
import { useSlateStatic, useSelected, useFocused } from "slate-react"
import { ImageControls } from "./image-controls"
import { CSSProperties, useEffect, useState } from "react"
import { HostedImageContext } from "./context"
import { useMemo } from "react"
import { getSizeFromUrl } from "./utils"
import { RenderElementPropsFor } from "../../shared/types"

export function RenderHostedImage({
  attributes,
  element,
  children,
}: RenderElementPropsFor<HostedImageInterface>) {
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

function useHighlightedStyle() {
  const selected = useSelected()
  const focused = useFocused()
  const highlighted = selected && focused
  const boxShadow = highlighted ? "0 0 0 3px DodgerBlue" : "none"
  return { boxShadow }
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
 * `url` if it is valid, or we get it from the `Entity` if it is not.
 *
 * We could prefer the `maxSize` from the `url` and if that fails, then we
 * fall back to the `Entity`.
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
  element: HostedImageInterface
  className?: string
  style?: CSSProperties
}) {
  const editor = useSlateStatic()
  const entityFromStore = editor.portiveHostedImageOptions.useStore(
    (state) => state.entities[element.id]
  )
  const [size, setSize] = useState(element.size)

  useEffect(() => {
    setSize(element.size)
  }, [element.size[0], element.size[1]])

  const entity = useMemo<Entity>(() => {
    if (element.id.includes("/")) {
      const maxSize = getSizeFromUrl(element.id)
      return {
        type: "uploaded",
        url: element.id,
        maxSize,
      }
    } else {
      return entityFromStore
    }
  }, [element.id, entityFromStore])

  const highlightedStyle = useHighlightedStyle()
  return (
    <HostedImageContext.Provider value={{ editor, entity, size, setSize }}>
      <ImageControls element={element}>
        <img
          src={entity.url}
          width={size[0]}
          height={size[1]}
          className={className}
          style={{ ...highlightedStyle, ...style, display: "block" }}
        />
      </ImageControls>
    </HostedImageContext.Provider>
  )
}
