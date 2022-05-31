import { HostedFileInterface } from "../hosted-image"
import { useSlateStatic, useSelected, useFocused } from "slate-react"
import { CSSProperties, useEffect, useState } from "react"

export function HostedFile({
  element,
  className,
  style,
}: {
  element: HostedFileInterface
  className?: string
  style?: CSSProperties
}) {
  const editor = useSlateStatic()
  const entityFromStore = editor.portive.useStore(
    (state) => state.entities[element.id]
  )
  const [size, setSize] = useState(element.size)

  useEffect(() => {
    setSize(element.size)
  }, [element.size[0], element.size[1]])

  const entity = useMemo<ImageEntity>(() => {
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
