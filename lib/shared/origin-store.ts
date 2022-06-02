import create from "zustand"
import { FileOrigin } from "../portive/types"
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
    setOrigin(originKey: string, origin: FileOrigin): void {
      set((state: OriginState<FileOrigin>) => ({
        origins: {
          ...state.origins,
          [originKey]: origin,
        },
      }))
    },
    getOrigin(originKey: string): FileOrigin {
      const origin = get().origins[originKey]
      if (origin === undefined) {
        throw new Error(
          `Expected origin with id "${originKey}" but could not find it`
        )
      }
      return origin
    },
  }))
}
