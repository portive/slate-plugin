import { FileOrigin } from "../types"
import { useHostedImageContext } from "./hosted-image-context"

const BAR_HEIGHT = 16
const MARGIN = 16

export function ProgressBar({
  className,
  sentBytes,
  totalBytes,
  width,
  height,
  style,
}: {
  className?: string
  sentBytes: number
  totalBytes: number
  width: number
  height: number
  style?: React.CSSProperties
}) {
  /**
   * This formula looks a little funny because we want the `0` value of the
   * progress bar to have a width that is still the height of the progress bar.
   *
   * This is for a few reasons:
   *
   * 1. We want the zero point to start with the progress bar being a circle
   * 2. If we want rounded edges, if the width is shorter than the height,
   *    we get an oval instead of a circle
   * 3. The halfway point looks visually wrong because of the circle progress
   *    bar when it is technically at the halfway point.
   */
  const progressWidth = (sentBytes / totalBytes) * (width - height) + height

  return (
    <div
      className={className}
      style={{
        ...style,
        width,
        background: "white",
        borderRadius: 12,
      }}
    >
      <div
        style={{
          background: "DodgerBlue",
          width: progressWidth,
          transition: "width 0.1s",
          height: height,
          borderRadius: 12,
        }}
      ></div>
    </div>
  )
}

export function FileProgressBar({
  className,
  entity,
}: {
  className?: string
  entity: FileOrigin
}) {
  if (entity.status !== "loading") {
    return null
  }
  return (
    <ProgressBar
      className={className}
      sentBytes={entity.sentBytes}
      totalBytes={entity.totalBytes}
      width={256}
      height={16}
      style={{
        boxShadow: "0 0 1px 0px rgba(0,0,0,1)",
      }}
    />
  )
}

export function ImageProgressBar() {
  const { entity, size } = useHostedImageContext()
  if (entity.status !== "loading") {
    return null
  }
  const barLength = size[0] - MARGIN * 2
  return (
    <ProgressBar
      sentBytes={entity.sentBytes}
      totalBytes={entity.totalBytes}
      width={barLength}
      height={BAR_HEIGHT}
      style={{
        position: "absolute",
        top: "50%",
        marginTop: -6,
        left: MARGIN,
        right: MARGIN,
        boxShadow: "0 0 3px 0px rgba(0,0,0,1)",
      }}
    />
  )
}
