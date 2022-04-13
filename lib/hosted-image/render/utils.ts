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

/**
 * Takes a url to an image and returns a modified url that's been resized to
 * a specific dimension. If the image is at a url that cannot be resized,
 * this method just returns the original url.
 */
export function getUrlFromSize(url: string, size: [number, number]): string {
  try {
    getSizeFromUrl(url)
    const u = new URL(url)
    return `${u.origin}${u.pathname}?size=${size.join("x")}`
  } catch (e) {
    return url
  }
}
