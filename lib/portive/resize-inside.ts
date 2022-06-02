export function resizeInside(
  srcWidth: number,
  srcHeight: number,
  insideWidth: number,
  insideHeight: number
): [number, number] {
  if (insideWidth < 1) throw new Error(`insideWidth must be greater than 0`)
  if (insideHeight < 1) throw new Error(`insideHeight must be greater than 0`)
  if (srcWidth < 1) throw new Error(`srcWidth must be greater than 0`)
  if (srcHeight < 1) throw new Error(`srcHeight must be greater than 0`)

  // if src is smaller than inside so leave it alone
  if (srcWidth < insideWidth && srcHeight < insideHeight) {
    return [srcWidth, srcHeight]
  }

  const srcAspect = srcWidth / srcHeight
  const insideAspect = insideWidth / insideHeight

  let width: number
  let height: number

  if (srcAspect > insideAspect) {
    // src is wider than inside so constrain by width
    width = insideWidth
    height = Math.max(1, Math.round(width / srcAspect))
    return [width, height]
  } else {
    // src is taller than inside so constrain by height
    height = insideHeight
    width = Math.max(1, Math.round(height * srcAspect))
    return [width, height]
  }
}
