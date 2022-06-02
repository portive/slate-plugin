import { Element } from "slate"
import { RenderElementProps } from "slate-react"

/**
 * Take one type and narrows it using a second type, usually on a type field
 * like:
 *
 * { type: "cat", ... } or { type: "dog", ... }
 *
 * This is typically referred to as a Discriminated Union in TypeScript.
 */
export type Discriminate<T, N> = T extends N ? T : never

/**
 * Takes as a generic `T`, a literal string value representing the `element.type`.
 *
 * Using the value from `T`, it returns the `props` for the given Slate
 * Element which was defined using something like:
 *
 * ```typescript
 * declare module "slate" {
 *   interface CustomTypes {
 *     Element: ...
 *   }
 * }
 * ```
 */
export type DiscriminatedRenderElementProps<T extends Element["type"]> =
  // Remote `element`
  Omit<RenderElementProps, "element"> & {
    // Add `element` back after having discriminated it
    element: Discriminate<Element, { type: T }>
  }

/**
 * Generates the renderElementProps for a specific known Element which makes
 * up the prop `element` along with the other known renderEelementProps like
 * `children` and `attributes`.
 */
export type RenderElementPropsFor<T> = Omit<RenderElementProps, "element"> & {
  element: T
}

export type OriginLoadingStatus<T> = {
  status: "loading"
  sentBytes: number
  totalBytes: number
} & T

export type OriginUploadedStatus<T> = {
  status: "uploaded"
} & T

export type OriginErrorStatus<T> = {
  status: "error"
  message: string
} & T

export type OriginStatus<T> =
  | OriginLoadingStatus<T>
  | OriginUploadedStatus<T>
  | OriginErrorStatus<T>

export type OriginState<T> = {
  origins: Record<string, T>
  setOrigin: (id: string, origin: T) => void
  getOrigin: (id: string) => T
}

export type UploadPolicy = {
  status: "success"
  data: {
    apiUrl: string
    fileUrl: string
    formFields: Record<string, string>
  }
}
