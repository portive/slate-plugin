import { useFocused, useSelected, useSlateStatic } from "slate-react"
import { HostedImageElement } from "../types"
import { ProgressBar } from "./progress-bar"
import { RemoveIcon } from "./remove-icon"
import { ErrorMessage } from "./error-message"
import { ResizeControls } from "./resize-controls"
import { Dispatch, SetStateAction, useCallback, useState } from "react"

export function ImageControls({
  element,
  children: image,
  size,
  setSize,
}: {
  element: HostedImageElement
  children: React.ReactNode
  size: [number, number]
  setSize: Dispatch<SetStateAction<[number, number]>>
}) {
  const editor = useSlateStatic()
  const entity = editor.useStore((state) => state.entities[element.id])

  const focused = useFocused()
  const selected = useSelected()
  const showResizeControls = focused && selected

  return (
    <span
      draggable={true}
      contentEditable={false}
      style={{
        position: "relative",
        display: "inline-block",
        /**
         * This is required so that we don't get an extra gap at the bottom.
         * When display is 'inline-block' we get some extra space at the bottom
         * for the descenders because the content is expected to co-exist with text.
         *
         * Setting vertical-align to top, bottom or middle fixes this because it is
         * no longer baseline which causes the issue.
         *
         * This is usually an issue with 'img' but also affects this scenario.
         *
         * https://stackoverflow.com/questions/5804256/image-inside-div-has-extra-space-below-the-image
         */
        verticalAlign: "top",
        /**
         * Disable user select. We use our own selection display.
         */
        userSelect: "none",
      }}
    >
      {image}
      <ProgressBar entity={entity} size={size} />
      <ErrorMessage entity={entity} />
      {entity.type === "error" ? <RemoveIcon element={element} /> : null}
      {showResizeControls ? (
        <ResizeControls element={element} size={size} setSize={setSize} />
      ) : null}
    </span>
  )
}
