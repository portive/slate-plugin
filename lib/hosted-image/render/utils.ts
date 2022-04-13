export function getSizeFromUrl(url: string): [number, number] {
  const u = new URL(url)
  const $size = u.pathname
    .split("/")
    .pop()
    ?.split(".")[0]
    .split("--")
    .pop()
    ?.split("x")
  if ($size === undefined) {
    throw new Error(`Invalid url. Could not parse image size from ${url}`)
  }
  const width = parseInt($size[0])
  const height = parseInt($size[1])
  if (isNaN(width) || isNaN(height)) {
    throw new Error(`Invalid url. Could not parse image size from ${url}`)
  }
  return [width, height]
}
