import create from "zustand"
import { Entity, EntityState } from "./types"

export const createStore = (
  {
    entities = {},
  }: {
    entities: Record<string, Entity>
  } = { entities: {} }
) => {
  return create<EntityState>((set) => ({
    entities,
    setImage(id: string, entity: Entity) {
      set((state: EntityState) => ({
        entities: {
          ...state.entities,
          [id]: entity,
        },
      }))
    },
  }))
}

export const useStore = createStore()

export type UseStore = typeof useStore
