export const PNG = "png"
export const GIF = "gif"
export const BMP = "bmp"
export const JPEG = "jpeg"
export const WEBP = "webp"

/**
 * Resources
 *
 * https://github.com/csbun/resize-image/blob/master/index.js
 * https://stackoverflow.com/questions/18922880/html5-canvas-resize-downscale-image-high-quality
 */

export enum ImageType {
  PNG = "png",
  GIF = "gif",
  BMP = "bmp",
  JPEG = "jpeg",
  WEBP = "webp",
}

type ImageOrCanvas = HTMLImageElement | HTMLCanvasElement

/**
 * Calculate new picture width
 *
 * @private
 * @param  {Image}  img    an <img> or Image() or <canvas>
 * @param  {number} width  output image width
 * @param  {number} height output image height
 * @return {array<number>} [ width, height ]
 */
function getNewImageDimensions(
  img: ImageOrCanvas,
  width: number,
  height: number
) {
  const aspect = img.width / img.height
  if (width > 0 && height > 0) {
    // At the same time specify the width and height, according to the original zoom
    if (width / height > aspect) {
      height = width / aspect
    } else {
      width = height * aspect
    }
    return [width, height]
  } else if (width > 0) {
    // Only specify width
    return [width, width / aspect]
  } else if (height > 0) {
    // Only specify the height
    return [height * aspect, height]
  } else {
    // Otherwise the original size returns
    return [img.width, img.height]
  }
}

/**
 * resize an <img> or <canvas> to canvas
 * @param  {Image}  img    an <img> or Image() or <canvas>
 * @param  {number} width  output image width
 * @param  {number} height output image height
 * @return {Canvas}        output image canvas
 */
export function resize2Canvas(
  img: ImageOrCanvas,
  width: number,
  height: number
) {
  if (!img) {
    throw new Error("`img` is required.")
  }
  // Calculate the width and height of the new image
  const newSize = getNewImageDimensions(img, width, height)

  // Draw to canvas
  const canvas = document.createElement("canvas")
  canvas.width = newSize[0]
  canvas.height = newSize[1]
  const ctx = canvas.getContext("2d")
  if (ctx == null) throw new Error(`Expected ctx not to be null`)
  ctx.drawImage(img, 0, 0, newSize[0], newSize[1])
  return canvas
}

/**
 * resize an <img> or <canvas> to base64
 * @param  {Image}  img    an <img> or Image() or <canvas
 * @param  {number} width  output image width
 * @param  {number} height output image height
 * @param  {string} type   output image type
 * @return {string}        output image base64 string
 */
export function resize(
  img: ImageOrCanvas,
  width: number,
  height: number,
  type: ImageType = ImageType.PNG
) {
  const canvas = resize2Canvas(img, width, height)
  const ctx = canvas.getContext("2d")
  if (ctx == null) throw new Error(`Expected ctx not to be null`)
  // set backgrund color to #fff while output type is NOT PNG
  if (type !== ImageType.PNG) {
    const originalGlobalCompositeOperation = ctx.globalCompositeOperation
    ctx.globalCompositeOperation = "destination-over"
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.globalCompositeOperation = originalGlobalCompositeOperation
  }
  return canvas.toDataURL("image/" + type)
}
