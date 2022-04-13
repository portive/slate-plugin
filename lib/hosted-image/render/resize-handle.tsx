export function ResizeHandle() {
  return (
    <div
      style={{
        position: "absolute",
        width: 16,
        right: -8,
        top: 0,
        bottom: 0,
        background: "rgba(127,127,127,0.01)",
        cursor: "ew-resize",
      }}
    ></div>
  )
}
