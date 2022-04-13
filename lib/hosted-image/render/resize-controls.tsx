import { HostedImageElement } from "../types"

export function ResizeControls({ element }: { element: HostedImageElement }) {
  return <ResizeHandles />
}

function ResizeHandles() {
  return (
    <>
      {/* Invisible Handle */}
      <div
        style={{
          position: "absolute",
          cursor: "ew-resize",
          width: 16,
          right: -8,
          top: 0,
          bottom: 0,
          background: "rgba(127,127,127,0.01)",
        }}
      >
        {/* Visible Handle */}
        <div
          style={{
            position: "absolute",
            width: 16,
            height: 32,
            background: "DodgerBlue",
            borderRadius: 4,
            left: 0,
            top: "50%",
            marginTop: -16,
          }}
        >
          <div style={{ ...barStyle, left: 3.5 }} />
          <div style={{ ...barStyle, left: 7.5 }} />
          <div style={{ ...barStyle, left: 11.5 }} />
        </div>
      </div>
    </>
  )
}

const barStyle = {
  position: "absolute",
  top: 8,
  width: 1,
  height: 16,
  background: "rgba(255,255,255,0.75)",
} as const
