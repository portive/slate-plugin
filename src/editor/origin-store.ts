import create from "zustand"
import { Origin, OriginState } from "../types"

/**
 * Creates an origin store using `zustand`.
 *
 * The purpose of this is to keep track of uploads and their progress but only
 * storing the key to the lookup in the Element itself. We do it this way
 * because we don't want to modify the Editor value during the upload or it
 * becomes part of the edit history.
 */
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
