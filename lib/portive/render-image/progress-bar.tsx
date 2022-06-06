import { Origin } from "../types"

export function _ProgressBar({
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
        height,
        background: "white",
        borderRadius: height / 2,
      }}
    >
      <div
        style={{
          background: "DodgerBlue",
          width: progressWidth,
          transition: "width 0.1s",
          height,
          borderRadius: height / 2,
        }}
      ></div>
    </div>
  )
}

export function ProgressBar({
  origin,
  className,
  style,
  width,
  height = 16,
}: {
  origin: Origin
  className?: string
  style?: React.CSSProperties
  width: number
  height?: number
}) {
  if (origin.status !== "uploading") {
    return null
  }
  return (
    <_ProgressBar
      className={className}
      sentBytes={origin.sentBytes}
      totalBytes={origin.totalBytes}
      width={width}
      height={height}
      style={{
        boxShadow: "0 0 1px 0px rgba(0,0,0,1)",
        ...style,
      }}
    />
  )
}

export function ErrorBar({
  origin,
  className,
  style,
  width,
  height = 16,
}: {
  origin: Origin
  className?: string
  style?: React.CSSProperties
  width: number
  height?: number
}) {
  if (origin.status !== "error") {
    return null
  }
  return (
    <div
      className={className}
      style={{
        width,
        height,
        fontSize: "75%",
        fontWeight: "bold",
        lineHeight: `${height}px`,
        color: "rgba(255, 255, 255, 0.9)",
        background: "FireBrick",
        textAlign: "center",
        textTransform: "uppercase",
        borderRadius: height / 2,
        ...style,
      }}
    >
      Upload Failed
    </div>
  )
}

export function StatusBar({
  origin,
  className,
  style,
  width,
  height = 16,
}: {
  origin: Origin
  className?: string
  style?: React.CSSProperties
  width: number
  height?: number
}) {
  switch (origin.status) {
    case "uploading":
      return (
        <_ProgressBar
          className={className}
          sentBytes={origin.sentBytes}
          totalBytes={origin.totalBytes}
          width={width}
          height={height}
          style={{
            boxShadow: "0 0 1px 0px rgba(0,0,0,1)",
            ...style,
          }}
        />
      )
    case "error":
      return (
        <div
          className={className}
          style={{
            width,
            height,
            fontSize: "75%",
            fontWeight: "bold",
            lineHeight: `${height}px`,
            color: "rgba(255, 255, 255, 0.9)",
            background: "FireBrick",
            textAlign: "center",
            textTransform: "uppercase",
            borderRadius: height / 2,
            ...style,
          }}
        >
          Upload Failed
        </div>
      )
      break
    case "complete":
      return null
    default:
      throw new Error(`Should be unreachable`)
  }
}
