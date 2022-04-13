import { Entity, HostedImageElement } from "../types"

export function ProgressBar({ entity }: { entity: Entity }) {
  if (entity.type !== "loading") {
    return null
  }
  const percent = (entity.sentBytes * 100) / entity.totalBytes
  console.log({ percent })
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        marginTop: -6,
        left: 16,
        right: 16,
        background: "white",
        borderRadius: 12,
        boxShadow: "0 0 3px 0px rgba(0,0,0,1)",
      }}
    >
      <div
        style={{
          background: "DodgerBlue",
          width: `${percent}%`,
          transition: "width 0.1s",
          height: 16,
          borderRadius: 12,
        }}
      ></div>
    </div>
  )
}
