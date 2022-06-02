import create from "zustand"
import { FileOrigin } from "../hosted-image/types"
import { EntityState } from "./types"

export const createOriginStore = (
  {
    origins: origins = {},
  }: {
    origins: Record<string, FileOrigin>
  } = { origins: {} }
) => {
  return create<EntityState<FileOrigin>>((set, get) => ({
    origins,
    setOrigin(id: string, entity: FileOrigin): void {
      set((state: EntityState<FileOrigin>) => ({
        origins: {
          ...state.origins,
          [id]: entity,
        },
      }))
    },
    getOrigin(id: string): FileOrigin {
      const origin = get().origins[id]
      if (origin === undefined) {
        throw new Error(`Expected entity with id "${id}" but could not find it`)
      }
      return origin
    },
  }))
}
