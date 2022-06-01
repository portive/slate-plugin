import { BaseEditor, Element } from "slate"
import { ReactEditor } from "slate-react"
import { HistoryEditor } from "slate-history"
import { Promisable } from "type-fest"
import { UseImageStore } from "../shared/use-store"
import { Entity } from "../shared/types"
import {
  ClientFile,
  ClientGenericFile,
  ClientImageFile,
} from "@portive/api-types"

/**
 * Entity
 */

export type ImageFileEntityProps = {
  type: "image"
  url: string
  maxSize: [number, number] // necessary for when the image is still a BLOB
}

export type GenericFileEntityProps = {
  type: "generic"
  url: string
}

export type FileEntityProps = GenericFileEntityProps | ImageFileEntityProps

export type ImageEntity = Entity<ImageFileEntityProps>
export type GenericEntity = Entity<GenericFileEntityProps>
export type FileEntity = Entity<FileEntityProps>

export type HostedImageOptions = {
  authToken: string | (() => Promisable<string>)
  path: string
  defaultResize: Resize
  minResizeWidth?: number
  maxResizeWidth?: number
  initialEntities: Record<string, FileEntity>
  createImageFile: (e: CreateImageFileProps) => Element
  createGenericFile: (e: CreateGenericFileProps) => Element
}

export type PortiveEditorProp = {
  authToken: string | (() => Promisable<string>)
  path: string
  defaultResize: Resize
  minResizeWidth: number
  maxResizeWidth: number
  // useStore: UseStore // store of entities. `initialEntities` is put into here initially.
  useStore: UseImageStore
  uploadFile: (file: File) => string
  createImageFile: (e: CreateImageFileProps) => Element
  createGenericFile: (e: CreateGenericFileProps) => Element
}

export type PortiveEditor = {
  portive: PortiveEditorProp
}

export type FullPortiveEditor = BaseEditor &
  ReactEditor &
  HistoryEditor &
  PortiveEditor

type VoidChildren = [{ text: "" }]

export interface HostedImageInterface {
  /**
   * id is either a URL to the image which will contain at least one `/` or it
   * is a string `id` to find an `ImageEntity` with the target of the
   * `imageEntity` being a `url` or an Object URL to the image on the
   * local computer of the browser.
   */
  id: string
  /**
   * The `size` is required to know what dimensions to display the image at.
   * Remember that during the user doing a resize, the size of the displayed
   * image may not match with the size of the image on the server and that is
   * okay.
   */
  size: [number, number]
  children: VoidChildren
}

export interface HostedFileInterface {
  /**
   * id is either a URL to the file which will contain at least one `/` or it
   * is a string `id` to find an `ImageEntity` with the target of the
   * `fileEneity` being a `url` or an Object URL to the file on the
   * local computer of the browser.
   */
  id: string
  children: VoidChildren
}

export type Resize = {
  type: "inside"
  width: number
  height: number
}

export type CreateImageFileProps = {
  id: string
  file: File
  clientFile: ClientImageFile
}

export type CreateGenericFileProps = {
  id: string
  file: File
  clientFile: ClientGenericFile
}
