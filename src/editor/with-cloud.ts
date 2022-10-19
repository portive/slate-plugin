import { createUploadStore } from "./upload-store"
import { FullCloudEditor, WithCloudEditorOptions, SaveOptions } from "../types"
import { upload } from "./upload-file"
import {
  handleInputFileChange,
  handlePasteFile,
  handleDropFile,
} from "./upload-handlers"
import { normalizeOrigins, save } from "../save"
import { getOrigins } from "../save/get-origins"
import { Client } from "@portive/client"

export function withCloud<T extends FullCloudEditor>(
  editor: T,
  {
    apiOriginUrl,
    apiKey,
    authToken,
    // images can only be resized as low as this value.
    // If the source image is less than this number, it cannot be resized
    minResizeWidth = 100,
    maxResizeWidth = 1280,
    initialMaxSize = { width: 320, height: 320 },
    initialOrigins = {},
    onUpload = () => {
      /* noop */
    },
  }: WithCloudEditorOptions
): T {
  const useStore = createUploadStore({ origins: initialOrigins })
  /**
   * Create an instance of the Portive Client
   */
  const client = new Client({ apiKey, authToken, apiOrigin: apiOriginUrl })
  editor.cloud = {
    client,
    minResizeWidth,
    maxResizeWidth,
    initialMaxSize,
    useStore,
    /**
     * Call this to initiate a file upload
     */
    uploadFile(file: File): void {
      return upload(editor, file)
    },
    /**
     * Use this in `Editable` as the `onDrop` event handler.
     * Returns `true` if the drop was handled.
     */
    handleDrop(e) {
      return handleDropFile(editor, e)
    },
    /**
     * Use this in `Editable` as the `onPaste` event handler.
     * Returns `true` if the paste was handled.
     */
    handlePaste(e) {
      return handlePasteFile(editor, e)
    },
    /**
     * Use this on an `<input type="file" />` as the `onChange` event handler.
     * Returns `true` if files were present in the Input Element and the
     * upload process was started.
     */
    handleInputFileChange(e) {
      return handleInputFileChange(editor, e)
    },
    /**
     * Waits for the files to finish uploading.
     *
     * If files finish uploading returns:
     * { status: "complete", value: Descendant[] }
     *
     * If we hit the timeout, we remove unfinished uploads and return:
     * { status: "timeout", value: Descendant[] }
     */
    async save(options: SaveOptions = {}) {
      return await save(editor, options)
    },
    normalize() {
      const origins = getOrigins(editor)
      return normalizeOrigins(editor.children, origins)
    },
    onUpload,
  }
  return editor
}
