import { useFocused, useSelected } from "slate-react"
import { HostedImageInterface } from "../types"
import { ProgressBar } from "./progress-bar"
import { RemoveIcon } from "./remove-icon"
import { ErrorMessage } from "./error-message"
import { ResizeControls } from "./resize-controls"
import { useHostedImageContext } from "./hosted-image-context"

/**
 * Display image controls that appear over the image.
 *
 * It works by displaying the actual image inside the image controls which is
 * rendered in its children.
 *
 * A `<span>` is placed surrounding the image such that it is flushed tight to
 * the image and has `position: relative;`.
 *
 * Now that we have a tight container, we can relatively position things like
 * the <ProgressBar /> and the <ErrorMessage /> as well as the <RemoveIcon />
 * and the <ResizeControls />.
 */
export function ImageControls({
  element,
  children: image,
}: {
  element: HostedImageInterface
  children: React.ReactNode
}) {
  const { entity } = useHostedImageContext()
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
         *
         * Also, make sure that <img> on the inside is display: 'block'.
         */
        verticalAlign: "top",
        /**
         * Disable user select. We use our own selection display.
         */
        userSelect: "none",
      }}
    >
      {image}
      <ProgressBar />
      <ErrorMessage />
      {entity.status === "error" ? <RemoveIcon element={element} /> : null}
      {showResizeControls ? <ResizeControls element={element} /> : null}
    </span>
  )
}
