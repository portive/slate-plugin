type Size = [number, number]

export function resizeIn(size: Size, bounds: Size): Size {
  if (size[0] <= 0) throw new Error(`width must be greater than 0`)
  if (size[1] <= 0) throw new Error(`height must be greater than 0`)
  if (bounds[0] <= 0) throw new Error(`bounds width must be greater than 0`)
  if (bounds[1] <= 0) throw new Error(`bounds height must be greater than 0`)

  // if size is smaller than bounds leave it alone
  if (size[0] < bounds[0] && size[1] < bounds[1]) {
    return size
  }

  const aspect = size[0] / size[1]
  const boundsAspect = bounds[0] / bounds[1]

  if (aspect > boundsAspect) {
    // src is wider than inside so constrain by width
    return [bounds[0], Math.max(1, Math.round(bounds[0] / aspect))]
  } else {
    // src is taller than inside so constrain by height
    return [Math.max(1, Math.round(bounds[1] * aspect)), bounds[1]]
  }
}

const BIG_DIMENSION = 100000

export const resizeInWidth = (size: Size, width: number) =>
  resizeIn(size, [width, BIG_DIMENSION])

export const resizeInHeight = (size: Size, height: number) =>
  resizeIn(size, [BIG_DIMENSION, height])
