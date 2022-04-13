import create from "zustand"
import { Entity, EntityState } from "./types"

export const createStore = (
  {
    entities = {},
  }: {
    entities: Record<string, Entity>
  } = { entities: {} }
) => {
  return create<EntityState>((set, get) => ({
    entities,
    setEntity(id: string, entity: Entity): void {
      set((state: EntityState) => ({
        entities: {
          ...state.entities,
          [id]: entity,
        },
      }))
    },
    getEntity(id: string): Entity {
      const entity = get().entities[id]
      if (entity === undefined) {
        throw new Error(`Expected entity with id "${id}" but could not find it`)
      }
      return entity
    },
  }))
}

export const useStore = createStore()

export type UseStore = typeof useStore
