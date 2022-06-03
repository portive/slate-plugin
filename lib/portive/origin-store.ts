import create from "zustand"
import { Origin, OriginState } from "./types"

export const createOriginStore = (
  {
    origins: origins = {},
  }: {
    origins: Record<string, Origin>
  } = { origins: {} }
) => {
  return create<OriginState>((set, get) => ({
    origins,
    setOrigin(originKey: string, origin: Origin): void {
      set((state: OriginState) => ({
        origins: {
          ...state.origins,
          [originKey]: origin,
        },
      }))
    },
    getOrigin(originKey: string): Origin {
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
