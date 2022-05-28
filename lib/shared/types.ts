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

export type FileLoadingEntity<T> = {
  type: "loading"
  sentBytes: number
  totalBytes: number
} & T

export type FileUploadedEntity<T> = {
  type: "uploaded"
} & T

export type FileErrorEntity<T> = {
  type: "error"
  message: string
} & T

export type Entity<T> =
  | FileLoadingEntity<T>
  | FileUploadedEntity<T>
  | FileErrorEntity<T>

export type EntityState<T> = {
  entities: Record<string, Entity<T>>
  setEntity: (id: string, entity: Entity<T>) => void
  getEntity: (id: string) => Entity<T>
}
