import { Entity } from "../types"

export function ErrorMessage({ entity }: { entity: Entity }) {
  if (entity.type !== "error") return null
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        height: 24,
        marginTop: -6,
        padding: "0 1em",
        left: "1em",
        right: "1em",
        color: "white",
        background: "#cc0000",
        boxShadow: "0 0 3px 0px rgba(0,0,0,1)",
        textAlign: "center",
        font: "16px/24px sans-serif",
        borderRadius: 12,
      }}
    >
      ⚠️ Upload Failed
    </div>
  )
}
