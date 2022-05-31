import { useHostedImageContext } from "./hosted-image-context"

const BAR_HEIGHT = 16
const MARGIN = 16

export function ProgressBar() {
  const { entity, size } = useHostedImageContext()
  if (entity.status !== "loading") {
    return null
  }
  /**
   * Length of the bar is the amount of pixels the bar can move which is the
   * width of the image less the margins and also less the height because the
   * starting point for the rounded
   */
  const barLength = size[0] - MARGIN * 2 - BAR_HEIGHT
  const progressWidth =
    (entity.sentBytes / entity.totalBytes) * barLength + BAR_HEIGHT

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        marginTop: -6,
        left: MARGIN,
        right: MARGIN,
        background: "white",
        borderRadius: 12,
        boxShadow: "0 0 3px 0px rgba(0,0,0,1)",
      }}
    >
      <div
        style={{
          background: "DodgerBlue",
          width: progressWidth,
          transition: "width 0.1s",
          height: BAR_HEIGHT,
          borderRadius: 12,
        }}
      ></div>
    </div>
  )
}
