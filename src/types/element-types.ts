export interface GenericFileInterface {
  /**
   * id is either a URL to the file which will contain at least one `/` or it
   * is a string `id` to find an `ImageOrigin` with the target of the
   * `fileEneity` being a `url` or an Object URL to the file on the
   * local computer of the browser.
   */
  url: string
}

export interface ImageFileInterface {
  /**
   * id is either a URL to the image which will contain at least one `/` or it
   * is a string `id` to find an `ImageOrigin` with the target of the
   * `imageOrigin` being a `url` or an Object URL to the image on the
   * local computer of the browser.
   */
  url: string
  /**
   * The `width` and `height `is required to know what dimensions to display
   * the image at.  Remember that during the user doing a resize, the size of
   * the displayed image may not match with the size of the image on the server
   * and that is okay.
   */
  width: number
  height: number
  maxWidth: number
  maxHeight: number
}
