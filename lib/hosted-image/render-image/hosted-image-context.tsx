import React from "react"
import { ImageEntity } from "../types"
import { useContext, Dispatch, SetStateAction } from "react"
import { Editor } from "slate"

export const HostedImageContext = React.createContext<{
  editor: Editor
  entity: ImageEntity
  size: [number, number]
  setSize: Dispatch<SetStateAction<[number, number]>>
} | null>(null)

export function useHostedImageContext() {
  const context = useContext(HostedImageContext)
  if (context == null) {
    throw new Error(`Expected context to not be null`)
  }
  return context
}
