import create from "zustand"
import { FileOrigin } from "../hosted-image/types"
import { OriginState } from "./types"

export const createOriginStore = (
  {
    origins: origins = {},
  }: {
    origins: Record<string, FileOrigin>
  } = { origins: {} }
) => {
  return create<OriginState<FileOrigin>>((set, get) => ({
    origins,
    setOrigin(id: string, origin: FileOrigin): void {
      set((state: OriginState<FileOrigin>) => ({
        origins: {
          ...state.origins,
          [id]: origin,
        },
      }))
    },
    getOrigin(id: string): FileOrigin {
      const origin = get().origins[id]
      if (origin === undefined) {
        throw new Error(`Expected origin with id "${id}" but could not find it`)
      }
      return origin
    },
  }))
}
